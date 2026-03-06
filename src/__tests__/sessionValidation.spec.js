const ORIGINAL_ENV = process.env;

const mockJsonResponse = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  text: async () => (body === null || body === undefined ? '' : JSON.stringify(body)),
  headers: {
    get: () => null,
  },
});

const loadProvider = async () => {
  process.env = {
    ...ORIGINAL_ENV,
    REACT_APP_SUPABASE_URL: 'https://example.supabase.co',
    REACT_APP_SUPABASE_ANON_KEY: 'anon-key',
  };
  const module = await import('../data/providers/supabaseProvider');
  return module.supabaseProvider;
};

describe('supabaseProvider.auth.validateSession', () => {
  beforeEach(() => {
    jest.resetModules();
    window.localStorage.clear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
    jest.clearAllMocks();
  });

  test('limpia la sesion almacenada si no hay access token', async () => {
    window.localStorage.setItem('app.supabase.session', JSON.stringify({ user: { id: 'user-1' } }));

    const provider = await loadProvider();
    const session = await provider.auth.validateSession();

    expect(session).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(JSON.parse(window.localStorage.getItem('app.supabase.session'))).toBeNull();
  });

  test('mantiene sesion valida cuando auth user responde 200', async () => {
    window.localStorage.setItem(
      'app.supabase.session',
      JSON.stringify({
        accessToken: 'token-ok',
        refreshToken: 'refresh-ok',
        tenantId: null,
        user: { id: 'user-1', email: 'user1@tigo.com', displayName: 'User 1' },
      }),
    );
    global.fetch
      .mockResolvedValueOnce(
        mockJsonResponse(200, { id: 'user-1', email: 'user1@tigo.com', user_metadata: { display_name: 'User 1' } }),
      )
      .mockResolvedValueOnce(
        mockJsonResponse(200, [{ tenant_id: 'tenant-1', display_name: 'User Uno', app_role: 'requester' }]),
      );

    const provider = await loadProvider();
    const session = await provider.auth.validateSession();

    expect(session).toBeTruthy();
    expect(session.accessToken).toBe('token-ok');
    expect(session.tenantId).toBe('tenant-1');
    expect(session.user.displayName).toBe('User Uno');
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  test('refresca token expirado y guarda la nueva sesion', async () => {
    window.localStorage.setItem(
      'app.supabase.session',
      JSON.stringify({
        accessToken: 'token-expired',
        refreshToken: 'refresh-ok',
        tenantId: null,
        user: { id: 'user-1', email: 'user1@tigo.com', displayName: 'User 1' },
      }),
    );
    global.fetch
      .mockResolvedValueOnce(mockJsonResponse(401, { message: 'jwt expired' }))
      .mockResolvedValueOnce(
        mockJsonResponse(200, {
          access_token: 'token-new',
          refresh_token: 'refresh-new',
          user: { id: 'user-1', email: 'user1@tigo.com', user_metadata: { display_name: 'User 1' } },
        }),
      )
      .mockResolvedValueOnce(
        mockJsonResponse(200, { id: 'user-1', email: 'user1@tigo.com', user_metadata: { display_name: 'User 1' } }),
      )
      .mockResolvedValueOnce(
        mockJsonResponse(200, [{ tenant_id: 'tenant-1', display_name: 'User Uno', app_role: 'requester' }]),
      );

    const provider = await loadProvider();
    const session = await provider.auth.validateSession();
    const persistedSession = JSON.parse(window.localStorage.getItem('app.supabase.session'));

    expect(session).toBeTruthy();
    expect(session.accessToken).toBe('token-new');
    expect(session.refreshToken).toBe('refresh-new');
    expect(persistedSession.accessToken).toBe('token-new');
    expect(global.fetch).toHaveBeenCalledTimes(4);
  });
});

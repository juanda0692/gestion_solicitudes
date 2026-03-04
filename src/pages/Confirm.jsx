import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Confirm() {
  const { state } = useLocation() || {};
  const ok = Boolean(state?.ok);
  const id = state?.solicitudId;
  const items = state?.items ?? 0;
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-center px-4 mt-10 sm:mt-16">
      <div className="ui-card w-full max-w-lg p-6 sm:p-7 text-center">
        <h1 className={`text-3xl font-bold ${ok ? 'text-green-600' : 'text-red-600'}`}>
          {ok ? 'Exito' : 'Hubo un problema'}
        </h1>
        <p className="mt-2 mb-6 text-slate-700">
          {ok
            ? (id ? `Solicitud registrada (${items} items).` : 'Solicitud registrada.')
            : (state?.error || 'No se pudo crear la solicitud')}
        </p>
        <div className="space-y-3">
          <button
            type="button"
            className="ui-btn ui-btn-cyan"
            onClick={() =>
              navigate('/', {
                replace: true,
                state: {
                  view: 'channel-menu',
                  channelId: state?.channelId || '',
                  pdvId: state?.pdvId,
                  pdvName: state?.pdvName || '',
                  tradeType: state?.tradeType || '',
                },
              })
            }
          >
            Volver al canal
          </button>
          <Link to="/" className="block ui-btn ui-btn-primary leading-[48px]">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

import { isSupabaseMode } from '../app/env';
import { fakeProvider } from './providers/fakeProvider';
import { supabaseProvider } from './providers/supabaseProvider';

export const dataProvider = isSupabaseMode ? supabaseProvider : fakeProvider;

export default dataProvider;


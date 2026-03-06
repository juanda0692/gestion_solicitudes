import { dataProvider } from '../data';

export const getSession = () => dataProvider.auth.getSession();
export const validateSession = () =>
  (typeof dataProvider.auth.validateSession === 'function'
    ? dataProvider.auth.validateSession()
    : dataProvider.auth.getSession());
export const signIn = (credentials) => dataProvider.auth.signIn(credentials);
export const signOut = () => dataProvider.auth.signOut();

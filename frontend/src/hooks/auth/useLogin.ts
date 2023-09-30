import { useCallback } from 'react';
import { useRouter } from 'next/router';
import useAuthProvider from './useAuthProvider';
import { JwtTokenSet } from 'src/@types/token';
import { PATH_ADMIN } from '../../routes/paths';

type Login = (tokens: JwtTokenSet, redirectTo?: string) => Promise<any>;

/**
 * Get a callback for calling the authProvider.login() method
 * and redirect to the previous authenticated page (or the home page) on success.
 *
 * @see useAuthProvider
 *
 * @returns {Function} login callback
 */
const useLogin = (): Login => {
  const authProvider = useAuthProvider();
  const { push } = useRouter();

  const callLogin: Login = useCallback(
    async (tokens, redirectTo = PATH_ADMIN.general.dashboard) => {
      await authProvider.login(tokens);

      push(redirectTo);
    },
    [authProvider, push],
  );

  return callLogin;
};

export default useLogin;

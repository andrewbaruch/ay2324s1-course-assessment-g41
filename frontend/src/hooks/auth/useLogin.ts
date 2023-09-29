import { useCallback } from 'react';
import { useRouter } from 'next/router';
import useAuthProvider from './useAuthProvider';
import { JwtTokenSet } from 'src/@types/token';
import { PATH_QUESTIONS } from '../../routes/paths';

type Login = (tokens: JwtTokenSet, redirectTo?: string) => Promise<any>;

/**
 * Get a callback for calling the authProvider.login() method
 * and redirect to the previous authenticated page (or the home page) on success.
 *
 * @see useAuthProvider
 *
 * @returns {Function} login callback
 *
 * @example
 *
 * const LoginButton = () => {
 *     const [loading, setLoading] = useState(false);
 *     const login = useLogin();
 *     const handleClick = {
 *         setLoading(true);
 *         login({ username: 'john', password: 'p@ssw0rd' }, '/posts')
 *             .then(() => setLoading(false));
 *     }
 *     return <button onClick={handleClick}>Login</button>;
 * }
 */
const useLogin = (): Login => {
  const authProvider = useAuthProvider();
  const { push } = useRouter();

  const callLogin: Login = useCallback(
    async (tokens, redirectTo = PATH_QUESTIONS.root) => {
      await authProvider.login(tokens);

      push(redirectTo);
    },
    [authProvider, push],
  );

  return callLogin;
};

export default useLogin;

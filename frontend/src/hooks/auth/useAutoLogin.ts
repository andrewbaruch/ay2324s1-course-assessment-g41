import { useEffect } from 'react';
import { ACCESS_TOKEN, REFRESH_TOKEN } from 'src/utils/jwt';
import { useToast } from '@chakra-ui/react';
import useLogin from './useLogin';
import { PATH_QUESTIONS } from '@/routes/paths';
import { useRouter } from 'next/router';

/**
 * Tries to login using the session tokens found in the URL params.
 */
const useAutoLogin = () => {
  const login = useLogin();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const callLogin = async () => {
      const accessToken = router.query[ACCESS_TOKEN] as string;
      const refreshToken = router.query[REFRESH_TOKEN] as string;

      if (accessToken === undefined || refreshToken === undefined) {
        return;
      }

      try {
        await login(
          {
            accessToken,
            refreshToken,
          },
          // karwi: use dynamic redirect path
          //   redirectPath?.to,
          PATH_QUESTIONS.root,
        );
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to login using the tokens in the url params.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    };

    callLogin();
  }, [toast, login, router.query]);
};

export default useAutoLogin;

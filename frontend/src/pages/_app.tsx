import { Provider } from 'react-redux';
import { store } from 'src/store';
import { AppProps } from 'next/app';
import { NextPage } from 'next';
import { ProfileProvider } from '@/contexts/auth/ProfileContext';
import { jwtAuthProvider } from '@/authProviders/jwt';
import SignIn from './login';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'src/theme/theme';

interface MyAppProps extends AppProps {
  Component: NextPage;
  // karwi: use dynamic import
  // authProvider: AuthProvider;
}

// karwi: add a 404 page
// karwi: fix css flicker when refresh

export default function MyApp(props: MyAppProps) {
  const { Component, pageProps } = props;

  return (
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <ProfileProvider authProvider={jwtAuthProvider}>
          <Component {...pageProps} />
        </ProfileProvider>
      </Provider>
    </ChakraProvider>
  );
}

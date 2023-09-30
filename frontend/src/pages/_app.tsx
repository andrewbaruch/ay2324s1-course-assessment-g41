import { Provider } from 'react-redux';
import { store } from 'src/store';
import { AppProps } from 'next/app';
import { NextPage } from 'next';
import { ProfileProvider } from '@/contexts/auth/ProfileContext';
import ThemeProvider from './ThemeProvider';
import { authProviderFactory } from '../authProviders';
import { DEFAULT_AUTH_PROVIDER } from '../config';
import { AuthProvider } from 'src/@types/auth';
import { AppContext } from 'next/app';
import { useEffect } from 'react';
import { jwtAuthProvider } from '@/authProviders/jwt';

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
    <Provider store={store}>
      <ProfileProvider authProvider={jwtAuthProvider}>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </ProfileProvider>
    </Provider>
  );
}

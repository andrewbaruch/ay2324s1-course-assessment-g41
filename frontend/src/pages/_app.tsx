// pages/_app.js or pages/_app.tsx

import { useEffect } from 'react';
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

interface MyAppProps extends AppProps {
  Component: NextPage;
  authProvider: AuthProvider;
}

export default function MyApp(props: MyAppProps) {
  const { Component, pageProps, authProvider } = props;

  return (
    <Provider store={store}>
      <ProfileProvider authProvider={authProvider}>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </ProfileProvider>
    </Provider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const { Component, ctx } = appContext;

  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  const authProvider = await authProviderFactory(DEFAULT_AUTH_PROVIDER);

  return { pageProps, authProvider };
};

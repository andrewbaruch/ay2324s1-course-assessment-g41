import { Provider } from 'react-redux';
import { store } from 'src/store';
import { AppProps } from 'next/app';
import { NextPage } from 'next';
import { ProfileProvider } from '@/contexts/auth/ProfileContext';
import { jwtAuthProvider } from '@/authProviders/jwt';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'src/theme/theme';
import 'src/styles/App.css';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

interface MyAppProps extends AppProps {
  Component: NextPageWithLayout;
}

// karwi: add a 404 page
// karwi: fix css flicker when refresh

export default function MyApp(props: MyAppProps) {
  const { Component, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <ProfileProvider authProvider={jwtAuthProvider}>
          {getLayout(<Component {...pageProps} />)}
        </ProfileProvider>
      </Provider>
    </ChakraProvider>
  );
}

'use client';
import React, { ReactNode } from 'react';
import 'src/styles/App.css';
import 'src/styles/Contact.css';
import 'src/styles/MiniCalendar.css';
import { ChakraProvider } from '@chakra-ui/react';
import { CacheProvider } from '@chakra-ui/next-js';
import theme from '../theme/theme';
import { ProfileProvider } from '@/contexts/auth/ProfileContext';
import { jwtAuthProvider } from '@/authProviders/jwt';
import { Provider } from 'react-redux';
import { store } from 'src/store';

export default function AppWrappers({ children }: { children: ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <Provider store={store}>
          <ProfileProvider authProvider={jwtAuthProvider}>
            {children}
          </ProfileProvider>
        </Provider>
      </ChakraProvider>
    </CacheProvider>
  );
}

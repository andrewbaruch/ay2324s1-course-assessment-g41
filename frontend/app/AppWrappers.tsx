'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import 'src/styles/App.css';
import 'src/styles/Contact.css';
import 'src/styles/MiniCalendar.css';
import { ChakraProvider } from '@chakra-ui/react';
import { CacheProvider } from '@chakra-ui/next-js';
import theme from '../src/theme/theme';
import { ProfileProvider } from '@/contexts/auth/ProfileContext';
import { jwtAuthProvider } from '@/authProviders/jwt';
import { Provider } from 'jotai';

export default function AppWrappers({ children }: { children: ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
          <ProfileProvider authProvider={jwtAuthProvider}>
            {children}
          </ProfileProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
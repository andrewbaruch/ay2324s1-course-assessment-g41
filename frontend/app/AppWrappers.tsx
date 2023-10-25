"use client";
import React, { ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { CacheProvider } from "@chakra-ui/next-js";
import theme from "../src/theme/theme";
import { ProfileProvider } from "@/contexts/auth/ProfileContext";
import { googleAuthProvider } from "@/authProviders/google";

export default function AppWrappers({ children }: { children: ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <ProfileProvider authProvider={googleAuthProvider}>{children}</ProfileProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}

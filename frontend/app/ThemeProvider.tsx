"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { Box, ChakraProvider, Container, extendTheme } from "@chakra-ui/react";
import { Header } from "@/components/header";
import { PropsWithChildren } from "react";

const theme = extendTheme({});

const ThemeProvider = ({ children }: PropsWithChildren) => {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <Box as="section" height="100vh" overflowY="auto" bgColor="gray.50">
          <Header />
          <Container maxW="8xl" height="90vh" p={4}>
            {children}
          </Container>
        </Box>
      </ChakraProvider>
    </CacheProvider>
  );
};
export default ThemeProvider;

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
        <Box as="section" height="100vh" overflowY="auto">
          <Header />
          <Container
            maxW="8xl"
            pb={{ base: 12, lg: 24 }}
            pt={{ base: 8, lg: 12 }}
          >
            {children}
          </Container>
        </Box>
      </ChakraProvider>
    </CacheProvider>
  );
};
export default ThemeProvider;

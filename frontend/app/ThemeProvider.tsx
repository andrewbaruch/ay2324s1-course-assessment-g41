"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { Box, ChakraProvider, Container, extendTheme } from "@chakra-ui/react";
import { Header } from "@/components/header";
import { PropsWithChildren, useEffect, useRef, useState } from "react";

const theme = extendTheme({});

const ThemeProvider = ({ children }: PropsWithChildren) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState("0px");

  useEffect(() => {
    if (!headerRef?.current) return;
    setHeaderHeight(
      `${
        headerRef.current && headerRef.current.clientHeight
          ? headerRef.current.clientHeight
          : 0
      }px`
    );
  }, [headerRef, headerRef?.current]);

  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <Box as="section" height="100vh" overflowY="auto" bgColor="gray.50">
          <Box ref={headerRef}>
            <Header />
          </Box>
          <Container
            maxW="8xl"
            p={4}
            h={`calc(100% - ${headerHeight})`}
            maxH={`calc(100% - ${headerHeight})`}
            overflowY="auto"
          >
            {children}
          </Container>
        </Box>
      </ChakraProvider>
    </CacheProvider>
  );
};
export default ThemeProvider;

'use client';
// Chakra imports
import {
  Portal,
  Box,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react';
import Footer from 'src/components/footer/FooterAdmin';
// Layout components
import Navbar from 'src/components/navbar/NavbarAdmin';
import Sidebar from 'src/components/sidebar/Sidebar';
import { SidebarContext } from 'src/contexts/SidebarContext';
import { PropsWithChildren, useEffect, useState } from 'react';
import {
  getActiveNavbar,
  getActiveNavbarText,
  getActiveRoute,
} from 'src/utils/navigation';
import routes from '@/routes';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps extends PropsWithChildren {
  [x: string]: any;
}

// Custom Chakra theme
export default function AdminLayout(props: DashboardLayoutProps) {
  const { children, ...rest } = props;
  // states and functions
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  // functions for changing the states from components
  const { onOpen } = useDisclosure();

  // your state initializations with route-dependent values
  const [brandText, setBrandText] = useState(getActiveRoute(routes));
  const [secondary, setSecondary] = useState(getActiveNavbar(routes));
  const [message, setMessage] = useState(getActiveNavbarText(routes));

  // this triggers every time the pathname changes
  useEffect(() => {
    setBrandText(getActiveRoute(routes));
    setSecondary(getActiveNavbar(routes));
    setMessage(getActiveNavbarText(routes));
  }, [usePathname()]);

  useEffect(() => {
    console.log('karwi: rerender admin layout');
    window.document.documentElement.dir = 'ltr';
  });

  const bg = useColorModeValue('secondaryGray.300', 'navy.900');

  return (
    <Box h="100vh" w="100vw" bg={bg}>
      <SidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar,
        }}
      >
        <Sidebar routes={routes} display="none" {...rest} />
        <Box
          float="right"
          minHeight="100vh"
          height="100%"
          overflow="auto"
          position="relative"
          maxHeight="100%"
          w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
          maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
        >
          <Portal>
            <Box>
              <Navbar
                onOpen={onOpen}
                logoText={'PeerPrep Dashboard PRO'}
                brandText={brandText}
                secondary={secondary}
                message={message}
                fixed={fixed}
                {...rest}
              />
            </Box>
          </Portal>

          <Box
            mx="auto"
            p={{ base: '20px', md: '30px' }}
            pe="20px"
            minH="100vh"
            pt="50px"
          >
            {children}
          </Box>
          <Box>
            <Footer />
          </Box>
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
}

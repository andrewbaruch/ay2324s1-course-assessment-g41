// Chakra imports
import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import Footer from 'src/components/footer/FooterAuth';
import FixedPlugin from 'src/components/fixedPlugin/FixedPlugin';
// Custom components
import Link from 'next/link';
// Assets
import { FaChevronLeft } from 'react-icons/fa';

function AuthIllustration(props: {
  children: JSX.Element | string;
  illustrationBackground: string;
}) {
  const { children, illustrationBackground } = props;
  // Chakra color mode
  return (
    <Flex position="relative" h="max-content">
      <Flex
        h={{
          sm: 'initial',
          md: 'unset',
          lg: '100vh',
          xl: '97vh',
        }}
        w="100%"
        maxW={{ md: '66%', lg: '1313px' }}
        mx="auto"
        pt={{ sm: '50px', md: '0px' }}
        px={{ lg: '30px', xl: '0px' }}
        ps={{ xl: '70px' }}
        justifyContent="start"
        direction="column"
      >
        {children}
        <Box
          display="block"
          h="100%"
          minH="100vh"
          w={{ lg: '50vw', '2xl': '44vw' }}
          position="absolute"
          right="0px"
          borderBottomLeftRadius={{ lg: '120px', xl: '200px' }}
          overflow={'hidden'}
        >
          <video
            src={illustrationBackground}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
            }}
            autoPlay
            muted
            loop
          />
        </Box>
        <Footer />
      </Flex>
      <FixedPlugin />
    </Flex>
  );
}
// PROPS

AuthIllustration.propTypes = {
  illustrationBackground: PropTypes.string,
  image: PropTypes.any,
};

export default AuthIllustration;

'use client';

// Chakra imports
import { Box, Grid } from '@chakra-ui/react';
// import AdminLayout from '@/views/admin';

// Custom components
import Banner from 'src/views/admin/profile/components/Banner';
import General from 'src/views/admin/profile/components/General';
import Notifications from 'src/views/admin/profile/components/Notifications';
import Projects from 'src/views/admin/profile/components/Projects';
import Storage from 'src/views/admin/profile/components/Storage';
import Upload from 'src/views/admin/profile/components/Upload';

// Assets
import banner from 'src/img/auth/banner.png';
import avatar from 'src/img/avatars/avatar4.png';
import useAuthenticated from '@/hooks/guards/useAuthenticated';

export default function ProfileOverview() {
  // karwi: uncomment later
  // useAuthenticated();

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* Main Fields */}
      {/* <Grid
        templateColumns={{
          base: '1fr',
          lg: '1.34fr 1fr 1.62fr',
        }}
        templateRows={{
          base: 'repeat(3, 1fr)',
          lg: '1fr',
        }}
        gap={{ base: '20px', xl: '20px' }}
      >
      
        <Storage
          gridArea={{ base: '2 / 1 / 3 / 2', lg: '1 / 2 / 2 / 3' }}
          used={25.6}
          total={50}
        />
        <Upload
          gridArea={{
            base: '3 / 1 / 4 / 2',
            lg: '1 / 3 / 2 / 4',
          }}
          minH={{ base: 'auto', lg: '420px', '2xl': '365px' }}
          pe="20px"
          pb={{ base: '100px', lg: '20px' }}
        />
      </Grid> */}
      <Grid
        mb="20px"
        templateColumns={{
          base: '1fr',
          lg: 'repeat(2, 1fr)',
          '2xl': '1.34fr 1.62fr 1fr',
        }}
        templateRows={{
          base: '1fr',
          lg: 'repeat(2, 1fr)',
          '2xl': '1fr',
        }}
        gap={{ base: '20px', xl: '20px' }}
      >
        {/* <Banner
          // karwi: fix grid area
          gridArea="1 / 1 / 2 / 2"
          banner={banner}
          avatar={avatar}
          name="Adela Parkson"
          job="NUS CS Undergraduate"
          posts="17"
          followers="9.7k"
          following="274"
        /> */}
        <General
          gridArea={{ base: '1 / 1 / 2 / 3', lg: '1 / 1 / 2 / 4' }}
          minH="365px"
          pe="20px"
        />
        {/* <Notifications
          used={25.6}
          total={50}
          gridArea={{
            base: '3 / 1 / 4 / 2',
            lg: '2 / 1 / 3 / 3',
            '2xl': '1 / 3 / 2 / 4',
          }}
        /> */}
      </Grid>
    </Box>
  );
}

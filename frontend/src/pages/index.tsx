import useAutoLogin from '@/hooks/auth/useAutoLogin';
import { Box, Heading, Text, Button, List, ListItem } from '@chakra-ui/react';

// karwi: create a settings page (authenticated)
export default function Home() {
  useAutoLogin();

  return (
    <Box p={10}>
      <Box mb={5}>
        <Heading size="2xl">Welcome to PeerPrep</Heading>
        <Text mt={5} fontSize="xl">
          PeerPrep is a technical interview preparation platform that matches
          peers to practice whiteboard-style interview questions together.
        </Text>
      </Box>

      <Box mb={5}>
        <Heading size="lg">Features</Heading>
        <List spacing={3} mt={5}>
          <ListItem>User Service for user profile management</ListItem>
          <ListItem>
            Matching Service for matching users based on difficulty level,
            topics and proficiency level, etc
          </ListItem>
          <ListItem>
            Question Service for maintaining a question repository indexed by
            difficulty level and specific topics
          </ListItem>
          <ListItem>
            Collaboration Service for real-time collaboration, enabling
            concurrent code editing between authenticated and matched users
          </ListItem>
          <ListItem>
            Deployment options for both local and staging environments.
          </ListItem>
        </List>
      </Box>

      <Button colorScheme="teal" size="lg">
        Get Started
      </Button>
    </Box>
  );
}

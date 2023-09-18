import { Box, Button, Container, HStack } from "@chakra-ui/react";

export const Header = () => {
  return (
    <Box w="100%" boxShadow="sm" bgColor={"gray.500"}>
      <Container maxW="8xl" py={4} px={{ base: 4, lg: 0 }}>
        <HStack w="full">
          <Button>Discover</Button>
          <Button>Add Question</Button>
        </HStack>
      </Container>
    </Box>
  );
};

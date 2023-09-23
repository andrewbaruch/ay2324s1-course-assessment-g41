import { useHeaderTab } from "@/hooks/useHeaderTabs";
import { Box, Button, Container, HStack } from "@chakra-ui/react";

export const Header = () => {
  const { goToBrowsePage } = useHeaderTab();

  return (
    <Box w="100%" boxShadow="sm" bgColor={"gray.500"} h="10vh">
      <Container maxW="8xl" p={4}>
        <HStack w="full">
          <Button onClick={goToBrowsePage}>Browse</Button>
        </HStack>
      </Container>
    </Box>
  );
};

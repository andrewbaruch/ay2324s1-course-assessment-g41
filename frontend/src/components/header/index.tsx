import { useHeaderTab } from "@/hooks/useHeaderTabs";
import { Box, Button, Container, HStack, Image } from "@chakra-ui/react";

export const Header = () => {
  const { goToBrowsePage } = useHeaderTab();

  return (
    <Container
      w="100%"
      bgColor={"white"}
      h="10vh"
      borderWidth={1}
      maxW="8xl"
      p={2}
    >
      <HStack w="full" h="100%">
        <Box
          w={180}
          alignSelf={"center"}
          _hover={{ cursor: "pointer" }}
          onClick={goToBrowsePage}
        >
          <Image src={"./logo.svg"} objectFit={"cover"} />
        </Box>

        <Button onClick={goToBrowsePage}>Browse</Button>
      </HStack>
    </Container>
  );
};

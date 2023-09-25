import { useHeaderTab } from "@/hooks/useHeaderTabs";
import { Box, HStack, Image } from "@chakra-ui/react";

export const Header = () => {
  const { goToBrowsePage } = useHeaderTab();

  return (
    <Box
      w="100%"
      minW="100vw"
      bgColor={"white"}
      minH="10vh"
      borderWidth={1}
      p={2}
      display="flex"
      alignItems="center"
    >
      <HStack w="100%" h="100%">
        <Box w={180} _hover={{ cursor: "pointer" }} onClick={goToBrowsePage}>
          <Image src={"./logo.svg"} />
        </Box>
      </HStack>
    </Box>
  );
};

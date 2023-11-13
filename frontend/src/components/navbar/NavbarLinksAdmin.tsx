"use client";
// Chakra Imports
import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom Components
import { SearchBar } from "src/components/navbar/searchBar/SearchBar";
import { SidebarResponsive } from "src/components/sidebar/Sidebar";
// Assets
import { IoMdMoon, IoMdSunny } from "react-icons/io";
import routes from "@/routes";
import useLogout from "@/hooks/auth/useLogout";
import { useRouter } from "next/navigation";
import { PATH_MAIN } from "@/routes/paths";
import useGetIdentity from "@/hooks/auth/useGetIdentity";
import { NextAvatar } from "../image/Avatar";
import MatchButton from "./MatchButton";
export default function HeaderLinks(props: { secondary: boolean }) {
  const { secondary } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  const logout = useLogout();
  const router = useRouter();
  const { identity } = useGetIdentity();

  // Chakra Color Mode
  const navbarIcon = useColorModeValue("gray.400", "white");
  let menuBg = useColorModeValue("white", "navy.800");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.700", "brand.100");
  const ethColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("#E6ECFA", "rgba(135, 140, 189, 0.3)");
  const ethBg = useColorModeValue("secondaryGray.300", "navy.900");
  const ethBox = useColorModeValue("white", "navy.800");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)",
  );
  const borderButton = useColorModeValue("secondaryGray.500", "whiteAlpha.200");

  return (
    <Flex
      w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: "wrap", md: "nowrap" } : "unset"}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      <MatchButton size="md" mb={secondary ? { base: "10px", md: "unset" } : "unset"} me="10px" />
      <SidebarResponsive routes={routes} />
      <Button
        variant="no-hover"
        bg="transparent"
        p="0px"
        minW="unset"
        minH="unset"
        h="18px"
        w="max-content"
        onClick={toggleColorMode}
      >
        <Icon
          me="10px"
          h="18px"
          w="18px"
          color={navbarIcon}
          as={colorMode === "light" ? IoMdMoon : IoMdSunny}
        />
      </Button>
      <Menu>
        <MenuButton p="0px" style={{ position: "relative" }}>
          <Box
            _hover={{ cursor: "pointer" }}
            color="white"
            bg="#11047A"
            w="40px"
            h="40px"
            borderRadius={"50%"}
          />
          <Center top={0} left={0} position={"absolute"} w={"100%"} h={"100%"}>
            <NextAvatar h={"40px"} w={"40px"} src={identity.image ?? ""} />
          </Center>
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          <Flex w="100%" mb="0px">
            <Text
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="sm"
              fontWeight="700"
              color={textColor}
            >
              👋&nbsp; Hey, {identity.name}
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px">
            <MenuItem
              _hover={{ bg: "none" }}
              _focus={{ bg: "none" }}
              borderRadius="8px"
              px="14px"
              bg={menuBg}
              onClick={() => router.push(PATH_MAIN.general.profile)}
            >
              <Text fontSize="sm">Profile Settings</Text>
            </MenuItem>
            <MenuItem
              _hover={{ bg: "none" }}
              _focus={{ bg: "none" }}
              color="red.400"
              borderRadius="8px"
              px="14px"
              bg={menuBg}
              onClick={() => logout()}
            >
              <Text fontSize="sm">Log out</Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}

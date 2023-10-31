import {
  Stack,
  Text,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";

import React from "react";
import { useForm } from "react-hook-form";
// import { useHeaderTab } from "@/hooks/useHeaderTabs";

export const Room = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({});
  // const { goToCodingPage } = useHeaderTab();

  return (
    <Stack
      px={6}
      py={8}
      bgColor="white"
      borderRadius={12}
      borderColor="gray.100"
      borderWidth={1}
      overflowY="auto"
      height="100%"
      display="flex"
    >
      <Text color="gray.500">This is a test collab room.</Text>
    </Stack>
  );
};

import {
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Stack,
  Text,
  Button,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  CheckboxGroup,
  Checkbox,
  SimpleGrid,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";

import { QuestionComplexity } from "@/types/models/question";
import { useForm } from "react-hook-form";
import { useHeaderTab } from "@/hooks/useHeaderTabs";

export const MatchingForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({});
  const { goToCodingPage } = useHeaderTab();
  const toast = useToast();

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
      <Heading fontWeight="bold">Peer Matching</Heading>

      <Text color="gray.500">
        Match with a peer to tackle problems together! Feel free to choose the
        complexity of the question and we will pair you up with someone similar.
      </Text>

      <Stack spacing={2} display="flex" px={0}>
        <FormControl isInvalid={errors.complexity ? true : false}>
          <FormLabel htmlFor="complexity">Complexity</FormLabel>
          <Select
            id="complexity"
            placeholder={"Select an option"}
            shadow="sm"
            size="sm"
            w="full"
            rounded="md"
            focusBorderColor="gray.500"
            {...register("complexity", {
              required: "Complexity of the question is required.",
            })}
          >
            {Object.values(QuestionComplexity).map((complexity) => (
              <option>{complexity}</option>
            ))}
          </Select>
          {errors.complexity ? (
            <FormErrorMessage>{errors.complexity.message}</FormErrorMessage>
          ) : null}
        </FormControl>
      </Stack>

      <Button
        type="submit"
        onClick={handleSubmit((data) => {
          try {
            //   match({
            //     id: question.id,
            //     categories: data.categories ? data.categories : [],
            //     title: data.title,
            //     description: data.description,
            //     complexity: data.complexity,
            //   });
            goToCodingPage();
          } catch (err) {
            toast({
              status: "error",
              description:
                err?.message ||
                "Unknown error encountered. Please try again later.",
              isClosable: true,
              duration: 3000,
              position: "bottom",
            });
          }
        })}
        w="fit-content"
        py={2}
        size="sm"
      >
        Match
      </Button>
    </Stack>
  );
};

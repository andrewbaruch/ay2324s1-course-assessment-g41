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
} from "@chakra-ui/react";

import { Question, QuestionComplexity } from "@/types/models/question";
import { useForm } from "react-hook-form";
import { useQuestionList } from "@/hooks/useQuestionList";
import { QuestionDetails } from "./QuestionDetails";
import { useHeaderTab } from "@/hooks/useHeaderTabs";

export const QuestionForm = ({
  question = null,
}: {
  question: Question | null;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: question
      ? { ...question, categories: question.categories[0] || "" }
      : undefined,
  });
  const { addQuestion, editQuestion } = useQuestionList();
  const { goToBrowsePage } = useHeaderTab();

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
      <Heading fontWeight="bold">Question Details</Heading>
      <Text fontSize="lg">Add a question!</Text>
      <Text color="gray.500">
        You can record questions you encountered in your technical interviews.
        By saving a question here, you can easily use the question for practice
        with your peers again.
      </Text>
      <Tabs variant="soft-rounded" flex={1}>
        <TabList px={0}>
          <Tab>Input</Tab>
          <Tab>Preview</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <Stack spacing={2} display="flex" px={0}>
              <FormControl>
                <FormLabel htmlFor="title">Question Title</FormLabel>
                <Input
                  type="text"
                  id="title"
                  shadow="sm"
                  size="sm"
                  w="full"
                  rounded="md"
                  focusBorderColor="gray.500"
                  {...register("title")}
                  defaultValue={question ? question.title : undefined}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="complexity">Complexity</FormLabel>
                <Select
                  id="complexity"
                  placeholder={"Select an option"}
                  shadow="sm"
                  size="sm"
                  w="full"
                  rounded="md"
                  focusBorderColor="gray.500"
                  {...register("complexity")}
                  defaultValue={question ? question.complexity : undefined}
                >
                  {Object.values(QuestionComplexity).map((complexity) => (
                    <option>{complexity}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="title">Description</FormLabel>
                <Textarea
                  placeholder="Describe the problem details. You may write in Markdown."
                  size="sm"
                  focusBorderColor="gray.500"
                  defaultValue={question ? question.description : undefined}
                  {...register("description")}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="categories">Topics</FormLabel>
                <Select
                  id="categories"
                  placeholder={"Select an option"}
                  shadow="sm"
                  size="sm"
                  w="full"
                  rounded="md"
                  focusBorderColor="gray.500"
                  defaultValue={question ? question.categories : undefined}
                  {...register("categories")}
                >
                  <option>DFS</option>
                </Select>
              </FormControl>
            </Stack>
          </TabPanel>

          <TabPanel px={0}>
            <QuestionDetails
              title={watch("title")}
              complexity={watch("complexity")}
              categories={[watch("categories")]}
              description={watch("description")}
              id={-1}
              isPreview={true}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Button
        type="submit"
        onClick={handleSubmit((data) => {
          question
            ? editQuestion({
                id: question.id,
                categories: data.categories ? [data.categories] : [],
                title: data.title,
                description: data.description,
                complexity: data.complexity,
              })
            : addQuestion({
                categories: data.categories ? [data.categories] : [],
                title: data.title,
                description: data.description,
                complexity: data.complexity,
              });

          goToBrowsePage();
        })}
        w="fit-content"
        py={2}
        size="sm"
      >
        Confirm
      </Button>
    </Stack>
  );
};

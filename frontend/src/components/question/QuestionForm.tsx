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
} from "@chakra-ui/react";

import { QuestionComplexity } from "@/types/models/question";
import { useForm } from "react-hook-form";
import { useQuestionList } from "@/hooks/useQuestionList";

export const QuestionForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { addQuestion } = useQuestionList();

  return (
    <Stack>
      <Heading fontWeight="bold">Question Details</Heading>

      <Text fontSize="lg">Add a question!</Text>
      <Text color="gray.500">
        You can record questions you encountered in your technical interviews.
        By saving a question here, you can easily use the question for practice
        with your peers again.
      </Text>

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
        >
          {Object.values(QuestionComplexity).map((complexity) => (
            <option>{complexity}</option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="title">Description</FormLabel>
        <Textarea
          placeholder="Describe the problem details."
          size="sm"
          focusBorderColor="gray.500"
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
          {...register("categories")}
        >
          <option>DFS</option>
        </Select>
      </FormControl>

      <Button
        type="submit"
        onClick={handleSubmit((data) =>
          addQuestion({
            categories: data.categories ? [data.categories] : [],
            title: data.title,
            description: data.description,
            complexity: data.complexity,
          })
        )}
        w="fit-content"
      >
        Submit Form
      </Button>
    </Stack>
  );
};

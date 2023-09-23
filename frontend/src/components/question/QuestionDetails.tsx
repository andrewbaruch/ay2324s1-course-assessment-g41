import { useQuestionList } from "@/hooks/useQuestionList";
import { Question } from "@/types/models/question";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Flex,
  Button,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { QuestionForm } from "./QuestionForm";

export const QuestionDetails = ({
  title,
  complexity,
  description,
  id,
  categories,
}: Question) => {
  const { removeQuestion } = useQuestionList();
  const [isEdit, setIsEdit] = useState(false);

  return !isEdit ? (
    <Flex
      direction="column"
      px={6}
      py={8}
      bgColor="white"
      borderRadius={12}
      borderColor="gray.100"
      borderWidth={1}
      overflowY="auto"
      height="100%"
    >
      <Stack spacing={4} flex={1}>
        <Heading fontWeight="medium" size={"md"}>
          {title}
        </Heading>
        <Badge variant="subtle" colorScheme="blue" w="fit-content">
          {complexity}
        </Badge>
        <Text color="muted">{description}</Text>

        <Accordion allowToggle>
          <AccordionItem>
            <AccordionButton px={0} _hover={{}}>
              <Box as="span" textAlign="left" flex={1} fontWeight={500}>
                Topics
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px={0}>
              {categories.map((cat) => (
                <Badge>{cat}</Badge>
              ))}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Stack>
      <HStack>
        <Button onClick={() => setIsEdit(!isEdit)}>Edit</Button>
        <Button onClick={() => removeQuestion({ id })}>Delete</Button>
      </HStack>
    </Flex>
  ) : (
    <QuestionForm
      question={{
        title,
        complexity,
        description,
        id,
        categories,
      }}
    />
  );
};

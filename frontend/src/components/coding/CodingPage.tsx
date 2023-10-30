import { useHeaderTab } from "@/hooks/useHeaderTabs";
import ReactMarkdown from "react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";

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
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { QuestionDetails } from "../question/QuestionDetails";
import { Question, QuestionCategories, QuestionComplexity } from "@/types/models/question";
import { ComplexityBadge } from "../complexity";
import { CodeEditor } from "./CodeEditor";

export const CodingPage = (codingQuestion: Question) => {
  const { goToBrowsePage } = useHeaderTab();

  return (
    <Flex
      direction="column"
      px={0}
      py={0}
      bgColor={"white"}
      borderRadius={12}
      borderColor="gray.100"
      borderWidth={0}
      overflowY="auto"
      height="100%"
      minH="45vh"
      gap={4}
      // minWidth="max-content"
    >
      {/* <HStack> */}
      {/* <QuestionDetails
        title={codingQuestion.title}
        complexity={codingQuestion.complexity}
        categories={codingQuestion.categories}
        description={codingQuestion.description}
        id={codingQuestion.id}
        isPreview={true}
      /> */}
      <QuestionDetails
        title={"title"}
        complexity={QuestionComplexity.EASY}
        categories={[QuestionCategories.BIT_OPERATION, QuestionCategories.DIVIDE_AND_CONQUER]}
        description={"description"}
        id={-1}
        isPreview={true}
      />
      <CodeEditor />

      {/* </HStack> */}
    </Flex>
  );
};

import { useHeaderTab } from "@/hooks/useHeaderTabs";
import { Question } from "@/types/models/question";
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

export const CodeEditor = () => {
  return <Textarea placeholder="Type your code here" />;
};

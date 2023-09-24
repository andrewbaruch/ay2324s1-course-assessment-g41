import { useHeaderTab } from "@/hooks/useHeaderTabs";
import { useQuestionList } from "@/hooks/useQuestionList";
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
} from "@chakra-ui/react";
import { useState } from "react";
import { BsPencilSquare, BsTrash2 } from "react-icons/bs";
import { QuestionForm } from "./QuestionForm";
import { ComplexityBadge } from "../complexity";

export const QuestionDetails = ({
  title,
  complexity,
  description,
  id,
  categories,

  isPreview = false,
}: Question & { isPreview?: boolean }) => {
  const { goToBrowsePage } = useHeaderTab();
  const { removeQuestion } = useQuestionList();
  const [isEdit, setIsEdit] = useState(false);

  return !isEdit ? (
    <Flex
      direction="column"
      px={isPreview ? 0 : 6}
      py={isPreview ? 0 : 8}
      bgColor={isPreview ? "transparent" : "white"}
      borderRadius={12}
      borderColor="gray.100"
      borderWidth={isPreview ? 0 : 1}
      overflowY="auto"
      height="100%"
      minH="45vh"
      gap={4}
    >
      <Stack spacing={4} flex={1}>
        <Heading fontWeight={700} fontSize="2xl">
          {title}
        </Heading>
        <ComplexityBadge>{complexity}</ComplexityBadge>
        <ReactMarkdown components={ChakraUIRenderer()} skipHtml>
          {description || ""}
        </ReactMarkdown>

        <Accordion allowToggle>
          <AccordionItem>
            <AccordionButton px={0} _hover={{}}>
              <Box as="span" textAlign="left" flex={1} fontWeight={500}>
                Topics
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px={0}>
              <HStack wrap="wrap">
                {categories?.map((cat) => (
                  <Badge
                    variant="outline"
                    textTransform="none"
                    px={2}
                    py={1}
                    w="fit-content"
                  >
                    {cat}
                  </Badge>
                ))}
              </HStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Stack>
      {isPreview ? null : (
        <HStack>
          <Button
            size="sm"
            leftIcon={<BsPencilSquare />}
            onClick={() => setIsEdit(!isEdit)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            leftIcon={<BsTrash2 />}
            onClick={() => {
              removeQuestion({ id });
              goToBrowsePage();
            }}
          >
            Delete
          </Button>
        </HStack>
      )}
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

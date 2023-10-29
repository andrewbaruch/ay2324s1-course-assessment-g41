import { useHeaderTab } from "@/hooks/useHeaderTabs";
import { useQuestion } from "@/hooks/useQuestion";
import { HeaderTabs } from "@/types/header";
import { Question } from "@/types/models/question";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { BsCodeSquare } from "react-icons/bs";
import { ComplexityBadge } from "../complexity";

export const QuestionsList = ({ questions }: { questions: Question[] }) => {
  const { setQuestion } = useQuestion();
  const { setTab } = useHeaderTab();

  return (
    <Stack spacing={4}>
      <Heading fontWeight="bold">Coding Questions</Heading>

      {questions.length > 0 ? (
        <>
          <HStack>
            <Tooltip
              label="Design your own question, or save a question you encountered from a technical interview here!"
              hasArrow
              placement="right"
            >
              <Button
                w="fit-content"
                onClick={() => setTab(HeaderTabs.QUESTION_FORM)}
                leftIcon={<BsCodeSquare />}
                size="sm"
              >
                Craft Question
              </Button>
            </Tooltip>
            <Tooltip
              label="Match with a peer to tackle questions together!"
              hasArrow
              placement="right"
            >
              <Button
                w="fit-content"
                onClick={() => setTab(HeaderTabs.MATCHING_FORM)}
                leftIcon={<BsCodeSquare />}
                size="sm"
              >
                Match a peer
              </Button>
            </Tooltip>
          </HStack>

          <Stack
            borderWidth={1}
            borderRadius={4}
            spacing={0}
            background="white"
          >
            {questions.map((q, index) =>
              index !== questions.length - 1 ? (
                <Box
                  key={`q-${index}`}
                  _hover={{ background: "gray.100", cursor: "pointer" }}
                  onClick={() => setQuestion({ ...q })}
                >
                  <Box p={4}>
                    <QuestionCard {...q} />
                  </Box>
                  <Divider />
                </Box>
              ) : (
                <Box
                  p={4}
                  key={`q-${index}`}
                  _hover={{ background: "gray.100", cursor: "pointer" }}
                  onClick={() => setQuestion({ ...q })}
                >
                  <QuestionCard {...q} />
                </Box>
              )
            )}
          </Stack>
        </>
      ) : (
        <Alert borderRadius={16}>
          <Stack>
            <AlertTitle>Looks like you have not saved a question!</AlertTitle>
            <AlertDescription>
              This question repository helps you save questions you have
              encountered from past interviews! You can also design and save
              your own question!
            </AlertDescription>
            <HStack>
              <Button
                w="fit-content"
                onClick={() => setTab(HeaderTabs.QUESTION_FORM)}
                leftIcon={<BsCodeSquare />}
                size="sm"
              >
                Craft Question
              </Button>
              <Button
                w="fit-content"
                onClick={() => setTab(HeaderTabs.MATCHING_FORM)}
                leftIcon={<BsCodeSquare />}
                size="sm"
              >
                Match a peer
              </Button>
            </HStack>
          </Stack>
        </Alert>
      )}
    </Stack>
  );
};

const QuestionCard = ({
  title,
  complexity,
  id,
  description,
  categories,
}: Question) => {
  return (
    <Stack spacing={4}>
      <Text fontWeight={600}>{title}</Text>

      <Text color={"gray.500"} noOfLines={1}>
        {description}
      </Text>

      <HStack spacing={4} overflowX={"auto"}>
        <ComplexityBadge>{complexity}</ComplexityBadge>

        <HStack spacing={1}>
          {categories.map((cat) => (
            <Badge
              variant="outline"
              textTransform="none"
              px={2}
              py={1}
              w="fit-content"
              key={cat}
            >
              {cat}
            </Badge>
          ))}
        </HStack>
      </HStack>
    </Stack>
  );
};
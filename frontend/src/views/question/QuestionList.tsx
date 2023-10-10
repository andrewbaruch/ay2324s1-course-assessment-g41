"use client";
import { Question } from '@/@types/models/question';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Box,
  Button,
  Divider,
  HStack,
  Stack,
  Text,
  Tooltip,
  useColorModeValue
} from '@chakra-ui/react';
import { BsCodeSquare } from 'react-icons/bs';
import { ComplexityBadge } from '../../components/complexity';
import Link from 'next/link';

export const QuestionsList = ({ questions }: { questions: Question[] }) => {
  const bgColor = useColorModeValue('white', 'navy.800');
  const hoverColor = useColorModeValue('gray.100', 'navy.900');

  return (
    <Stack spacing={4}>
      {questions.length > 0 ? (
        <>
          <Tooltip
            label="Design your own question, or save a question you encountered from a technical interview here!"
            hasArrow
            placement="right"
          >
            <Link href={'/questions/add-question'}>
              <Button
                w="fit-content"
                leftIcon={<BsCodeSquare />}
                size="sm"
              >
                Craft Question
              </Button>
            </Link>
          </Tooltip>

          <Stack
            borderWidth={1}
            borderRadius={4}
            spacing={0}
            background={bgColor}
          >
            {questions.map((q, index) =>
              index !== questions.length - 1 ? (
                <Link href={`questions/${q.id}`}>
                  <Box
                    key={`q-${index}`}
                    _hover={{ background: hoverColor, cursor: 'pointer' }}
                  >
                    <Box p={4}>
                      <QuestionCard {...q} />
                    </Box>
                    <Divider />
                  </Box>
                </Link>
              ) : (
                  <Link href={`questions/${q.id}`}>
                    <Box
                      p={4}
                      key={`q-${index}`}
                      _hover={{ background: hoverColor, cursor: 'pointer' }}
                    >
                      <QuestionCard {...q} />
                    </Box>
                  </Link>
                ),
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
              <Link href={'/questions/add-question'}>
                <Button
                  w="fit-content"
                  leftIcon={<BsCodeSquare />}
                  size="sm"
                >
                  Craft Question
              </Button>
              </Link>
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

      <Text color={'gray.500'} noOfLines={1}>
        {description}
      </Text>

      <HStack spacing={4} overflowX={'auto'}>
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
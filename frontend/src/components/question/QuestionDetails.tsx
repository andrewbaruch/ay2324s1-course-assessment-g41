import { Question } from "@/types/models/question";
import { Badge, Heading, Stack, Text } from "@chakra-ui/react";

const QuestionDetails = ({ title, complexity, description, id }: Question) => {
  return (
    <Stack spacing={{ base: 8, lg: 6 }}>
      <Stack
        alignItems="flex-start"
        direction={{ base: "column", lg: "row" }}
        justify="space-between"
        spacing={4}
      >
        <Stack spacing={2}>
          <Heading fontWeight="medium" size={"lg"}>
            {title}
          </Heading>
          <Badge variant="subtle" colorScheme="blue" w="fit-content">
            {complexity}
          </Badge>
          <Text color="muted">{description}</Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default QuestionDetails;

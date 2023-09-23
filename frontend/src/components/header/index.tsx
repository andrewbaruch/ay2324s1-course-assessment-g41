import { useHeaderTab } from "@/hooks/useHeaderTabs";
import { useQuestion } from "@/hooks/useQuestion";
import { HeaderTabs } from "@/types/models/header";
import { Box, Button, Container, HStack } from "@chakra-ui/react";

// const QUESTION_EXAMPLE = {
//   title: "The K Weakest Rows in a Matrix",
//   description: `You are given an m x n binary matrix mat of 1's (representing soldiers) and 0's (representing civilians). The soldiers are positioned in front of the civilians. That is, all the 1's will appear to the left of all the 0's in each row.
//   A row i is weaker than a row j if one of the following is true:
//   The number of soldiers in row i is less than the number of soldiers in row j.
//   Both rows have the same number of soldiers and i < j.
//   Return the indices of the k weakest rows in the matrix ordered from weakest to strongest.`,
//   complexity: QuestionComplexity.EASY,
//   categories: ["DFS"],
// };

export const Header = () => {
  const { setQuestion } = useQuestion();
  const { currentTab, setTab } = useHeaderTab();

  return (
    <Box w="100%" boxShadow="sm" bgColor={"gray.500"} h="10vh">
      <Container maxW="8xl" p={4}>
        <HStack w="full">
          <Button
            onClick={() =>
              currentTab === HeaderTabs.QUESTION_LIST
                ? setQuestion()
                : setTab(HeaderTabs.QUESTION_LIST)
            }
          >
            All Problems
          </Button>
          <Button onClick={() => setTab(HeaderTabs.QUESTION_FORM)}>
            Contribute a Question
          </Button>
        </HStack>
      </Container>
    </Box>
  );
};

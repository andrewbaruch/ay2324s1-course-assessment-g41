// Import necessary libraries
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import Card from "src/components/card/Card";
import { GroupBase, OptionBase, Select } from "chakra-react-select";

// karwi: refactor later, change to chakra style
interface IFormInput {
  username: string;
  language: string;
  topics: string[];
  difficulty: string;
}

interface OptionType extends OptionBase {
  value: string;
  label: string;
}

// karwiapi: fetch choices from api
// karwiapi: use get user identity
// Define the options for the selects
const languageOptions: OptionType[] = [
  { value: "Javascript", label: "Javascript" },
  { value: "Python", label: "Python" },
  { value: "Java", label: "Java" },
  /* Add more language options here */
];

const topicOptions: OptionType[] = [
  { value: "Dynamic Programming", label: "Dynamic Programming" },
  { value: "Binary Search", label: "Binary Search" },
  { value: "Backtracking", label: "Backtracking" },
  { value: "Greedy Algorithms", label: "Greedy Algorithms" },
  /* Add more topic options here */
];

const difficultyOptions: OptionType[] = [
  { value: "Easy", label: "Easy" },
  { value: "Medium", label: "Medium" },
  { value: "Hard", label: "Hard" },
];

export default function GeneralInformation(props: { [x: string]: any }) {
  const { ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";

  // React hook form setup
  const { handleSubmit, register, setValue, control } = useForm<IFormInput>();

  // karwi: put in services/
  const onSubmit = (data: IFormInput) =>
    fetch("https://api.example.com", {
      method: "POST",
      body: JSON.stringify(data),
    });

  return (
    <Card mb={{ base: "0px", "2xl": "20px" }} {...rest}>
      <Text color={textColorPrimary} fontWeight="bold" fontSize="2xl" mt="10px" mb="4px">
        Complete Your Profile
      </Text>
      <Text color={textColorSecondary} fontSize="md" me="26px" mb="40px">
        Please provide detailed information about yourself to improve the compatibility with
        potential partners. Our customized algorithm uses this information to match you with the
        best mock interview partner.
      </Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={2} gap="20px">
          <FormControl id="username">
            <FormLabel>Username</FormLabel>
            <Input {...register("username", { required: true })} color={textColorPrimary} />
          </FormControl>
          <FormControl id="language">
            <FormLabel>Preferred Language</FormLabel>
            <Controller
              name="language"
              control={control}
              rules={{ required: true }}
              defaultValue=""
              render={({ field }) => (
                <Select<OptionType, true, GroupBase<OptionType>>
                  name="languge"
                  options={languageOptions}
                  placeholder="Select option"
                />
              )}
            />
          </FormControl>
          <FormControl id="topics">
            <FormLabel>Preferred Topics</FormLabel>
            <Controller
              name="topics"
              control={control}
              rules={{ required: true }}
              defaultValue={[]}
              render={({ field }) => (
                <Select<OptionType, true, GroupBase<OptionType>>
                  isMulti
                  name="topics"
                  options={topicOptions}
                  placeholder="Select option"
                />
              )}
            />
          </FormControl>
          <FormControl id="difficulty">
            <FormLabel>Preferred Difficulty</FormLabel>
            <Controller
              name="difficulty"
              control={control}
              rules={{ required: true }}
              defaultValue=""
              render={({ field }) => (
                <Select<OptionType, true, GroupBase<OptionType>>
                  name="difficulty"
                  options={difficultyOptions}
                  placeholder="Select option"
                />
              )}
            />
          </FormControl>
          <Button
            type="submit"
            me="100%"
            mb="50px"
            w="140px"
            minW="140px"
            mt={{ base: "20px", "2xl": "auto" }}
            variant="brand"
            fontWeight="500"
          >
            Submit
          </Button>
        </SimpleGrid>
      </form>
    </Card>
  );
}

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
  useToast,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import Card from "src/components/card/Card";
import { GroupBase, OptionBase, Select } from "chakra-react-select";
import { useLanguages } from "@/hooks/services/useLanguages";
import { useTopics } from "@/hooks/services/useTopics";
import { UserRequest } from "@/@types/user";
import { useRequest } from "ahooks";
import { updateUser } from "@/services/users";

// karwi: refactor later, change to chakra style

type IFormInput = UserRequest;

interface OptionType extends OptionBase {
  value: string;
  label: string;
}

const difficultyOptions: OptionType[] = [
  { value: "0", label: "Easy" },
  { value: "1", label: "Medium" },
  { value: "2", label: "Hard" },
];

export default function GeneralInformation(props: { [x: string]: any }) {
  const { ...rest } = props;
  const { languages } = useLanguages();
  const { topics } = useTopics();
  const toast = useToast();

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";

  // React hook form setup
  const { handleSubmit, register, setValue, control } = useForm<IFormInput>();
  const { run: updateUserProfile } = useRequest(updateUser, {
    manual: true,
    onSuccess: (result, params) => {
      toast({
        title: "Profile Update Success",
        description: "Your profile has been updated successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error, params) => {
      toast({
        title: "Update Failed",
        description: `Failed to update profile. ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const onSubmit = (data: IFormInput) => {
    data.preferred_difficulty = Number(data.preferred_difficulty);
    updateUserProfile(data);
  };

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
            <Input {...register("name", { required: true })} color={textColorPrimary} />
          </FormControl>
          <FormControl id="language">
            <FormLabel>Preferred Language</FormLabel>
            <Controller
              name="preferred_language"
              control={control}
              rules={{ required: true }}
              defaultValue={""}
              render={({ field }) => (
                <Select<OptionType, true, GroupBase<OptionType>>
                  name="languge"
                  options={
                    languages?.data.map((language) => ({
                      value: language.id,
                      label: language.name,
                    })) || []
                  }
                  placeholder="Select option"
                />
              )}
            />
          </FormControl>
          <FormControl id="topics">
            <FormLabel>Preferred Topics</FormLabel>
            <Controller
              name="preferred_topics"
              control={control}
              rules={{ required: true }}
              defaultValue={[]}
              render={({ field }) => (
                <Select<OptionType, true, GroupBase<OptionType>>
                  isMulti
                  name="topics"
                  options={
                    topics?.data.map((topic) => ({ value: topic.id, label: topic.name })) || []
                  }
                  placeholder="Select option"
                />
              )}
            />
          </FormControl>
          <FormControl id="difficulty">
            <FormLabel>Preferred Difficulty</FormLabel>
            <Controller
              name="preferred_difficulty"
              control={control}
              rules={{ required: true }}
              defaultValue={0}
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

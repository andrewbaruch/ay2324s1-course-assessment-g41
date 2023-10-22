// Import necessary libraries
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  SimpleGrid,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useForm, Controller, useController } from "react-hook-form";
import Card from "src/components/card/Card";
import { GroupBase, OptionBase, Select } from "chakra-react-select";
import { useLanguages } from "@/hooks/services/useLanguages";
import { useTopics } from "@/hooks/services/useTopics";
import { UserRequest } from "@/@types/user";
import { useRequest } from "ahooks";
import { updateUser } from "@/services/users";
import useGetIdentity from "@/hooks/auth/useGetIdentity";
import { useEffect } from "react";
import ControlledSelect from "@/components/form/ControlledSelect";
import ControlledInput from "@/components/form/ControlledInput";

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
  const { identity } = useGetIdentity();

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";

  // React hook form setup
  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: identity,
  });

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

      <form
        onSubmit={(e) => {
          console.log("Form submitted");
          handleSubmit(onSubmit)(e);
        }}
      >
        <SimpleGrid columns={2} gap="20px">
          <ControlledInput
            controlName="name"
            label="Username"
            register={register}
            errors={errors}
            color={textColorPrimary}
            required={true}
          />
          <ControlledSelect
            control={control}
            name="preferred_language"
            id="language"
            label="Preferred Language"
            rules={{ required: false }}
            options={
              languages?.data.map((language) => ({
                value: language.id,
                label: language.name,
              })) || []
            }
            placeholder="Select option"
          />
          <ControlledSelect
            control={control}
            name="preferred_topics"
            id="topics"
            label="Preferred Topics"
            rules={{ required: false }}
            options={
              topics?.data.map((topic) => ({
                value: topic.id,
                label: topic.name,
              })) || []
            }
            placeholder="Select option"
            isMulti
          />
          <ControlledSelect
            control={control}
            name="preferred_difficulty"
            id="difficulty"
            label="Preferred Difficulty"
            rules={{ required: false }}
            options={difficultyOptions}
            placeholder="Select option"
          />
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

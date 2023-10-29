// components/TopBar.tsx
import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useCollabContext } from "src/hooks/contexts/useCollabContext";
import { OptionBase, Select, SingleValue } from "chakra-react-select";

interface OptionType extends OptionBase {
  value: string;
  label: string;
}

const TopBar = () => {
  const { languageTotalList, currentAttempt, onLanguageChange } = useCollabContext();

  const handleLanguageChange = (selectedOption: SingleValue<OptionType>) => {
    if (!selectedOption) {
      return;
    }
    // TODO: refactor to include attempt id
    // if (currentAttempt) {
    // onLanguageChange(selectedOption, currentAttempt.attemptId);
    onLanguageChange(selectedOption, 0);
    // }
  };
  const currentLanguage = currentAttempt?.language;
  const options = languageTotalList;

  return (
    <Flex align="center" justify="flex-start" pb={4}>
      <Box w="100%" maxW={200}>
        <Select
          options={options}
          onChange={handleLanguageChange}
          value={currentLanguage}
          placeholder="Select language"
        />
      </Box>
      {/* Other components or elements can go here, and they will be positioned to the right of the Select component */}
    </Flex>
  );
};

export default TopBar;

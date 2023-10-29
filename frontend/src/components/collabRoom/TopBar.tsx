// components/TopBar.tsx
import React from "react";
import { Flex } from "@chakra-ui/react";
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
    const newLanguageSlug = selectedOption.value;
    if (currentAttempt) {
      onLanguageChange(newLanguageSlug, currentAttempt.attemptId);
    }
  };

  const currentLanguage = currentAttempt?.language;
  const options = languageTotalList.map((language) => ({
    value: language.slug,
    label: language.name,
  }));

  return (
    <Flex align="center" justify="flex-start" pb={4}>
      <Select
        options={options}
        onChange={handleLanguageChange}
        value={
          currentLanguage ? { value: currentLanguage.slug, label: currentLanguage.name } : null
        }
        placeholder="Select language"
        maxWidth="200px"
      />
      {/* Other components or elements can go here, and they will be positioned to the right of the Select component */}
    </Flex>
  );
};

export default TopBar;

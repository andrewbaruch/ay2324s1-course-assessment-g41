// components/TopBar.tsx
import React from "react";
import { Flex, Select } from "@chakra-ui/react";
import { useCollabContext } from "src/hooks/contexts/useCollabContext";

const TopBar = () => {
  const { state, currentAttempt } = useCollabContext();
  const { languageTotalList } = state;
  const currentLanguage = currentAttempt?.language;

  return (
    <Flex align="center" justify="flex-start" pb={4}>
      <Select value={currentLanguage?.slug} placeholder="Select language" maxWidth="200px">
        {languageTotalList.map((language) => (
          <option key={language.id} value={language.slug}>
            {language.name}
          </option>
        ))}
      </Select>
      {/* Other components or elements can go here, and they will be positioned to the right of the Select component */}
    </Flex>
  );
};

export default TopBar;

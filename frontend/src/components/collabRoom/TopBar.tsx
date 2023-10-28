// components/TopBar.tsx
import React from "react";
import { Select } from "@chakra-ui/react";
import { useCollabContext } from "./useCollabContext";

const TopBar = () => {
  const { state, currentAttempt } = useCollabContext();
  const { languageTotalList } = state;
  const currentLanguage = currentAttempt?.language;

  return (
    <Select value={currentLanguage?.slug} placeholder="Select language">
      {languageTotalList.map((language) => (
        <option key={language.id} value={language.slug}>
          {language.name}
        </option>
      ))}
    </Select>
  );
};

export default TopBar;

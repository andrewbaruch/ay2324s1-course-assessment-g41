// components/TopBar.tsx
import React from "react";
import { Select } from "@chakra-ui/react";
import { useCollabContext } from "./useCollabContext";

const TopBar = () => {
  const { state } = useCollabContext();
  const { languageTotalList } = state;

  return (
    <Select placeholder="Select language">
      {languageTotalList.map((language, index) => (
        <option key={index} value={language}>
          {language}
        </option>
      ))}
    </Select>
  );
};

export default TopBar;

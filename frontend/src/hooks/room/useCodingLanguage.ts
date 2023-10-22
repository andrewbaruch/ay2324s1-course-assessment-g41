import { useMonaco } from "@monaco-editor/react";
import { useEffect, useState } from "react";

export const useCodingLanguage = () => {
  const [language, setLanguage] = useState({ label: "Plain Text", value: "plaintext" });
  const monaco = useMonaco();
  const [supportedLanguages, setSupportedLanguages] = useState<{ label: string; value: string }[]>(
    [],
  );

  useEffect(() => {
    if (!monaco) return;
    setSupportedLanguages(
      monaco.languages.getLanguages().map((lang) => ({
        label: lang.aliases && lang.aliases.length > 0 ? lang.aliases[0] : lang.id,
        value: lang.id,
      })),
    );
  }, [monaco]);

  const changeLanguage = (selectedLanguage: { label: string; value: string }) => {
    setLanguage(selectedLanguage);
  };

  return {
    language,
    changeLanguage,
    supportedLanguages,
  };
};

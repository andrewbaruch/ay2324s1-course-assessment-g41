export interface Language {
  label: string;
  value: string;
}

export type LanguageRequest = Partial<Language>;
export type LanguageResponse = Language;

export type LanguagesResponse = LanguageResponse[];

export interface Language {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export type LanguageRequest = Partial<Language>;
export type LanguageResponse = Language;

export type LanguagesResponse = LanguageResponse[];

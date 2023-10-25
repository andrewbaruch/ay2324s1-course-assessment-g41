import { atom, useAtom } from "jotai";
import { HeaderTabs } from "@/types/header";
import { useQuestion } from "./useQuestion";

interface HeaderTab {
  currentTab: HeaderTabs;
}

const headerTabAtom = atom<HeaderTab>({
  currentTab: HeaderTabs.QUESTION_LIST,
});

export const useHeaderTab = () => {
  const [tabWrapper, setTabWrapper] = useAtom(headerTabAtom);
  const { setQuestion } = useQuestion();

  const setTab = (tab: HeaderTabs) => {
    setTabWrapper({
      currentTab: tab,
    });
  };

  const goToBrowsePage = () => {
    setQuestion();
    setTab(HeaderTabs.QUESTION_LIST);
  };

  const goToCodingPage = () => {
    setTab(HeaderTabs.CODING_PAGE);
  };

  return {
    currentTab: tabWrapper.currentTab,
    setTab,
    goToBrowsePage,
    goToCodingPage,
  };
};

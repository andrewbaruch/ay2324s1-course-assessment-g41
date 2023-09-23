import { atom, useAtom } from 'jotai'
import { HeaderTabs } from "@/types/models/header";

interface HeaderTab {
  currentTab: HeaderTabs
}

const headerTabAtom = atom<HeaderTab>({
  currentTab: HeaderTabs.QUESTION_LIST
})

export const useHeaderTab = () => {
  const [tabWrapper, setTabWrapper] = useAtom(headerTabAtom)

  const setTab = (tab: HeaderTabs) => {
    setTabWrapper({
      currentTab: tab
    })
  }

  return {
    currentTab: tabWrapper.currentTab,
    setTab
  }
}


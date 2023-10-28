// components/TabView.tsx
import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import QuestionDescription from "./QuestionDescription";

const TabView = () => {
  return (
    <Tabs>
      <TabList>
        <Tab>Description</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <QuestionDescription />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default TabView;

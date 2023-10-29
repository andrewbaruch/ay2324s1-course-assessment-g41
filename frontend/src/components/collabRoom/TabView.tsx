// components/TabView.tsx
import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import QuestionDescription from "./QuestionDescription";
import Card from "src/components/card/Card";

const TabView = () => {
  return (
    <Card mb={{ base: "0px", "2xl": "20px" }}>
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
    </Card>
  );
};

export default TabView;

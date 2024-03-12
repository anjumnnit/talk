import React from 'react';
import { useState } from 'react';
import ChatBox from '../framework/ChatBox';
import SideDrawer from '../framework/SideDrawer';
import MyChat from '../framework/myChats';
import { Flex } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";


const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
     {user &&<SideDrawer />}
      <Flex w="100%" h="91.5vh" p="10px">
       {user&&<MyChat fetchAgain={fetchAgain} />}
       {user&&<ChatBox  fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Flex>
    </div>
  );
};

export default ChatPage;

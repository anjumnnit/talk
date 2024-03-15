import React, { useEffect, useState } from 'react';
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import axios from 'axios';
import { Button } from '@chakra-ui/react';
import { useToast } from "@chakra-ui/toast";
import { ChatState } from "../Context/ChatProvider";
import ChatLoading from '../components/ChatLoading';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './GroupChatModal';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get("/api/chat", config);
        setChats(data);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to Load the chats",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };

    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain, user.token, setChats, toast]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="rgb(73, 64, 150)"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
      overflow="hidden"
      color="white"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent= "space-between"
        alignItems="center"
      >
        My chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            bg="rgb(239, 148, 208)"
            rightIcon={<AddIcon />}
            margin={3}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="rgb(160,160,160)"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack
            overflowY="scroll"
            style={{ maxHeight: "580px" }} // Set a fixed height for the Stack
          >
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={2}
                py={2}
                borderRadius="rgb(165, 189, 255)"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;

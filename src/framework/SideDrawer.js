
import React from 'react'
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { useState } from "react";

import {
   BellIcon
} from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import axios from "axios";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useToast } from "@chakra-ui/toast";
import { ChatState } from "../Context/ChatProvider";
import ChatLoading from '../components/ChatLoading';
import ProfileModal from "./ProfileModal";
import { Spinner } from "@chakra-ui/spinner";
import UserListItem from "../components/UserAvatar/UserListItem";
import { useHistory } from "react-router-dom";
import { getSender } from '../config/ChatLogics';
// import {Effect} from "react-notification-badge";
import NotificationBadge from './NotificationBadge';
// import { Badge } from 'react-badge';

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

 const handleSearch = async () => {
  // console.log("Search query:", search);

  if (!search) {
    // console.log("Please Enter something in search");
    toast({
      title: "Please Enter something in search",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "top-left",
    });
    return;
  }

  try {
    setLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    // console.log("Config:", config);
    const response = await axios.get(`/api/user?search=${search}`, config);

    // console.log("Response status:", response.status);
    // console.log("Response data:", response.data);

    setLoading(false);
    setSearchResult(response.data);
  } catch (error) {
    // console.error("Error fetching search results:", error);
    toast({
      title: "Error Occurred!",
      description: "Failed to Load the Search Results",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  }
};

  const accessChat = async (userId) => {
    // console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

// console.log(user&&user.username);

  return (
  <>
      <Box
    style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'pink',
    width: '100%',
    padding: '5px 10px',
    borderWidth: '5px'
  }}
  >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip> 
       
        <div>
          <Menu>
            <MenuButton p={1} >
               <NotificationBadge
                count={notification.length}
                // effect={Effect.SCALE}
              />
              {/* <Badge count={notification.length} effect="scale" /> */}
             <BellIcon fontSize="2xl" m={1}/>
            </MenuButton>
               <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
             <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
             
              <Avatar
                size="sm"
                cursor="pointer"
                name={user&&user.username}
                // src={user.pic}
              />

            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
          </div>    
      </Box>
{/* side bar after clicking on search box */}

  <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
         <Box  style={{ display: 'flex' }} pb={2}  >
         
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              
              <Button onClick={handleSearch}>Go</Button>
        
             
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
               searchResult
         ?.filter((resultUser) => resultUser._id !== user._id) // Exclude currently logged-in user
         .map((resultUser) => (
        <UserListItem
        key={resultUser._id}
        user={resultUser}
        handleFunction={() => accessChat(resultUser._id)}
         />
                
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
           
          </DrawerBody>
        </DrawerContent>
      </Drawer>
  </>
  )
}
export default SideDrawer

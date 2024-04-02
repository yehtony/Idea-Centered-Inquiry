import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Tooltip,
  IconButton,
  Badge,
  Box,
  Avatar,
  List,
  ListItem,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import CommunityIcon from '../assets/CommunityIcon.png';
import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
// import io from 'socket.io-client';
// import url from '../url.json';
import { socket } from '../utils/Socket';

export const GroupChatBot = () => {
  // const ws = io.connect(url.backendHost);
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [chatRoomOpen, setChatRoomOpen] = useState(false);
  const [data, setData] = useState({
    content: message,
    author: localStorage.getItem('name'),
    groupId: localStorage.getItem('groupId'),
  });

  // const sendMessageToServer = async (content) => {
  //   try {
  //     const response = await axios.post(
  //       'http://127.0.0.1:8000/react/chatbot/sendMessage',
  //       {
  //         userId: userId,
  //         content: content,
  //       }
  //     );
  //     console.log('Server response:', response.data);
  //   } catch (error) {
  //     console.error('Error sending message to server:', error);
  //   }
  // };

  //   useEffect(() => {
  //     const socket = io.connect('http://127.0.0.1:8000');
  //     socket.on('message', (message) => {
  //       console.log('Received message from server:', message);
  //       setMessageLog([...messageLog, message]);
  //     });

  //     return () => {
  //       socket.disconnect();
  //     };
  //   }, [messageLog]);

  const sendMessage = async () => {
    if (message !== '') {
      const messageData = {
        content: message,
        groupId: data.groupId,
        author: data.author,
      };
      socket.emit('send_message', messageData);
      setMessageList((prev) => [...prev, messageData]);
    }
  };

  useEffect(() => {
    function receive_message(data) {
      setMessageList((prev) => [...prev, data]);
      console.log(data);
    }
    if (chatRoomOpen === true) {
      socket.emit('join_room', data.groupId);
      console.log('join_room', data.groupId);
    }
    socket.on('receive_message', receive_message);
    return () => {
      socket.off('receive_message', receive_message);
    };
  }, [socket, chatRoomOpen]);

  return (
    <>
      <Tooltip title="小組聊天室" arrow>
        <IconButton
          size="large"
          aria-label="show 4 new mails"
          color="inherit"
          onClick={() => setChatRoomOpen(!chatRoomOpen)}
          sx={{ position: 'relative' }}
        >
          <Badge color="error">
            <img alt="小組聊天室" src={CommunityIcon} width={24} height={24} />
          </Badge>
        </IconButton>
      </Tooltip>
      <Box sx={{ position: 'absolute', top: 50, right: 20 }}>
        {chatRoomOpen && (
          <>
            <Box
              sx={{
                width: '22vw',
                height: '75vh',
                overflowY: 'auto',
                border: '3px solid grey',
                marginBottom: '10px',
                borderRadius: 1,
              }}
            >
              <List>
                {messageList.map((message, index) => (
                  <ListItem
                    key={index}
                    style={{
                      justifyContent:
                        message.userId === data.userId
                          ? 'flex-end'
                          : 'flex-start',
                      flexDirection: 'column',
                      alignItems:
                        message.userId === data.userId
                          ? 'flex-end'
                          : 'flex-start',
                      color: 'black',
                    }}
                  >
                    <Avatar
                      className="chat-image avatar"
                      sx={{
                        color: 'black',
                        backgroundColor: 'transparent',
                      }}
                    >
                      {message.userId === 'assistant' ? (
                        <SmartToyOutlinedIcon />
                      ) : (
                        <FaceOutlinedIcon />
                      )}
                    </Avatar>
                    <div>{message.content}</div>
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box
              sx={{
                width: '22vw',
                height: '6vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '3px solid grey',
                marginBottom: '10px',
                borderRadius: 1,
              }}
            >
              <TextField
                placeholder="輸入訊息"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{
                  flexGrow: 1,
                  '& label.Mui-focused': {
                    color: 'rgba(255, 255, 255, 0)',
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: 'rgba(255, 255, 255, 0)',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0)',
                    },
                  },
                }}
              />
              <IconButton onClick={sendMessage} sx={{ color: 'gray' }}>
                <SendRoundedIcon />
              </IconButton>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default GroupChatBot;

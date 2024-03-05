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
import { ThemeProvider, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { createTheme } from '@mui/material/styles';
import CommunityIcon from '../assets/CommunityIcon.png';
// import FaceIcon from '@mui/icons-material/Face';
import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
// import { alpha, styled } from '@mui/material/styles';
import { styled } from '@mui/system';

export const ChatBot = () => {
  //   const CssTextField = styled(TextField)({
  //     '& label.Mui-focused': {
  //       color: 'rgba(255, 255, 255, 0)',
  //     },
  //     '& .MuiInput-underline:after': {
  //       borderBottomColor: 'rgba(255, 255, 255, 0)',
  //     },
  //     '& .MuiOutlinedInput-root': {
  //       '& fieldset': {
  //         borderColor: 'rgba(255, 255, 255, 0)',
  //       },
  //       '&:hover fieldset': {
  //         borderColor: 'rgba(255, 255, 255, 0)',
  //       },
  //       '&.Mui-focused fieldset': {
  //         borderColor: 'rgba(255, 255, 255, 0)',
  //       },
  //     },
  //   });
  //   const [messages, setMessages] = useState([]);
  //   const [inputValue, setInputValue] = useState('');
  //   const [isChatOpen, setIsChatOpen] = useState(false);

  //
  const [message, setMessage] = useState('');
  const [userLog, setUserLog] = useState({});
  const [messageLog, setMessageLog] = useState([]);
  const [initial, setInitial] = useState(true);
  const [chatbotOpen, setChatBotOpen] = useState(false);

  const sendMessageToPython = async () => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/react/chatbot/collaboration',
        {
          messages: [{ role: 'user', content: message }],
        }
      );
      console.log('Python response:', response.data);
      const updatedMessageLog = [...messageLog, response.data];
      setMessageLog(updatedMessageLog);
      setMessage('');
    } catch (error) {
      console.error('Error sending message to Python:', error);
    }
  };

  useEffect(() => {
    if (!initial) {
      sendMessageToPython();
    }
    setInitial(false);
  }, [userLog]);

  const updateChatLog = () => {
    const updatedMessageLog = [
      ...messageLog,
      { role: 'user', content: message },
    ];
    setUserLog(updatedMessageLog);
    setMessageLog(updatedMessageLog);
  };
  //   const handleSendMessage = () => {
  //     if (inputValue.trim() !== '') {
  //       const newMessage = {
  //         text: inputValue,
  //         sender: 'user',
  //       };

  //       setMessages([...messages, newMessage]);
  //       setInputValue('');
  //     }
  //   };

  const handleToggleChat = () => {
    setChatBotOpen(!chatbotOpen);
  };

  return (
    <>
      <Tooltip title="小組聊天室" arrow>
        <IconButton
          size="large"
          aria-label="show 4 new mails"
          color="inherit"
          onClick={handleToggleChat}
          sx={{ position: 'relative' }}
        >
          <Badge color="error">
            <img alt="小組聊天室" src={CommunityIcon} width={24} height={24} />
          </Badge>
        </IconButton>
      </Tooltip>
      <Box sx={{ position: 'absolute', top: 50, right: 20 }}>
        {chatbotOpen && (
          <>
            <Box
              sx={{
                width: '22vw',
                height: '75vh',
                overflowY: 'auto',
                border: '3px solid grey',
                // padding: 'px',
                marginBottom: '10px',
                borderRadius: 1,
              }}
            >
              <List>
                {messageLog.map((message, index) =>
                  message.role !== 'system' ? (
                    <ListItem
                      key={index}
                      style={{
                        justifyContent:
                          message.role === 'assistant'
                            ? 'flex-start'
                            : 'flex-end',
                        flexDirection: 'column', // 將排列方向改為垂直
                        alignItems:
                          message.role === 'assistant'
                            ? 'flex-start'
                            : 'flex-end', // 調整對齊方式
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
                        {message.role === 'assistant' ? (
                          <SmartToyOutlinedIcon />
                        ) : (
                          <FaceOutlinedIcon />
                        )}
                      </Avatar>

                      <div>{message.content}</div>
                    </ListItem>
                  ) : null
                )}
              </List>
              {/* {messageLog.map((message, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '8px',
                  textAlign: message.sender === 'bot' ? 'left' : 'right',
                }}
              >
                {message.text}
              </div>
            ))} */}
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
                value={message} // 將值設置為狀態中的值
                onChange={(e) => setMessage(e.target.value)} // 當值變化時執行處理函式
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
                    // backgroundColor: 'rgba(255, 255, 255, 0)',
                    '& input:-internal-autofill-selected': {
                      backgroundColor: 'rgba(255, 255, 255, 0) !important',
                    },
                  },
                }}
              />
              <IconButton onClick={updateChatLog} sx={{ color: 'gray' }}>
                <SendRoundedIcon />
              </IconButton>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default ChatBot;

// import React, { useContext, useState, useEffect } from 'react';
// import CommunityIcon from '../assets/CommunityIcon.png';
// import { Tooltip, IconButton, Badge } from '@mui/material';
// import SendRoundedIcon from '@mui/icons-material/SendRounded';
// import FaceIcon from '@mui/icons-material/Face';
// import SmartToyIcon from '@mui/icons-material/SmartToy';
// import axios from 'axios';
// import {
//   Grid,
//   Avatar,
//   Button,
//   TextareaAutosize,
//   TextField,
//   // List,
//   // ListItem,
//   Paper,
//   // Typography,
//   Collapse,
//   Box,
//   Toolbar,
//   //   Tooltip,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Typography,
//   Divider,
//   //   IconButton,
//   //   Badge,
// } from '@mui/material';

// export const ChatBot = () => {
//   const [message, setMessage] = useState('');
//   const [userLog, setUserLog] = useState({});
//   const [messageLog, setMessageLog] = useState([]);
//   const [initial, setInitial] = useState(true);
//   const [clickRobot, setClickRobot] = useState(false);

//   const [isChatRoomOpen, setIsChatRoomOpen] = useState(false);

//   const handleChatRoomToggle = () => {
//     setIsChatRoomOpen(!isChatRoomOpen);
//     setClickRobot(!clickRobot);
//   };

//   const handleClick = () => {
//     setClickRobot(!clickRobot);
//   };

//   const sendMessageToPython = async () => {
//     try {
//       const response = await axios.post(
//         'http://127.0.0.1:8000/react/chatbot/ideaimprove',
//         {
//           messages: [{ role: 'user', content: message }],
//         }
//       );
//       console.log('Python response:', response.data);
//       const updatedMessageLog = [...messageLog, response.data];
//       setMessageLog(updatedMessageLog);
//       setMessage('');
//     } catch (error) {
//       console.error('Error sending message to Python:', error);
//     }
//   };

//   useEffect(() => {
//     if (!initial) {
//       sendMessageToPython();
//     }
//     setInitial(false);
//   }, [userLog]);

//   const updateChatLog = () => {
//     const updatedMessageLog = [
//       ...messageLog,
//       { role: 'user', content: message },
//     ];
//     setUserLog(updatedMessageLog);
//     setMessageLog(updatedMessageLog);
//   };

//   return (
//     <Tooltip title="小組聊天室" arrow>
//       <IconButton
//         size="large"
//         aria-label="toggle chat room"
//         color="inherit"
//         onClick={handleChatRoomToggle}
//       >
//         <Badge color="error">
//           <img alt="小組聊天室" src={CommunityIcon} width={24} height={24} />
//         </Badge>
//       </IconButton>
//       <Collapse in={clickRobot}>
//         <Paper elevation={0}>
//           <List>
//             <Paper elevation={0}>
//               <List>
//                 {messageLog.map((message, index) =>
//                   message.role !== 'system' ? (
//                     <ListItem
//                       key={index}
//                       style={{
//                         justifyContent:
//                           message.role === 'assistant'
//                             ? 'flex-start'
//                             : 'flex-end',
//                         flexDirection: 'column', // 將排列方向改為垂直
//                         alignItems:
//                           message.role === 'assistant'
//                             ? 'flex-start'
//                             : 'flex-end', // 調整對齊方式
//                       }}
//                     >
//                       <Avatar className="chat-image avatar">
//                         {message.role === 'assistant' ? (
//                           <SmartToyIcon />
//                         ) : (
//                           <FaceIcon />
//                         )}
//                       </Avatar>

//                       <div>{message.content}</div>
//                     </ListItem>
//                   ) : null
//                 )}
//               </List>
//             </Paper>
//             <Paper elevation={0} className="">
//               {/* <div className="form-control w-full "> */}
//               <Grid
//                 container
//                 alignItems="center"
//                 justifyContent="space-between"
//               >
//                 <Grid item xs={11}>
//                   <TextField
//                     placeholder="使用者訊息"
//                     variant="outlined"
//                     fullWidth
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                   />
//                 </Grid>
//                 <Grid item xs={1}>
//                   <Button variant="text" onClick={() => updateChatLog()}>
//                     <SendRoundedIcon sx={{ fontSize: 40 }} />
//                   </Button>
//                 </Grid>
//               </Grid>
//             </Paper>
//             {/* </div> */}
//           </List>
//         </Paper>
//       </Collapse>
//     </Tooltip>
//   );
// };

import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

export const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      const newMessage = {
        text: inputValue,
        sender: 'user', // You can distinguish between user and bot messages
      };

      setMessages([...messages, newMessage]);
      setInputValue('');
    }
  };

  return (
    <Box>
      <Box
        sx={{
          height: '200px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: '10px',
          marginBottom: '10px',
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              marginBottom: '8px',
              textAlign: message.sender === 'bot' ? 'left' : 'right',
            }}
          >
            {message.text}
          </div>
        ))}
      </Box>
      <Box>
        <TextField
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          style={{ marginRight: '8px' }}
        />
        <Button variant="contained" onClick={handleSendMessage}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBot;

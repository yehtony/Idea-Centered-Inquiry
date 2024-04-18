import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import {
  Tooltip,
  Button,
  ButtonGroup,
  IconButton,
  Badge,
  Box,
  Avatar,
  List,
  ListItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import CommunityIcon from '../assets/CommunityIcon.png';
import FaceOutlinedIcon from '@mui/icons-material/FaceOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
// import io from 'socket.io-client';
import url from '../url.json';
import config from '../config.json';
import { socket } from '../utils/Socket';
import ActivityCard from './ActivityCard';

export const GroupChatBot = ({ activityData }) => {
  const [nodeData, setNodeData] = useState();
  const getNodes = async () => {
    try {
      const fetchData = await axios.get(
        `${url.backendHost + config[8].getNode}/${localStorage.getItem(
          'groupId'
        )}`,
        {
          headers: {
            authorization: 'Bearer JWT Token',
          },
        }
      );
      const nodeData = fetchData.data[0].Nodes.map(
        (node) => `${node.title}:${node.content}`
      ).join('\n');
      console.log(nodeData);
      setNodeData(await nodeData);
    } catch (error) {
      console.error('Error fetching nodes:', error.message);
    }
  };

  // console.log(activityData.title);
  const userId = localStorage.getItem('userId');
  const author = localStorage.getItem('name');
  const groupId = localStorage.getItem('groupId');
  // const ws = io.connect(url.backendHost);
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([
    {
      content:
        '哈囉各位同學，請問是你們主動想進行 Meta-Talk，還是老師需要你們進行 Meta-Talk 呢？',
      groupId: groupId,
      author: 'assistant',
    },
  ]);
  const [messageAlert, setMessageAlert] = useState([]);
  const [messageAlertCheck, setMessageAlertCheck] = useState(true);
  const [alertMessage, setAlertMessage] = useState([
    [
      '你提出的想法似乎含有「冒犯性言論『',
      '』」，如果可以請修正你的言論，以理性且尊種的方式表達想法喔！',
    ],
    [
      '你提出的想法似乎含有「負面情緒」，建議你修正你的寫法為「',
      '」，請以積極且正向的方式表達想法喔！',
    ],
    ['你提出的想法似乎和討論問題無關，請聚焦於問題並重新思考喔！', ''],
  ]);
  const [messageListTemp, setMessageListTemp] = useState({
    sender: groupId,
    message: '',
  });
  const [questionMessage, setQuestionMessage] = useState([
    '哈囉各位同學，請問是你們主動想進行 Meta-Talk，還是老師需要你們進行 Meta-Talk 呢？',
  ]);
  const [checkGroupMessage, setCheckGroupMessage] = useState(false);
  const [chatRoomOpen, setChatRoomOpen] = useState(false);
  const [data, setData] = useState({
    content: message,
    author: author,
    groupId: groupId,
  });
  const [sendActivityTitle, setSendActivityTitle] = useState(false);
  const [scaffold, setScaffold] = useState(['老師', '我們']);
  const buttonGroupRef = useRef(null);
  const [buttonGroupHeight, setButtonGroupHeight] = useState(0);

  // Group Message
  const sendGroupMessage = async () => {
    console.log(messageListTemp);
    var messageTitleNode;
    if (sendActivityTitle === false) {
      // setMessageListTemp((prev) => ({
      //   ...prev,
      //   message: prev.message + '|' + activityData.title + '|' + nodeData,
      // }));
      messageTitleNode = {
        sender: messageListTemp.sender,
        message:
          messageListTemp.message + '|' + activityData.title + '|' + nodeData,
      };
      setSendActivityTitle(true);
    } else {
      messageTitleNode = messageListTemp;
    }
    console.log(messageTitleNode);
    if (checkGroupMessage === true) {
      try {
        const response = await axios.post(
          'http://127.0.0.1:5005/webhooks/rest/webhook',
          messageTitleNode
        );

        console.log('NLP server response:', response.data);
        var messageData;
        if (response.data[0].buttons && response.data[0].buttons.length > 0) {
          const buttonTitles = response.data[0].buttons.map(
            (button) => button.title
          );
          setScaffold(buttonTitles);
          messageData = {
            content: response.data[0].text,
            groupId: groupId,
            author: 'assistant',
            buttons: buttonTitles,
          };
          console.log(messageData.buttons);
        } else {
          setScaffold([]);
          messageData = {
            content: response.data[0].text,
            groupId: groupId,
            author: 'assistant',
          };
        }
        setCheckGroupMessage(false);
        socket.emit('sendMessage', messageData);
        console.log('send message', messageData);
        setMessageList((prev) => [...prev, messageData]);
        setMessageListTemp({
          sender: groupId,
          message: '',
        });
        setQuestionMessage([response.data[0].text]);
        return response.data;
      } catch (error) {
        console.error('Error sending message to NLP server:', error);
        return false;
      }
    }
  };

  // Check Personal Message
  const checkMessage = async () => {
    // console.log(messageList);
    const messageqa = questionMessage.concat(message);
    console.log(messageqa);
    try {
      const response = await axios.post('http://127.0.0.1:8000/message/check', {
        message: messageqa,
      });
      console.log('NLP server response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending message to NLP server:', error);
      return false;
    }
  };

  // Send Personal Message
  const sendMessage = async () => {
    if (message !== '') {
      const checkMessageResult = await checkMessage();
      const isAllTrue = checkMessageResult.every(
        (item) => item.result === false
      );
      if (isAllTrue) {
        const messageData = {
          content: message,
          groupId: data.groupId,
          author: data.author,
        };
        socket.emit('sendMessage', messageData);
        console.log('send message', messageData);
        setMessageList((prev) => [...prev, messageData]);
        setMessageListTemp((prev) => ({
          ...prev,
          message: prev.message + '\n' + message,
        }));
        // setMessageAlertCheck(true);
        setCheckGroupMessage(true);
        setMessage('');
      } else {
        checkMessageResult.forEach((item, index) => {
          if (item.result) {
            setMessageAlert((prev) => [
              ...prev,
              alertMessage[index][0] + item.content + alertMessage[index][1],
            ]);
            console.log(messageAlert);
          }
        });
        setMessageAlertCheck(false);
        // setMessageAlert(messageToAlert);
        console.log('send message', messageAlert);
      }
    }
  };

  useEffect(() => {
    getNodes();
    if (buttonGroupRef.current) {
      const height = buttonGroupRef.current.clientHeight;
      setButtonGroupHeight(height);
    }
    function receive_message(data) {
      setMessageList((prev) => [...prev, data]);
      if (data.author !== 'assistant') {
        setMessageListTemp((prev) => ({
          ...prev,
          message: prev.message + '\n' + data.content,
        }));
      } else {
        setMessageListTemp({
          sender: groupId,
          message: '',
        });
        setScaffold(data.buttons);
        if (buttonGroupRef.current) {
          const height = buttonGroupRef.current.clientHeight;
          setButtonGroupHeight(height);
        }
      }
      setCheckGroupMessage(true);
    }
    if (chatRoomOpen === true) {
      socket.emit('joinRoom', data.groupId);
      console.log('joinRoom', data.groupId);
    }
    socket.on('receiveMessage', receive_message);
    return () => {
      socket.off('receiveMessage', receive_message);
      // socket.disconnect(); // 斷開socket連接
    };
  }, [socket, chatRoomOpen]);

  // const handleClickOpen = () => {
  //   setCheckGroupMessage(true);
  // };
  useEffect(() => {
    if (buttonGroupRef.current) {
      const height = buttonGroupRef.current.clientHeight;
      setButtonGroupHeight(height);
    }
  }, [scaffold]);

  const handleScaffoldClick = (e) => {
    setMessage(e + message);
  };
  const doubleCheckYes = () => {
    setCheckGroupMessage(true);
    setMessageAlertCheck(true);
    setMessageAlert([]);
    const messageData = {
      content: message,
      groupId: data.groupId,
      author: data.author,
    };
    socket.emit('sendMessage', messageData);
    console.log('send message', messageData);
    setMessageList((prev) => [...prev, messageData]);
    setMessageListTemp((prev) => ({
      ...prev,
      message: prev.message + '\n' + message,
    }));
    setMessage('');
  };
  const doubleCheckNo = () => {
    // setCheckGroupMessage(true);
    setMessageAlertCheck(true);
    setMessageAlert([]);
  };

  return (
    <>
      <Dialog
        open={messageAlertCheck === false}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'是否要提出此想法？'}
        </DialogTitle>
        <DialogContent>
          {messageAlert.map((content, index) => (
            <React.Fragment key={index}>
              {index + 1}.&nbsp;&nbsp;&nbsp;
              {content}
              <br />
            </React.Fragment>
          ))}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={doubleCheckNo}>
            否
          </Button>
          <Button variant="contained" onClick={doubleCheckYes} autoFocus>
            是
          </Button>
        </DialogActions>
      </Dialog>
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
                border: '3px solid grey',
                marginBottom: '10px',
                borderRadius: 1,
                textAlign: 'center', // 让其子元素水平居中
              }}
            >
              <Button
                size="medium"
                variant="outlined"
                endIcon={<TaskAltRoundedIcon />}
                style={{
                  width: '98%',
                  marginTop: '1%',
                  marginBottom: '1%',
                  border: '3px solid',
                }}
                onClick={sendGroupMessage}
              >
                小組完成回覆
              </Button>
              <List
                sx={{
                  height: `calc(100% - ${buttonGroupHeight + 76}px)`, // 設置高度
                  overflowY: 'auto', // 設置垂直滾動條
                  /* 滾動條樣式開始 */
                  '&::-webkit-scrollbar': {
                    width: '8px', // 滾動條寬度
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1', // 軌道背景色
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#888', // 滑塊背景色
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: '#555', // 鼠標懸停時的滑塊背景色
                  },
                  /* 滾動條樣式結束 */
                }}
              >
                {/* 這裡是 List 中的內容 */}

                {messageList.map((message, index) => (
                  <ListItem
                    key={index}
                    style={{
                      justifyContent:
                        message.author === author ? 'flex-end' : 'flex-start',
                      flexDirection: 'column',
                      alignItems:
                        message.author === author ? 'flex-end' : 'flex-start',
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
                      {message.author === 'assistant' ? (
                        <SmartToyOutlinedIcon />
                      ) : (
                        <FaceOutlinedIcon />
                      )}
                    </Avatar>
                    <div
                      style={{
                        backgroundColor:
                          message.author === 'assistant'
                            ? 'lightblue'
                            : 'white',
                        borderRadius: '6px',
                        padding: '6px',
                      }}
                    >
                      {message.content.split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </div>
                    {message.author}
                  </ListItem>
                ))}
              </List>
              <div
                style={{
                  color: 'black',
                  textAlign: 'left',
                  marginLeft: '10px', // 将文字靠左
                }}
              >
                回覆鷹架按鈕（請務必使用回覆鷹架）：
              </div>
              <ButtonGroup
                ref={buttonGroupRef}
                variant="outlined"
                aria-label="Basic button group"
                style={{
                  width: '98%',
                  // margin: '7px',
                  // border: '3px solid',
                  height: 'fit-content',
                  display: 'flex', // 添加这行样式
                  flexWrap: 'wrap', // 添加这行样式
                  marginRight: '3px',
                  marginLeft: '3px',
                }}
              >
                {scaffold.length > 0 &&
                  scaffold.map((value, index) => (
                    <Button
                      key={index}
                      onClick={() => handleScaffoldClick(value)}
                      style={{
                        // width: '100%',
                        border: '2px solid',
                        borderRadius: '20px',
                        marginLeft: '5px',
                        marginTop: '5px',
                      }}
                    >
                      {value}
                    </Button>
                  ))}
              </ButtonGroup>
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

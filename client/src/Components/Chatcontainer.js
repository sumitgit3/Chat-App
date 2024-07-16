import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import Logout from './Logout'
import Chatinput from './Chatinput'
import { addMessageRoute, getAllMessageRoute } from '../Utils/APIroutes'
import axios from 'axios'
const Chatcontainer = ({ currentChat, currentUser,socket }) => {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage,setArrivalMessage] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios.post(getAllMessageRoute, {
        from: currentUser._id,
        to: currentChat._id
      });
      setMessages(response.data);
    }
    fetchMessages();
    // eslint-disable-next-line
  }, [currentChat]);

  const handleSendMessage = async (message) => {
    socket.current.emit('send-msg',{
      from:currentUser._id,
      to:currentChat._id,
      message
    });
    await axios.post(addMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message
    });
    const msg = [...messages];
    msg.push({fromSelf:true,message});
    setMessages(msg);
  }

  useEffect(()=>{
    if(socket.current) {
      socket.current.on('message',(msg)=>{
        setArrivalMessage({fromSelf:false,message:msg});
      })
      arrivalMessage && setMessages((prev)=>[...prev,arrivalMessage]);
    }
    // eslint-disable-next-line
  },[arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <>
      {currentChat && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                  alt=""
                />
              </div>
              <div className="username">
                <h3>{currentChat.username}</h3>
              </div>
            </div>
            <Logout />
          </div>
          <div className="chat-messages">
            {messages.map((msg) => {
              return (
                <div className={`message ${msg.fromSelf ? 'sended' : 'recieved'}` } ref={scrollRef}>
                  <div className="content">
                    <p>
                      {msg.message}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
          <Chatinput handleSendMessage={handleSendMessage} />
        </Container>
      )
      }
    </>
  )
}

const Container = styled.div`
display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
      
  }
    .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }`;
export default Chatcontainer

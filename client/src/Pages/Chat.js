import React,{useState,useEffect, useRef} from 'react'
import {styled} from 'styled-components'
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { getAllUsersRoute } from '../Utils/APIroutes';
import Contact from '../Components/Contact';
import Welcome from '../Components/Welcome';
import Chatcontainer from '../Components/Chatcontainer';
import {io} from 'socket.io-client'
const Chat = () => {
  useEffect(()=>{
    if(!localStorage.getItem('authToken')) {
      navigate('/login');
    }
    // eslint-disable-next-line
  },[]);
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts,setContacts] = useState([]);
  const [currentUser,setCurrentUser] = useState(undefined);
  const [currentChat,setCurrentChat] = useState(undefined);
  useEffect(()=>{
    if(!localStorage.getItem('authToken')) {
      navigate('/login');
    }
    else {
      setCurrentUser(JSON.parse(localStorage.getItem('user')));
    }
    // eslint-disable-next-line
  },[]);
  useEffect(()=>{
    if(currentUser){
      socket.current = io('http://localhost:5000');
    socket.current.emit('add-user',currentUser._id) ;
    }
  },[currentUser])
  useEffect(()=>{
    const fetchContacts = async()=>{
      if(currentUser) {
        if (currentUser.isAvatarImageSet) {
          const response = await axios.get(`${getAllUsersRoute}/${currentUser._id}`);
          setContacts(response.data);
        }
        else {
          navigate('/setavatar');
        }
      }
    }
    fetchContacts();
    // eslint-disable-next-line
  },[currentUser]);
  const handleChatChange = (chat)=>{
    setCurrentChat(chat);
  }
  return (
    <Container>
      <div className="container">
         {currentUser && (
          <Contact contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
         )}
         {currentChat === undefined ? <Welcome/> :<Chatcontainer currentChat={currentChat} currentUser={currentUser} socket={socket}/> } 
      </div>
    </Container>
  )
}
const Container = styled.div`
  height:100vh;
  width:100vw;
  display:flex;
  flex-direction:column;
  gap:1rem;
  justify-content:center;
  align-items:center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
export default Chat

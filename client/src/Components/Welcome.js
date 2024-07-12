import React,{useState,useEffect} from 'react'
import styled from 'styled-components';
import WelcomeWave from '../assets/WelcomeWave.jpeg'
const Welcome = () => {
    const [userName, setUserName] = useState("user");
    useEffect(()=>{
        const getUsername = async ()=>{
          if (localStorage.getItem('user')) {
            setUserName(JSON.parse(localStorage.getItem('user')).username);
          }
            
        }
        getUsername();
    },[])
  return (
    <Container>
      <img src={WelcomeWave} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  )
}
const Container = styled.div`
display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
    margin : 0.5rem;
  }
  span {
    color: #4e0eff;
  }
`;

export default Welcome

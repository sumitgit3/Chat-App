import { React, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'
import { Spinner } from '@chakra-ui/react'
import { Buffer } from 'buffer';
import { setAvatarRoute } from '../Utils/APIroutes';

const SetAvatar = () => {
  const [avatars,setAvatars] = useState([]);
  const [selectedAvatarIndex,setselectedAvatarIndex] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const toastObject = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    theme: "dark"
  }
  useEffect(()=>{
    if(!localStorage.getItem('authToken')) {
      navigate('/login');
    }
    // eslint-disable-next-line
  },[]);
  
  //component did mount ,works once after first render ->Function->To fetch the avatars
  useEffect( () => { 
    const fetchAvatars = async ()=>{
      let avatarsData = [];
      for(let i = 0; i < 4 ; i++) {
        const response =  await axios('https://api.multiavatar.com/'+Math.round(Math.random()*1000)+"?apikey=om2nRhpbicD0wF");
        //converting svg to base64 
        const buffer = Buffer.from(response.data);
        avatarsData.push(buffer.toString('base64'));
      }
      setAvatars(avatarsData);
      setIsLoading(false);
    }
    fetchAvatars();
  }, []);
  const setProfilePicture = async (index)=>{
      try {
        if(selectedAvatarIndex === undefined) {
          return toast.error("Please select an avatar",toastObject);
        }
        const userId = JSON.parse(localStorage.getItem('user'))._id;
        const response = await axios.post(`${setAvatarRoute}/${userId}`,{
          image:avatars[selectedAvatarIndex]
        });
        if (response.data.status === true) {
          localStorage.setItem('user',JSON.stringify(response.data.user));
          navigate('/');
        }
        else {
          toast.error("Error setting avatar. Please try again.", toastObject);
        }
        
      } 
      catch (error) {
        toast.error("Error!Please try again to set Profile picture",toastObject);
      }
  }
  return (
    <>
      {isLoading ?
      <Container>
         <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='blue.500'
        size='xl'
      />
      </Container>
      : <Container>
          <div className="title-container">
            <h1>Choose your avatar</h1>
          </div>
           <div className="avatars">
            {avatars.map((avatar,index)=>{
              return (
                <div key={index} className={`avatar ${selectedAvatarIndex === index ? "selected" : ""}`}>
                  <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" onClick={()=> setselectedAvatarIndex(index)} />
                </div>
              );
            })}
           </div>
           <button className='submit-btn' onClick={()=>setProfilePicture(selectedAvatarIndex)}>
              Set as Profile Picture
           </button>
      </Container>
      }
      <ToastContainer/>
    </>
  )
}
const Container = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  flex-direction:column;
  gap:3rem;
  background-color:#131324;
  height:100vh;
  width:100vw;

  .title-container {
    h1 {
      color: white;
    }
  }
  
  .avatars {
    display:flex;
    gap:2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
      
  }
    .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  


`;
export default SetAvatar

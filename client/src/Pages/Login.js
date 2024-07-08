import {React,useEffect,useState} from 'react'
import styled from 'styled-components'
import {Link,useNavigate} from 'react-router-dom';
import  Heyicon from '../assets/Heyicon.svg'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'
import { loginRoute } from '../Utils/APIroutes';

const Login = () => {
  const [values,setValues] = useState({
    username : "",
    password: ""
  });
  const navigate = useNavigate();
  useEffect(()=>{
    if(localStorage.getItem("authToken"))
      navigate('/');
    // eslint-disable-next-line
  },[]);
  const toastObject ={
    position:"bottom-right",
    autoClose:8000,
    pauseOnHover:true,
    theme:"dark"
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    if(handleValidation()) {
      const {username,password} = values;
      const {data} = await axios.post(loginRoute,{
        username,
        password
      });
      if (data.status === false) {
        toast.error(data.msg,toastObject);
        return false;
      }
      if(data.status === true) {
        localStorage.setItem('authToken',data.token);
        localStorage.setItem('user',JSON.stringify(data.user));
        navigate('/');
      }
    }
  }
  const handleOnChange = (event) =>{
    setValues({...values,[event.target.name] : event.target.value})
  }
  const handleValidation = ()=> {
    const {username,password} = values;
    if(password === "") {
      toast.error("Username and password is required",toastObject);
      return false;
    }
    else if(username === "") {
      toast.error("Username and password is required",toastObject);
      return false;
    }
    else {
      return true;
    }
  }
  return (
    <>
    <FormContainer>
      <form onSubmit={(event) => handleSubmit(event)}>
        <div className="brand">
          <img src={Heyicon} alt="icon" />
          <h1>HEY</h1>
        </div>
        <input
          type="text"
          placeholder='Username'
          name='username'
          onChange={(e)=>handleOnChange(e)}
        />
        <input
          type="password"
          placeholder='Password'
          name='password'
          onChange={(e)=>handleOnChange(e)}
        />
        <button type='submit'>Login</button>
        <span>Don't have an account?<Link to="/register"> Sign up</Link></span>
      </form>
    </FormContainer>
    <ToastContainer/>
    </>
  )
}

const FormContainer = styled.div`
height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
    img {
      height: 3rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
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
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }`;
export default Login

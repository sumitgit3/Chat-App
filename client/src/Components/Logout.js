import React from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
const Logout = () => {
    const navigate = useNavigate();
const handleLogout = ()=>{
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    navigate('/login');
}
  return (
    <Container>
      <button onClick={handleLogout}>Logout <i className="fa-solid fa-right-from-bracket "></i></button>
    </Container>
  )
}
const Container = styled.div`
    button {
        color:white;
    }
`;

export default Logout

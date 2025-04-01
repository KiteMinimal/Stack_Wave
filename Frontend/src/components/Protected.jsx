
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { BASE_URL } from '../utils/constants';

const Protected = ({children}) => {

    const navigate = useNavigate();

    
    useEffect(() => {
        let token = localStorage.getItem("token");
        if(!token){
            navigate("/auth")
        }
        axios.get(BASE_URL + "/api/auth/me", {
            headers: { Authorization : `bearer ${token}` }
        })
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            navigate("/auth")
        })
    },[])

  return children;
}

export default Protected
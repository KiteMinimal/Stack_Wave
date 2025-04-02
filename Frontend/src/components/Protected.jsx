
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { addUser } from '../store/userSlice';

const Protected = ({children}) => {

    const navigate = useNavigate();
    const [user,setUser] = useState(null);
    const dispatch = useDispatch();
    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if(!token){
            return navigate("/auth")
        }
        axios.get(BASE_URL + "/api/auth/me", {
            headers: { Authorization : `bearer ${token}` }
        })
        .then((res) => {
            console.log(res);
            setUser(res.data.user)
            dispatch(addUser({user: res?.data?.user, token}))
        })
        .catch((err) => {
            navigate("/auth")
        })
    },[dispatch,navigate])

    useEffect(() => {
        if(user && !user?.isVerified){
            return navigate("/auth")
        }
    },[dispatch,navigate])


  return children;
}

export default Protected
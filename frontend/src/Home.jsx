import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';


function Home(props) {
    const [auth,setAuth]=useState(false)
    const [mssg,setMssg]=useState('')
    const [name,setName]=useState('')
    useEffect(()=>{
     axios.get('http://localhost:3000').then(res=>{
        if(res.data.status==="success"){
            setAuth(true)
            setName(res.data.name)
            console.log(res.data);
        }else{
            setAuth(false)
            setMssg(res.data.message)
        }
     }).catch(err=>console.log("error while getting user:",err))
    })
    const handleLogout=async ()=>{
       try {
        const res=await axios.get('http://localhost:3000/logout')
        if(res.data.status==="success") location.reload(true)
       } catch (error) {
           console.log(error);
       }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                {auth ? (
                    <div>
                        <h3 className="text-xl font-semibold mb-4">You are authorized. Welcome home, {name}!</h3>
                        <button
                            onClick={handleLogout}
                            className="py-2 px-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-lg text-red-500 mb-4">{mssg}</h3>
                        <h3 className="text-xl font-semibold mb-4">Login Now</h3>
                        <Link
                            to="/login"
                            className="text-blue-500 hover:underline text-lg"
                        >
                            Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
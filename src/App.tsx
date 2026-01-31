import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { NavBar, Dashboard } from "./components/Background/Background";
import { Link } from "react-router";

const API_URL = import.meta.env.VITE_API_URL

export default function App(){
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef= useRef<HTMLInputElement>(null)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault()
        const payload = {
            email: emailRef.current?.value,
            password: passwordRef.current?.value
        }
        const response = await fetch(`${API_URL}/login/admin`, {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(payload)
        })

        console.log(response)
        const result = await response.json()
        if (response.status >= 400){
            if (result.message) {
                setError(result.message)
                return
            } else {
                return navigate("/errorpage")
            }
        }
        

        if (passwordRef.current){
            passwordRef.current.value = ""
        }
        setError(null)
        localStorage.setItem("token", result.token)
        return navigate("/home")
    }

    return (
        <>
            <NavBar />
            <Dashboard>
                <div className="flex flex-col justify-center items-center">
                    <p className="text-4xl text-default-color">Admin Login</p>

                </div>
                <form className="form-container md:px-20" onSubmit={handleSubmit}>
                    <p className="text-red-600">{error}</p>
                    <input className="input-login" type="email" 
                    name="email"
                    id="email"
                    placeholder="Email"
                    ref={emailRef}
                    required/>

                    <input className="input-login" type="password" 
                    name="pass"
                    id="pass"
                    placeholder="Password"
                    ref={passwordRef}
                    required/>

                    <button className="group login-btn" type="submit"><span className="hover-text">Login</span></button>
                </form>
                <div className="flex justify-center">
                    <p>Dont have an account? <Link className="text-sky-500 hover:underline" to="/signup">Click here </Link>to signup</p></div>
            </Dashboard>
        </>
    )
}
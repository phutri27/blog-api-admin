import React, { useState } from "react";
import { Form } from "react-router";
import { useNavigate } from "react-router";
import { NavBar, Dashboard } from "./Background/Background";

const API_URL = import.meta.env.VITE_API_URL

type Credentials = {
    email: string,
    password: string,
    confirmPass: string
}


type ErrorDisplay = {
    errors: string[],
    keyword: string
}

function ErrDisplay({errors, keyword}: ErrorDisplay) {
    return (
        <>
            {errors.map((err) => 
                (err.includes(keyword) ? 
            <div className="text-red-500">{err}</div> : null)
            )}
        </>
    )
}

export default function Signup(){
    const [form, setForm] = useState<Credentials>({
        email:'',
        password: '',
        confirmPass: ''
    })

    const [errors, setError] = useState<string[]>([])
    const navigate = useNavigate()

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm({...form, [name]: value})
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const response = await fetch(`${API_URL}/signup`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(form)
        })
        const result = await response.json()
        if (response.status >= 400){
            if (result.errors){
                setError(result.errors)
                return
            } else {
                return navigate("/errorpage")
            }
        }
        return navigate("/login")
    }

    return (
        <>
            <NavBar/>
            <Dashboard>
                <div className="flex flex-col justify-center items-center">
                    <p className="text-4xl text-default-color">Sign up Form</p>
                    <p className="text-content-color text-2xl font-medium">Sign up to explore</p>
                </div>
                <Form className="form-container md:px-20" onSubmit={handleSubmit}>
                    <ErrDisplay errors={errors} keyword="Email"/>
                    <input className="input-signup" type="email"
                    name="email"
                    id="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required/>

                    <ErrDisplay errors={errors} keyword="Password"/>
                    <input className="input-signup" type="password" 
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required/>

                    <ErrDisplay errors={errors} keyword="Password"/>
                    <input className="input-signup" type="password" 
                    name="confirmPass"
                    id="confirm"
                    placeholder="Confirm Password"
                    value={form.confirmPass}
                    onChange={handleChange}
                    required/>

                    <button className="signup-btn" type="submit">Sign Up</button>
                </Form>
            </Dashboard>
        </>
    )
}
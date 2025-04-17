import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../AuthContext'
import { toast } from "react-toastify";
import { baseURL } from '../utils/api';

function Signup() {

    const [userEmail, setUserEmail] = useState("")
    const [userPassword, setUserPassword] = useState("")
    const [step, setStep] = useState(1)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { login } = useAuth()

    const navigate = useNavigate()

    const onSignup = async (email, password) => {
        try {
            const res = await fetch(`${baseURL}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            })

            if (!res.ok) {
                const errorData = await res.json();
                toast.error(errorData.message || "Invalid email or password");
                return;
            }

            const data = await res.json()
            toast.success("New account created successfully")

        } catch (error) {
            console.log("Error logging in", error)
            toast.error("An error occurred while signing up. Please try again.")
        }
    }

    const onLogin = async (body) => {
        try {
            const res = await fetch(`${baseURL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })

            if (!res.ok) {
                const errorData = await res.json();
                // console.error("Login failed:", errorData.message || "Unknown error");
                toast.error(errorData.message || "Invalid email or password");
                return;
            }

            const data = await res.json()
            if (data.token) {
                login(data.token)
                toast.success("Login successful")
                navigate("/dashboard")
            }

        } catch (error) {
            console.log("Error logging in", error)
            toast.error("An error occurred while logging in. Please try again.")
        }
        // console.log(data.token)
    }

    const handleSignup = (e) => {
        e.preventDefault()
        onSignup(email, password)
        navigate("/signup")
        setEmail("")
        setPassword("")
    }


    const handleLogin = (e) => {
        e.preventDefault()
        const body = {
            email: userEmail,
            password: userPassword
        }
        onLogin(body)
    }

    return (
        <div className='wrapper'>
            <div className='signup register__container'>
                {step === 0 && <form onSubmit={handleSignup}>
                    <h1 className='title'>Account Sign up</h1>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input name='email' required value={email} onChange={(e) => setEmail(e.target.value)} type="text" />
                    </div>
                    <div>
                        <label htmlFor="">Password</label>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" />
                    </div>
                    <input type='submit' value="Sign up" />
                </form>}

                {step === 1 && <div>
                    <h1 className='title'>Account Login</h1>
                    <form onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input name='email' value={userEmail} onChange={(e) => setUserEmail(e.target.value)} type="text" />
                        </div>
                        <div>
                            <label htmlFor="">Password</label>
                            <input onChange={(e) => setUserPassword(e.target.value)} value={userPassword} type="password" />
                        </div>
                        <input type='submit' value="Login" />
                    </form>
                </div>}
                <div>
                    {step === 0 ? <div className='account__login' onClick={() => setStep(1)}>Already have an account? <span> Login</span></div> :
                        <div className='signup__container'>
                            <p>If you are a new, register below 👇</p>
                            <div className='signup__btn' onClick={() => setStep(0)}>Create new account</div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Signup
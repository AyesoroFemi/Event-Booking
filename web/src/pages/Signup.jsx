import React, { useState } from 'react'
import { useNavigate } from 'react-router'

// const baseUrl = "http://localhost:8080/signup"

function Signup() {

    const [userEmail, setUserEmail] = useState("")
    const [userPassword, setUserPassword] = useState("")
    const [step, setStep] = useState(0)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const onSignup = async (email, password) => {
        const res = await fetch("http://localhost:8080/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
    }

    const onLogin = async (body) => {
        const res = await fetch("http://localhost:8080/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })

        const data = await res.json()
        if (data.token) {
            localStorage.setItem("eventToken", data.token)
            navigate("/dashboard")
        }
        // console.log(data.token)
    }

    const handleSignup = (e) => {
        e.preventDefault()
        onSignup(email, password)
        navigate("/")
    }


    const handleLogin = (e) => {
        e.preventDefault()
        const body = {
            email: userEmail,
            password: userPassword
        }
        onLogin(body)
        navigate("/")
    }

    return (
        <div className='signup'>
            <div className='tab'>
                <div onClick={() => setStep(0)}>Sign Up</div>
                <div onClick={() => setStep(1)}>Login </div>
            </div>
            {step === 0 && <form onSubmit={handleSignup}>
                <h1>Sign up into the event booking...</h1>
                <div>
                    <label htmlFor="email">Email</label>
                    <input name='email' value={email} onChange={(e) => setEmail(e.target.value)} type="text" />
                </div>
                <div>
                    <label htmlFor="">Password</label>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" />
                </div>
                <button type='submit'>Submit</button>
            </form>}

            {step === 1 && <div>
                <h1>Login into the event booking...</h1>
                <form onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input name='email' value={userEmail} onChange={(e) => setUserEmail(e.target.value)} type="text" />
                    </div>
                    <div>
                        <label htmlFor="">Password</label>
                        <input onChange={(e) => setUserPassword(e.target.value)} value={userPassword} type="password" />
                    </div>
                    <button type='submit'>Submit</button>
                </form>
            </div>}
        </div>
    )
}

export default Signup
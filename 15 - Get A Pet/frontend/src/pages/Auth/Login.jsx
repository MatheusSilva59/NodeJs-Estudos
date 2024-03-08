import '../Forms.css'

import useApiRequest from '../../hooks/useApiRequest'
import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useUserContext } from '../../hooks/useUserContext'

const Login = () => {
    const url = 'http://localhost:3000/login'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { response, rawResponse, error, loading, callRequest } = useApiRequest(url, false)

    const { setUserId, setAuthenticated, handleFlashMessage, httpCodeRegexByRange } = useUserContext()

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            callRequest('POST', { email, password }, { credentials: 'include', })
            setEmail('')
            setPassword('')
            // console.log(response)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (rawResponse.status === 200 && !loading) {
            try {
                console.log(response)
                setUserId(response.userByEmail._id)
                setAuthenticated(true)
                handleFlashMessage('success', response.message, 'cross')
                navigate('/')
            } catch (err) {
                console.log(err)
            }
        }
        else if (rawResponse.status?.toString().match(httpCodeRegexByRange['400'])) {
            handleFlashMessage('error', response.message)
        }
    }, [response])



    return (
        <main id='default-form'>
            <div className="form-control">
                <div>
                    <h1>
                        Login
                    </h1>
                </div>
                <form className='form-default-item' onSubmit={handleSubmit}>
                    <label>
                        E-mail:
                        <input type="email" name="email" placeholder='Type your email address' value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </label>
                    <label>
                        Password:
                        <input type="password" name="password" placeholder='Type your password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </label>
                    <button className='btn btn-fullwidth btn-success'>Login</button>
                </form>
                <div>
                    <h4>
                        Don't have an account? <NavLink to='/register'>Click here</NavLink>
                    </h4>
                </div>
            </div>
        </main>
    )
}

export default Login
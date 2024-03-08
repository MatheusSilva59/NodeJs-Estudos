import '../Forms.css'

import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useReducer, useState } from 'react'
import useApiRequest from '../../hooks/useApiRequest'
import { useUserContext } from '../../hooks/useUserContext'

const Register = () => {
    const url = 'http://localhost:3000/register'

    const { handleFlashMessage, httpCodeRegexByRange } = useUserContext()

    const navigate = useNavigate()

    const [user, setUser] = useState({})

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const { rawResponse, response, loading, error, callRequest } = useApiRequest(url, false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        callRequest('POST', user, { credentials: 'include' })
    }

    useEffect(() => {
        const status = rawResponse.status?.toString()

        if (status?.match(httpCodeRegexByRange['200']) && !loading) {
            handleFlashMessage('success', response.message, 'cross')
            navigate('/')
        }
        else if (status?.match(httpCodeRegexByRange['400'])) {
            handleFlashMessage('error', response.message, 'inner')
        }

    }, [response])

    return (
        <main id='default-form'>
            <div className="form-control">
                <div>
                    <h1>
                        Register
                    </h1>
                </div>
                <form className='form-default-item' onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input type="text" name="name" placeholder='Type your name' value={user?.name} onChange={handleChange} required />
                    </label>
                    <label>
                        Phone Number:
                        <input type="text" name="phoneNumber" placeholder='Type your phone number' value={user?.phoneNumber} onChange={handleChange} required />
                    </label>
                    <label>
                        E-mail:
                        <input type="email" name="email" placeholder='Type your email address' value={user?.email} onChange={handleChange} required />
                    </label>
                    <label>
                        Password:
                        <input type="password" name="password" placeholder='Type your password' value={user?.password} onChange={handleChange} required />
                    </label>
                    <label>
                        Password Confirmation:
                        <input type="password" name="passwordConfirmation" placeholder='Reply the password' value={user?.passwordConfirmation} onChange={handleChange} required />
                    </label>
                    <button className='btn btn-fullwidth btn-success'>Register</button>
                </form>
                <div>
                    <h4>
                        Do you already have an account? <NavLink to='/login'>Click here</NavLink>
                    </h4>
                </div>
            </div>
        </main>
    )
}

export default Register
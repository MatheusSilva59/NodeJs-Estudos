import { createContext, useEffect, useState } from 'react'
import useApiRequest from '../hooks/useApiRequest'
import { useLocation } from 'react-router-dom'

export const UserContext = createContext()

export const UserContextProvider = ({ children }) => {
    const url = 'http://localhost:3000/checkAuth'
    const [authenticated, setAuthenticated] = useState(null)
    const [userId, setUserId] = useState('')

    const flashInitialState = { level: '', message: '', type: 'inner', action: '', count: 0 }

    const [flashMessage, setFlashMessage] = useState({ level: '', message: '', type: 'inner', count: 0 })

    const httpCodeRegexByRange = {
        100: /\b1\d{2}\b/,
        200: /\b2\d{2}\b/,
        300: /\b3\d{2}\b/,
        400: /\b4\d{2}\b/,
        500: /\b5\d{2}\b/
    }

    const handleFlashMessage = (level = 'info', message = '', type = 'inner') => {
        const flash = {
            level,
            message,
            type,
            count: flashMessage.count + 1
        }
        setFlashMessage(flash)
    }

    const { rawResponse, response, error, loading, setLoading, callRequest } = useApiRequest(url, false, false)

    useEffect(() => {
        async function main() {
            callRequest('GET', null, { credentials: 'include' })
        }

        main()

    }, [flashMessage.type])

    useEffect(() => {

        if (response._id) {
            // check if the user._id is valid
            setUserId(response._id)
            setAuthenticated(true)
            setLoading(false)
        }
        else {
            setAuthenticated(false)
        }
    }, [response])
    // console.log('Loading: ', loading)

    return (
        <>
            {!loading && (
                <UserContext.Provider value={{ authenticated, userId, setUserId, setAuthenticated, flashMessage, handleFlashMessage, httpCodeRegexByRange }}>
                    {children}
                </UserContext.Provider>
            )}
        </>
    )
}

import React, { useEffect } from 'react'
import useApiRequest from '../hooks/useApiRequest'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../hooks/useUserContext'

const Logout = () => {
    const url = 'http://localhost:3000/logout'
    const { rawResponse, response, loading, error, callRequest } = useApiRequest(url)

    const { setUserId, setAuthenticated, handleFlashMessage, httpCodeRegexByRange } = useUserContext()
    const navigate = useNavigate()

    useEffect(() => {
        callRequest('GET', null, { credentials: 'include', })
    }, [])

    useEffect(() => {

        if (rawResponse.status === 200) {
            setUserId(null)
            setAuthenticated(false)
            navigate('/')
        }

        const status = rawResponse.status?.toString()

        if (status?.match(httpCodeRegexByRange['200'])) {
            handleFlashMessage('success', response.message, 'cross')
        }
        else if (status?.match(httpCodeRegexByRange['400'])) {
            handleFlashMessage('error', response.message, 'inner')
        }

    }, [response])

}

export default Logout
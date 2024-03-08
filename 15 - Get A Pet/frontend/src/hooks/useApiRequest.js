import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/UserContext'

const useApiRequest = (url, startGettingData = true, automaticLoanding = true) => {
    const [response, setResponse] = useState([])
    const [rawResponse, setRawResponse] = useState([])
    const [method, setMethod] = useState()
    const [data, setData] = useState([])
    const [options, setOptions] = useState({})
    const [config, setConfig] = useState([url])
    const [loading, setLoading] = useState(startGettingData ? false : true)
    const [error, setError] = useState()

    const [callRender, setCallRender] = useState(0)
    const [proceed, setProceed] = useState(startGettingData)

    const context = useContext(UserContext)

    const callRequest = (method, data = null, options = {}) => {
        setMethod(method)
        setData(data)
        setOptions(options)
        // setLoading(true)
        setProceed(true)
    }

    useEffect(() => {
        if (startGettingData) {
            setLoading(true)
        }
        switch (method) {
            case 'GET':
                setConfig(
                    [
                        url,
                        {
                            method,
                            ...options
                        }
                    ])
                break
            case 'POST':
                setConfig(
                    [
                        url,
                        {
                            method,
                            headers: {
                                'Content-Type': 'Application/json'
                            },
                            ...options,
                            body: JSON.stringify(data)
                        }
                    ])
                break
            case 'PATCH':
                setConfig(
                    [
                        url,
                        {
                            method,
                            headers: {
                                'Content-Type': 'Application/json'
                            },
                            ...options,
                            body: JSON.stringify(data)
                        }
                    ]
                )
                break
            case 'DELETE':
                setConfig(
                    [
                        `${url}/${data._id}`,
                        {
                            method,
                            ...options,
                        }
                    ]
                )
                break
            default:
                break
        }
    }, [method, data, options])

    useEffect(() => {
        const controller = new AbortController()
        try {
            async function main() {

                // const blob = new Blob([JSON.stringify(data)], { type: 'Application/json' })
                // console.log('payloadSize: ', )
                const res = await fetch(...config)
                const status = (res.status).toString()

                if (status.match(/\b4\d{2}\b/) != null) {
                    setLoading(false)
                    if (context?.setAuthenticated) {
                        // context.setAuthenticated(false)
                    }
                }
                // console.log(context)
                if (context?.authenticated) {
                    // context.setCheckAuth(prev => prev + 1)
                    // console.log(context.authenticated)
                }

                const json = await res.json()
                setResponse(json)
                setRawResponse(res)
            }

            if (proceed) {
                main()
            }

        } catch (err) {
            setError(err)
        } finally {
            if (automaticLoanding) {
                setLoading(false)
            }
        }

        return () => {
            controller.abort()
        }
    }, [config, callRender])

    // console.log(url, callRender)

    return { rawResponse, response, error, loading, setLoading, setCallRender, callRequest }
}

export default useApiRequest
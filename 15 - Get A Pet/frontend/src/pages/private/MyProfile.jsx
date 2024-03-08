import { useContext, useEffect, useReducer, useRef, useState } from 'react'
import '../Forms.css'
import './MyProfile.css'
import { useUserContext } from '../../hooks/useUserContext'
import useApiRequest from '../../hooks/useApiRequest'
import Render from '../../components/PhotoEditor/Render.jsx'


const MyProfile = () => {
    const url = 'http://localhost:3000/user/profile'
    const { handleFlashMessage, httpCodeRegexByRange } = useUserContext()
    const { response, rawResponse, error, loading, setLoading, setCallRender, callRequest } = useApiRequest(url, false, false)
    const urlEdit = 'http://localhost:3000/user/edit'
    const editFetch = useApiRequest(urlEdit, false)

    const [currentProfileImage, setCurrentProfileImage] = useState(null)

    const [user, setUser] = useState({})

    const handleChange = (e, customOperation = false) => {
        if (customOperation) {
            setUser({ ...user, profileImage: e })
        }
        else if (e?.target?.name) {
            if (e.target.name === 'profileImage') {
                setUser({ ...user, profileImage: null })
            }
            else {
                setUser({ ...user, [e.target.name]: e.target.value })
            }
        }
        else {
            setUser(e)
        }
    }

    useEffect(() => {
        async function main() {
            callRequest('GET', null, { credentials: 'include' })
        }
        main()
    }, [])

    const [saveImage, setSaveImage] = useState()
    const [isOver, setIsOver] = useState(false)

    useEffect(() => {
        const status = rawResponse.status?.toString()

        document.addEventListener('wheel', (event) => {
            let currentIsOver
            setIsOver(prev => {
                currentIsOver = prev
                return prev
            })
            if (currentIsOver) {
                event.preventDefault()
            }
        }, { passive: false })

        if (status?.match(httpCodeRegexByRange['200'])) {
            handleChange(response)
            setCurrentProfileImage(response?.profileImage_id?.profileImage)
            setLoading(false)
        }
    }, [rawResponse.status])

    useEffect(() => {
        const status = editFetch.rawResponse.status?.toString()

        if (status?.match(httpCodeRegexByRange['200']) && !loading) {
            handleFlashMessage('success', editFetch.response.message, 'inner')
        }
        else if (status?.match(httpCodeRegexByRange['400']) || status?.match(httpCodeRegexByRange['500'])) {
            handleFlashMessage('error', editFetch.response.message, 'inner')
        }

    }, [editFetch.response])

    const handleSubmit = async (e) => {
        e.preventDefault()
        editFetch.callRequest('PATCH', user, { credentials: 'include' })
    }

    return (
        <main id='default-form'>
            {!loading && (
                <div className="form-control">
                    <div>
                        <h1>
                            Profile
                        </h1>
                    </div>
                    <div id='img-container'>
                        {saveImage && (
                            <Render file={saveImage} size={200} handleChange={handleChange} isOver={isOver} setIsOver={setIsOver} handleFlashMessage={handleFlashMessage} currentProfileImage={currentProfileImage} />
                        )}
                        {!saveImage && user.profileImage_id && (
                            <img src={user.profileImage_id?.profileImage} />
                        )}
                    </div>
                    <form className='form-default-item' onSubmit={handleSubmit}>
                        <label>
                            Imagem:
                            <input type="file" accept="image/png, image/jpeg" name="profileImage" onChange={(e) => {
                                handleChange(e)
                                setSaveImage(e.target.files[0])
                            }} />
                        </label>
                        <label>
                            E-mail:
                            <input type="email" name="email" placeholder='Type your email address' value={user?.email} onChange={handleChange} required />
                        </label>
                        <label>
                            Name:
                            <input type="text" name="name" placeholder='Type your name' value={user?.name} onChange={handleChange} required />
                        </label>
                        <label>
                            Phone Number:
                            <input type="text" name="phoneNumber" placeholder='Type your phone number' value={user?.phoneNumber} onChange={handleChange} required />
                        </label>
                        <label>
                            Password:
                            <input type="password" name="password" placeholder='Type your password' value={user?.password} onChange={handleChange} />
                        </label>
                        <label>
                            Password Confirmation:
                            <input type="password" name="passwordConfirmation" placeholder='Confirm your password' value={user?.passwordConfirmation} onChange={handleChange} />
                        </label>
                        <button className='btn btn-fullwidth btn-success'>Edit</button>
                    </form>
                </div>
            )}
        </main>
    )
}

export default MyProfile
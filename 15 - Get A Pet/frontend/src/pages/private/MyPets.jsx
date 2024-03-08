import { NavLink, useNavigate } from 'react-router-dom'
import './MyPets.css'
import useApiRequest from '../../hooks/useApiRequest'
import { useEffect, useState } from 'react'
import { useUserContext } from '../../hooks/useUserContext'
import ConditionalPetImage from '../../components/ConditionalPetImage'

const MyPets = (props) => {
    const url = 'http://localhost:3000/pets/mypets'
    const navigate = useNavigate()
    const { handleFlashMessage, httpCodeRegexByRange } = useUserContext()
    const { response: items, error, loading, setLoading, callRequest } = useApiRequest(url, false, false)

    const updateURL = 'http://localhost:3000/pets/adopt/status'
    const updateFetch = useApiRequest(updateURL, false)

    const deleteURL = 'http://localhost:3000/pets/delete'
    const deleteFetch = useApiRequest(deleteURL, false)

    const handleEdit = async (e) => {
        navigate(`/pet/edit/${e}`)
    }

    useEffect(() => {
        async function main() {
            callRequest('GET', null, { credentials: 'include' })
            console.log(props)
        }
        main()

    }, [updateFetch.response, deleteFetch.response])

    const handleUpdate = async (e) => {
        updateFetch.callRequest('PATCH', { _id: e }, { credentials: 'include' })
    }

    const handleDelete = async (e) => {
        deleteFetch.callRequest('DELETE', { _id: e }, { credentials: 'include' })
    }


    useEffect(() => {
        const status = updateFetch.rawResponse.status?.toString()

        if (status?.match(httpCodeRegexByRange['200'])) {
            handleFlashMessage('success', updateFetch.response.message, 'inner')
        }
        else if (status?.match(httpCodeRegexByRange['400'])) {
            handleFlashMessage('error', updateFetch.response.message, 'inner')
        }

    }, [updateFetch.response])

    useEffect(() => {
        const status = deleteFetch.rawResponse.status?.toString()

        if (status?.match(httpCodeRegexByRange['200'])) {
            handleFlashMessage('success', deleteFetch.response.message, 'inner')
        }
        else if (status?.match(httpCodeRegexByRange['400'])) {
            handleFlashMessage('error', deleteFetch.response.message, 'inner')
        }

    }, [deleteFetch.response])

    const [showPlusButton, setShowPlusButton] = useState(false)

    useEffect(() => {

        const handleResize = (e) => {
            if (e.target.innerWidth < 650) {
                setShowPlusButton(true)
            }
            else {
                setShowPlusButton(false)
            }
        }

        if (document.documentElement.clientWidth < 650) {
            setShowPlusButton(true)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <main id='container'>
            <div className='title-and-link'>
                <h1>
                    My Pets Registered
                </h1>
                <div>
                    <NavLink className='btn btn-small btn-info btn-small-custom' to='/pet/add'>{!showPlusButton ? "Register Pet" : "+"}</NavLink>
                </div>
            </div>
            <div id='mypets'>
                {!items && (
                    <h3>Don't have any pet registered yet</h3>
                )}
                {Array.isArray(items) && items.map((value, index) => (
                    <div key={value._id} className='pets'>
                        <div className='petInfo'>
                            <ConditionalPetImage source={value?.images?.[0]?.src} classImg='petImage-circle' />
                            <h2>{value.name}</h2>
                        </div>
                        {value.adoptions[0]?.status != 'Completed' ?
                            (
                                <div className='petAction'>
                                    {value.adoptions[0]?.status === 'Processing' && (
                                        <button onClick={() => handleUpdate(value.adoptions[0]._id)} className='btn btn-success-outline'>Complete</button>
                                    )}
                                    <button onClick={() => handleEdit(value._id)} className='btn-small btn-info-inverse'>Edit</button>
                                    <button onClick={() => handleDelete(value._id)} className='btn-small btn-info-inverse'>Delete</button>
                                </div>
                            )
                            :
                            (
                                <div className='petAction'>
                                    <h5>Pet has already been adopted</h5>
                                </div>
                            )}
                    </div>
                ))}
            </div>
        </main>
    )
}

export default MyPets
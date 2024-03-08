import './Pet.css'

import { NavLink, useParams } from 'react-router-dom'
import useApiRequest from '../hooks/useApiRequest'
import { useEffect } from 'react'
import { useUserContext } from '../hooks/useUserContext'

import ConditionalPetImageArray from '../components/ConditionalPetImageArray.jsx'
import DefaultPetImage from '../components/DefaultPetImage'

const Pet = () => {
    const { _id } = useParams()
    const url = `http://localhost:3000/pets/${_id}`
    const { rawResponse: petRawResponse, response: pet } = useApiRequest(url, true)

    const adoptUrl = 'http://localhost:3000/pets/adopt'

    const { rawResponse, response, error, loading, callRequest } = useApiRequest(adoptUrl, false)

    const { handleFlashMessage, httpCodeRegexByRange } = useUserContext()

    const handleVisit = async (e) => {
        e.preventDefault()
        callRequest('POST', { _id }, { credentials: 'include' })
    }

    useEffect(() => {
        const status = rawResponse.status?.toString()

        if (status?.match(httpCodeRegexByRange['200'])) {
            handleFlashMessage('success', response.message, 'inner')
        }
        else if (status?.match(httpCodeRegexByRange['400'])) {
            handleFlashMessage('error', response.message, 'inner')
        }
        // console.log(status)
    }, [response])

    useEffect(() => {
        const status = petRawResponse.status?.toString()

        if (status?.match(httpCodeRegexByRange['400'])) {
            handleFlashMessage('error', pet.message, 'inner')
        }

    }, [pet])

    // console.log(pet)
    return (
        <main id='pet'>
            {petRawResponse.status?.toString()?.match(httpCodeRegexByRange['200']) && (
                <div>
                    <div className="title">
                        <h1>
                            Meeting the pet: {pet.name}
                        </h1>
                        <h4>
                            If you are interested, you can schedule a visit.
                        </h4>
                    </div>
                    {/* <div id="carousel">
                        <ConditionalPetImageArray pets={pet?.images} />
                    </div> */}
                    <div className={`auto-layout ${pet?.images.length > 1 && 'auto-column'}`}>
                        {pet?.images.length != 0 ?
                            (
                                <ConditionalPetImageArray pets={pet?.images} />
                            )
                            :
                            (
                                <DefaultPetImage />
                            )
                        }
                    </div>
                    <div className='pet-detail'>
                        <h4>Weight: <span>{pet.weight} kg</span></h4>
                        <h4>Age: <span>{pet.age} years</span></h4>
                        {pet.adoptions[0]?.status != 'Completed' ?
                            (
                                <button onClick={handleVisit} className='btn btn-success'>Schedule a Visit</button>
                            )
                            :
                            (
                                <h4 className='success'>Adopted!</h4>
                            )
                        }
                    </div>
                </div>
            )}
        </main>
    )
}

export default Pet
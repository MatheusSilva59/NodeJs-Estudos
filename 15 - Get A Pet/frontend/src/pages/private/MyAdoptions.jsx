import './MyAdoptions.css'

import ConditionalPetImage from '../../components/ConditionalPetImage'

import useApiRequest from '../../hooks/useApiRequest'
import { useEffect } from 'react'

const MyAdoptions = () => {
    const url = 'http://localhost:3000/pets/myadoptions'
    const { response: adoptions, callRequest } = useApiRequest(url, false)

    useEffect(() => {
        async function main() {
            callRequest('GET', null, { credentials: 'include' })
        }
        main()
    }, [])

    console.log(adoptions)

    return (
        <main id='container'>
            <div className='title-and-link'>
                <h1>
                    My Adoptions
                </h1>
            </div>
            <div id='myadoptions'>
                {adoptions && adoptions.map((value, index) => (
                    <div className='adoption' key={value._id}>
                        <div className='adoptionInfo'>
                            <div className='petNameAndImage'>
                                <ConditionalPetImage source={value?.images?.[0]?.src} classImg='petImage-circle' />
                                <h4>{value.pet_id.name}</h4>
                            </div>
                        </div>
                        <div className='contactInfo'>
                            <h4>Call to: <span>{value.giver_id.phoneNumber}</span></h4>
                            <h4>Speak with: <span>{value.giver_id.name}</span></h4>
                        </div>
                        <div className='adoptionStatus'>
                            <h4>
                                <span>{value.status}</span>
                            </h4>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}

export default MyAdoptions
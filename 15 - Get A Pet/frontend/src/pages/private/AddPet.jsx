import '../Forms.css'
import './ShowImages.css'

import ConditionalPetImageArray from '../../components/ConditionalPetImageArray'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../../hooks/useUserContext'
import useApiRequest from '../../hooks/useApiRequest'


const AddPet = () => {
    const url = 'http://localhost:3000/pets/register'
    const { rawResponse, response, error, loading, setLoading, callRequest } = useApiRequest(url, false)
    const { handleFlashMessage, httpCodeRegexByRange } = useUserContext()

    const [petImages, setPetImages] = useState([])
    const [petUploadImages, setPetUploadImages] = useState([])
    const [petImagesFiles, setPetImagesFiles] = useState([])

    const navigate = useNavigate()

    const initialState = {
        name: '',
        age: '',
        weight: '',
        color: 'default'
    }
    const [petInfo, setPetInfo] = useState(initialState)

    const handleChange = (e) => {
        setPetInfo((prev) => {
            return { ...prev, [e.target.name]: e.target.value }
        })
    }

    useEffect(() => {
        const status = rawResponse.status?.toString()

        if (status?.match(httpCodeRegexByRange['200']) && !loading) {
            handleFlashMessage('success', response.message, 'cross')
            navigate('/pet/mypets')
        }
        else if (status?.match(httpCodeRegexByRange['400']) || status?.match(httpCodeRegexByRange['500'])) {
            handleFlashMessage('error', response.message, 'inner')
        }
    }, [response])

    const handleSubmit = async (e) => {
        e.preventDefault()
        callRequest('POST', { ...petInfo, petUploadImages }, { credentials: 'include' })
        // setPetInfo(initialState)
    }

    useEffect(() => {
        async function main() {
            const arr = await imageToURL(Object.values(petImagesFiles))
            setPetUploadImages(arr)
            setPetImages(prev => {
                return [...prev, ...arr]
            })
        }

        if (petImagesFiles || petImages) {
            main()
        }

    }, [petImagesFiles])

    const imageToURL = async (files) => {
        return Promise.all(files.map((file, idx) => {
            return new Promise((resolve, reject) => {
                if (!(file instanceof Blob)) {
                    reject(`O objeto fornecido não é um Blob: ${file}`)
                    console.log(file)
                    return
                }
                const reader = new FileReader()
                reader.onload = (e) => {
                    resolve({ src: e.target.result })
                }
                reader.onerror = (e) => {
                    reject({ error: e })
                }
                reader.readAsDataURL(file)
            })
        }))
    }
    return (
        <main className='central-form'>
            <div>
                <h1>
                    Add a Pet
                </h1>
            </div>
            <div className={`auto-layout ${petImages.length > 1 && 'auto-column'}`}>
                <ConditionalPetImageArray pets={petImages} />
            </div>
            <form className="form-default-item" onSubmit={handleSubmit}>
                <label>
                    Imagem:
                    <input multiple type="file" accept="image/*" name="petImages" onChange={e => setPetImagesFiles(e.target.files)} />
                </label>
                <label>
                    Name:
                    <input type="name" name="name" placeholder='Type the pet name' value={petInfo.name} onChange={handleChange} />
                </label>
                <label>
                    Age:
                    <input type="name" name="age" placeholder='Type the pet age' value={petInfo.age} onChange={handleChange} />
                </label>
                <label>
                    Weight:
                    <input type="number" name="weight" placeholder='Type the pet weight' value={petInfo.weight} onChange={handleChange} />
                </label>
                <label>
                    Choose the pet color
                    <select name="color" value={petInfo.color} onChange={handleChange}>
                        <option value="defaukt">Choose an option</option>
                        <option value="black">Black</option>
                        <option value="white">white</option>
                    </select>
                </label>
                <button className='btn btn-success btn-fullwidth'>
                    Register
                </button>
            </form>
        </main>
    )
}

export default AddPet
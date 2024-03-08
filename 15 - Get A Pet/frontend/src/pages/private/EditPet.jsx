import '../Forms.css'
import './ShowImages.css'

import { useUserContext } from '../../hooks/useUserContext'
import { useEffect, useState } from 'react'
import useApiRequest from '../../hooks/useApiRequest'
import { useParams } from 'react-router-dom'

import ConditionalPetImageArray from '../../components/ConditionalPetImageArray'
import DefaultPetImage from '../../components/DefaultPetImage'


const EditPet = () => {
    const { _id } = useParams()
    const url = 'http://localhost:3000/pets/' + _id

    const { rawResponse, response, error, loading, setLoading, callRequest } = useApiRequest(url, false, false)
    const { handleFlashMessage, httpCodeRegexByRange } = useUserContext()

    const initialState = {
        name: '',
        age: '',
        weight: '',
        color: '',
        petImages: {}
    }
    const [petInfo, setPetInfo] = useState(initialState)
    const [petImages, setPetImages] = useState([])
    const [petUploadImages, setPetUploadImages] = useState([])
    const [petDeleteImages, setPetDeleteImages] = useState([])
    const [petImagesFiles, setPetImagesFiles] = useState([])

    const updateUrl = 'http://localhost:3000/pets/update'
    const updateFetch = useApiRequest(updateUrl, false, false)

    const handleChange = (e) => {
        // console.log(e.target)
        setPetInfo((prev) => {
            return { ...prev, [e.target.name]: e.target.value }
        })
    }

    useEffect(() => {
        async function main() {
            callRequest('GET', null, { credentials: 'include' })
        }
        main()
    }, [])

    useEffect(() => {
        if (rawResponse.status === 200) {
            setPetInfo({ ...response })
            setPetImages(response.images ? response.images : [])
            setLoading(false)
        }
    }, [rawResponse])


    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(petUploadImages)
        updateFetch.callRequest('PATCH', { ...petInfo, petUploadImages, petDeleteImages }, { credentials: 'include' })
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
        async function main() {
            const arr = await imageToURL(Object.values(petImagesFiles))
            setPetUploadImages(prev => {
                return [...prev, ...arr]
            })
            setPetImages(prev => {
                return [...prev, ...arr]
            })
        }

        if (petImagesFiles || petImages) {
            main()
        }

    }, [petImagesFiles])

    const handleDeleteImage = (index) => {
        setPetImages(prev => {
            const newArray = [...prev]
            newArray.splice(index, 1)
            return newArray
        })

        if (petImages[index]?.idx != undefined) {
            setPetUploadImages(prev => {
                const newArray = [...prev]
                newArray.splice(petImages[index]?.idx, 1)
                return newArray
            })
        }

        if (petImages[index]?._id) {
            setPetDeleteImages(prev => {
                return [...prev, petImages[index]._id]
            })
        }
    }

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
                    resolve({ src: e.target.result, idx })
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
            {!loading && (
                <>
                    <div>
                        <h1>
                            Editting the pet: {petInfo.name}
                        </h1>
                    </div>
                    <div className={`auto-layout ${petImages.length > 1 && 'auto-column'}`}>
                        {petImages.length != 0 ?
                            (
                                <ConditionalPetImageArray pets={petImages} handleDeleteImage={handleDeleteImage} />
                            )
                            :
                            (
                                <DefaultPetImage />
                            )
                        }
                    </div>
                    <form className="form-default-item" onSubmit={handleSubmit}>
                        <input type="hidden" name="_id" value={_id} />
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
                            <select name="color" value={petInfo.color.toLowerCase()} onChange={handleChange}>
                                <option value="default">Choose an option</option>
                                <option value="black">Black</option>
                                <option value="white">white</option>
                            </select>
                        </label>
                        <button className='btn btn-success btn-fullwidth'>
                            Edit
                        </button>
                    </form>
                </>
            )}
        </main>
    )
}

export default EditPet
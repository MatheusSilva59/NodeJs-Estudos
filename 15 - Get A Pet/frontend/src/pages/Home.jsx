import './Home.css'
import useApiRequest from '../hooks/useApiRequest'
import { useUserContext } from '../hooks/useUserContext'
import { NavLink } from 'react-router-dom'
import { useEffect } from 'react'
import DefaultPetImage from '../components/DefaultPetImage'
import ConditionalPetImage from '../components/ConditionalPetImage'

const Home = () => {
  const url = 'http://localhost:3000/pets/all'

  const { response: data, loading, error, callRequest } = useApiRequest(url, false)
  const { userId } = useUserContext()

  useEffect(() => {
    async function main() {
      callRequest('GET')
    }
    main()

  }, [])

  // console.log(data)
  return (
    <main id='container'>
      <div className='title'>
        <h1>Adopt a Pet</h1>
        <h3>See the details of each one below and meet their tutors</h3>
      </div>
      <div className="content">
        {data && data.map((item) => (
          <div key={item._id} className="pet">
            <ConditionalPetImage source={item?.images?.[0]?.src} classImg='block-img'/>
            <h1>{item.name}</h1>
            <h4>Weight: <span>{item.weight}kg</span></h4>
            {item.adoptions[0]?.status != 'Completed' ?
              (
                <NavLink to={`/pet/${item._id}`} className="btn btn-details btn-fullwidth">See Details</NavLink>
              ) :
              (
                <h4 className='success'>Adopted!</h4>
              )}
          </div>
        ))}
      </div>

    </main>
  )
}

export default Home
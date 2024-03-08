//css
import './App.css'

//dependencies
import { BrowserRouter, Routes, Route } from 'react-router-dom'

//hooks
import { useUserContext } from './hooks/useUserContext'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import Logout from './components/Logout'
import FlashMessage from './components/FlashMessage'


//Pages
import Home from './pages/Home'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import MyPets from './pages/private/MyPets'
import MyAdoptions from './pages/private/MyAdoptions'
import MyProfile from './pages/private/MyProfile'
import AddPet from './pages/private/AddPet'
import Pet from './pages/Pet'
import EditPet from './pages/private/EditPet'
import NotFound from './pages/NotFound'

import useApiRequest from './hooks/useApiRequest'
import { useEffect } from 'react'

function App() {

  const { authenticated, userId, flashMessage } = useUserContext()
  // const { authenticated } = useUserContext()

  // console.log(flashMessage)
  // console.log('APP RENDER')
  // console.count()

  return (
    <div className='divMain'>
      <BrowserRouter>
        <Navbar />
        <FlashMessage flashMessage={flashMessage} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/pet/:_id' element={<Pet />} />
          <Route element={<PrivateRoute />}>
            <Route path='/pet/mypets' element={<MyPets />} />
            <Route path='/pet/add' element={<AddPet />} />
            <Route path='/pet/edit/:_id' element={<EditPet />} />
            <Route path='/pet/myadoptions' element={<MyAdoptions />} />
            <Route path='/user/profile' element={<MyProfile />} />
            <Route path='/logout' element={<Logout />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App

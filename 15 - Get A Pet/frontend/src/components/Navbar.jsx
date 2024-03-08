import { useEffect, useRef, useState } from 'react'
import { useUserContext } from '../hooks/useUserContext'
import './Navbar.css'
import { Link, NavLink } from 'react-router-dom'

const Navbar = () => {
    const { authenticated } = useUserContext()
    const [showMenu, setShowMenu] = useState()
    const [dynamicHeight, setDynamicHeight] = useState(0)
    const [enableMenuH, setEnableMenuH] = useState(false)
    const minWidthToEnableHMenu = 650
    const hMenu = useRef()

    useEffect(() => {

        const handleResize = (e) => {
            if (e.target.innerWidth < minWidthToEnableHMenu) {
                setEnableMenuH(true)
                setDynamicHeight(hMenu.current?.childNodes.length * 24 + 24)
            }
            else {
                setEnableMenuH(false)
            }
        }

        if (document.documentElement.clientWidth < minWidthToEnableHMenu) {
            setEnableMenuH(true)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <nav id='navbar'>
            {!enableMenuH ?
                (
                    <>
                        <div id='iconSpace'>
                            <svg id='icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M309.6 158.5L332.7 19.8C334.6 8.4 344.5 0 356.1 0c7.5 0 14.5 3.5 19 9.5L392 32h52.1c12.7 0 24.9 5.1 33.9 14.1L496 64h56c13.3 0 24 10.7 24 24v24c0 44.2-35.8 80-80 80H464 448 426.7l-5.1 30.5-112-64zM416 256.1L416 480c0 17.7-14.3 32-32 32H352c-17.7 0-32-14.3-32-32V364.8c-24 12.3-51.2 19.2-80 19.2s-56-6.9-80-19.2V480c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V249.8c-28.8-10.9-51.4-35.3-59.2-66.5L1 167.8c-4.3-17.1 6.1-34.5 23.3-38.8s34.5 6.1 38.8 23.3l3.9 15.5C70.5 182 83.3 192 98 192h30 16H303.8L416 256.1zM464 80a16 16 0 1 0 -32 0 16 16 0 1 0 32 0z" /></svg>
                            <NavLink className='icon-message' to='/'>Get A Pet</NavLink>
                        </div>
                        <div>
                            <NavLink to='/'>Adopt</NavLink>
                            {authenticated ? (
                                <>
                                    <NavLink to='/pet/mypets'>My Pets</NavLink>
                                    <NavLink to='/pet/myadoptions'>My Adoption</NavLink>
                                    <NavLink to='/user/profile'>My Profile</NavLink>
                                    <NavLink to='/logout'>Logout</NavLink>
                                </>
                            ) : (
                                <>
                                    <NavLink to='/login'>Login</NavLink>
                                    <NavLink to='/register'>Register</NavLink>
                                </>
                            )}
                        </div>
                    </>
                ) :
                (
                    <div className='nav-h'>
                        <div className='btn-h'>
                            <button onClick={() => setShowMenu(prev => !prev)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                    <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
                                </svg>
                            </button>
                        </div>

                        <ul className='nav-h-menu' style={{ height: `${showMenu ? `${hMenu.current?.childNodes.length * 24}px` : `0px`}` }} ref={hMenu}>
                            <li>
                                <NavLink to='/'>Adopt</NavLink>
                            </li>
                            {authenticated ? (
                                <>
                                    <li>
                                        <NavLink to='/pet/mypets'>My Pets</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/pet/myadoptions'>My Adoption</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/user/profile'>My Profile</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/logout'>Logout</NavLink>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <NavLink to='/login'>Login</NavLink>
                                    </li>
                                    <li>
                                        <NavLink to='/register'>Register</NavLink>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                )}
        </nav>
    )
}

export default Navbar
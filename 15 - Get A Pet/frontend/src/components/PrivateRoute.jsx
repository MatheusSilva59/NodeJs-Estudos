import React, { useEffect, useState } from 'react'
import { useUserContext } from '../hooks/useUserContext'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = () => {
    const { authenticated } = useUserContext()

    if (authenticated) {
        return (
            <Outlet />
        )
    }
    else if (authenticated != null) {
        return (
            <Navigate to='/' replace />
        )
    }
}

export default PrivateRoute
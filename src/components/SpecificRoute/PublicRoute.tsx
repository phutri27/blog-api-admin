import type { ElementType } from "react"
import { Navigate } from "react-router"

type Private = {
    component: ElementType
}

const PublicRoute = ({component: Component} : Private) => {
    const isLoggedIn = localStorage.getItem("token")
    return (
        isLoggedIn ? <Navigate to="/home" replace /> : <Component />
    )
}

export default PublicRoute
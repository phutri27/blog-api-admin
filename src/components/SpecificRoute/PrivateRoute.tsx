import type { ElementType } from "react"
import { Navigate } from "react-router"
type Private = {
    component: ElementType
}

const PrivateRoute = ({component: Component} : Private) => {
    const isLoggedIn = localStorage.getItem("token")
    return (
        isLoggedIn ? <Component /> : <Navigate to="/" replace />
    )
}

export default PrivateRoute
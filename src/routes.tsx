import ErrorPage  from "./components/Error/ServerError"
import Home from './components/Home'
import SpecificPost from "./components/SpecificPost"
import { Loader as postsLoader, ProtectLoader as protectLoader} from "./components/Home"
import { HomeError } from "./components/Error/HomeError"
import PrivateRoute from "./components/SpecificRoute/PrivateRoute"
import PublicRoute from "./components/SpecificRoute/PublicRoute"
import Profile from "./components/Profile"
import App from './App'
const routes = [
    {
        path: "/",
        element: <PublicRoute component={App} />,
    },
    {
        path: "/errorpage",
        element: <ErrorPage />
    },
    {
        path: "home",
        element: <PrivateRoute component={Home}/>,
        loader: protectLoader,
        errorElement: <HomeError />
    },
    {
        path: "post/:id",
        element: <SpecificPost />,
        loader: postsLoader,
        errorElement: <HomeError />
    },
    {
        path: "profile",
        element: <PrivateRoute component={Profile} />
    }
]

export default routes
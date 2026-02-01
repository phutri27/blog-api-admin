import ErrorPage  from "./components/Error/ServerError"
import Home from './components/Home'
import SpecificPost from "./components/SpecificPost"
import { Loader as postsLoader, ProtectLoader as protectLoader} from "./components/Home"
import { HomeError } from "./components/Error/HomeError"
import PrivateRoute from "./components/SpecificRoute/PrivateRoute"
import PublicRoute from "./components/SpecificRoute/PublicRoute"
import Profile, {ProfileComments, ProfilePosts} from "./components/Profile"
import PusblishPost from "./components/PublishPost"
import App from './App'
import { Outlet } from "react-router"
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
        element: <PrivateRoute component={Outlet} />,
        children: [
            {index: true, element: <Profile />},
            {path: "comments", element: <ProfileComments />},
            {path: "posts", element: <ProfilePosts />}
        ]
    },
    {
        path: "new_post",
        element: <PrivateRoute component={PusblishPost} />
    }
]

export default routes
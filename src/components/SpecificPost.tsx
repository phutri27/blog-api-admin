import Posts from "./Posts";
import Comments from "./Comments";
import { useLoaderData, useParams } from "react-router";
import type { PostProperty } from "./Home";
import Header from "./Header";
import { NavBar, Dashboard } from "./Background/Background";

export default function SpecificPost(){
    const { id } = useParams()
    const { posts } = useLoaderData()
    const token = localStorage.getItem("token") || null
    const post = posts.find((p:PostProperty) => p.id === Number(id))
    
    return (
        <>
            {token ? <Header /> : <NavBar/>}
            <Dashboard>
                <Posts post={post} type="specific" />
                <Comments id={Number(id)}/>
            </Dashboard>
        </>
    )
}
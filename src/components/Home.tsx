import Posts from "./Posts"
import { useLoaderData, redirect } from "react-router";
import Header from "./Header";
import { Dashboard } from "./Background/Background";
import fetchApi from "../utils/fetchApi";

const API_URL = import.meta.env.VITE_API_URL

export type PostProperty = {
    id: number,
    title: string,
    text: string,
    date: string | Date,
    published: boolean,
    users: {email: string}
}


export async function Loader(){
  try {
    const response = await fetch(`${API_URL}`)
    if (!response.ok){
      throw new Error("Server Error")
    }
    const posts = await response.json()
    return { posts }
  } catch (error) {
    if (error instanceof Error){
      console.log(error.message)
    }
  }

}

export async function ProtectLoader(){
    const token = localStorage.getItem("token")

    if (!token){
        return redirect("/")
    }
    const posts = await fetchApi("home")
    return { posts }
}

export default function Home(){
    const { posts } = useLoaderData() 
    
    return (
        <>
            <Header  />
            <Dashboard>
                {posts.map((post: PostProperty) =>
                    <Posts type="home" key={post.id} post={post} />
                )}
            </Dashboard>
        </>
    )
}
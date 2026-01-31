import { useState, useEffect } from "react";
import fetchApi from "../utils/fetchApi";
import Header from "./Header";
import { Dashboard } from "./Background/Background";
import { format } from "date-fns";
import { Link } from "react-router";

type ProfileComments = {
    id: number,
    text: string,
    date: Date | string,
    postId: number,
    user: {email: string},
    posts: {title: string, users: {email: string}}
}

type CommentType = {
    comment: ProfileComments
}

function ProfileComment({comment}: CommentType) {
    const date = format(comment.date, "dd MMM yyyy")
    return (
        <div className="bg-gray-200 w-full md:w-3/4 p-5">
            <div className="font-bold">{date}</div>
            <div className="flex items-center-safe flex-col">
                <div>
                    <p><span className="font-medium">{comment.user.email}</span> has commented on <span className="font-medium">{comment.posts.users.email}</span>'s post</p>
                    <p className="font-bold hover:underline"><Link to={`/post/${comment.postId}`}>{comment.posts.title}</Link></p>
                </div>
            </div>
        </div>
    )
}

export default function Profile(){
    const [comments, setComments] = useState<ProfileComments[]>([])
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        const controller = new AbortController()
        const load = async () => {
            try{
                const result = await fetchApi(`profile`, controller.signal)
                setComments(result)
                setError('')
            } catch(error) {
                if (error instanceof DOMException && error.name === 'AbortError'){
                    console.log("Aborted")
                    return
                }
                if (error instanceof Response){
                    setError("Unauthorized")
                }
            }
        }
        load()
        return () => controller.abort()
    }, [])

    return (
        <>
            <Header />
            <Dashboard>
                {error ? (<div>{error}</div>)  :  (comments.length == 0 ? 
                <p className="text-3xl font-medium">There are no activity in this profile</p> 
                : (comments.map((comment) =>
                    <ProfileComment key={comment.id} comment={comment} />
                )))}
            </Dashboard>
        </>
    )
}
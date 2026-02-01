import React, { useState, useEffect } from "react";
import fetchApi from "../utils/fetchApi";
import Header from "./Header";
import { Dashboard } from "./Background/Background";
import { format } from "date-fns";
import { Form, Link } from "react-router";
import { Pencil, Delete } from "lucide-react";
import { ErrDisplay } from "./Error/ErrorDisplay";
import type { SetStateAction } from "react";
const API_URL = import.meta.env.VITE_API_URL

type ProfileComments = {
    id: number,
    text: string,
    date: Date | string,
    postId: number,
    user: {email: string},
    posts: {title: string, users: {email: string}}
}

type ProfilePosts = {
    id: number,
    title: string,
    text: string,
    date: Date | string,
    published: boolean,
    users: {email: string}
}

type SinglePost = {
    post: ProfilePosts,
    setPosts: React.Dispatch<SetStateAction<ProfilePosts[]>>,
    setIsEdit: React.Dispatch<SetStateAction<number | null>>,
    setForm: React.Dispatch<SetStateAction<FormType>>,
}

type FormType = {
    title: string,
    content: string,
    published: boolean,
}

type SingleForm ={
    post: ProfilePosts,
    form: FormType,
    setPosts: React.Dispatch<SetStateAction<ProfilePosts[]>>,
    setIsEdit: React.Dispatch<SetStateAction<number | null>>,
    setForm: React.Dispatch<SetStateAction<FormType>>,
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

export function ProfileComments(){
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

function PostEditForm({post, form, setForm,setIsEdit, setPosts} : SingleForm){
    const [error, setError] = useState<string[]>([])

    const cancelEdit = () => {
        setIsEdit(null)
    }

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault()
        const payload = form
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${API_URL}/posts/post/${post.id}`, {
                method: "PUT",
                headers: {"Authorization": `Bearer ${token}`,
                "Content-Type" : "application/json"},
                body: JSON.stringify(payload)
            })
            const result = await response.json()
            if (!response.ok){
                if (result.errors){
                    setError(result.errors)
                    return
                } else {
                    throw new Error("Server Error")
                }
            }

            setPosts((posts) => posts.map((p) => (
                p.id == post.id ? {...p, title: form.title, text: form.content, published: form.published} : p
            )))

            setIsEdit(null)
        } catch (error) {
            if (error instanceof Error){
                setError([error.message])
            }
        }
    }

    return (
        <>
            {error.length > 0 ? (<ErrDisplay errors={error} keyword=" "/>) : (<>
                <div className="font-bold text-4xl">{post.title}'s edit</div>
            <Form className="flex flex-col gap-5 ml- md:gap-5 md:w-3/4" onSubmit={handleSubmit}>
                <ErrDisplay errors={error} keyword="Tilte" />
                <label className="label-edit-style" htmlFor="title">
                    Title 
                    <textarea className="text-edit-style min-h-10"  
                    name="title"    
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm({...form, title: e.target.value})}
                    required
                    ></textarea>
                </label>


                <label className="label-edit-style" htmlFor="content">
                    Content
                    <textarea className="text-edit-style min-h-30"
                    name="content"
                    id="content"
                    value={form.content}
                    onChange={(e) => setForm({...form, content: e.target.value})}
                    required>
                    </textarea>
                </label>
                <label className="flex gap-2 text-xl md:text-2xl font-inter text-slate-800 tracking-wide font-bold" htmlFor="publish">
                    Publish
                    <input
                    type="checkbox" 
                    name="publish"
                    id="publish"
                    checked={form.published}
                    onChange={() => setForm({...form, published: !form.published})}/>
                </label>
                <div className="flex gap-3 justify-end font-semibold">
                    <button className="group login-btn" type="submit"><span className="hover-text">Save</span></button>
                    <button className="group login-btn" type="button" onClick={cancelEdit}><span className="hover-text">Cancel</span></button>
                </div>
            </Form>
            </>)}
        </>
    )
}

function ProfilePost({post, setPosts, setIsEdit, setForm}: SinglePost){
    const [error, setError] = useState<string | null>(null)

    const date = format(post.date, "dd MMM yyyy").split(" ")

    const setEdit = () => {
        setForm(f => ({...f, title: post.title, content: post.text, published: post.published}))
        setIsEdit(post.id)
    }

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${API_URL}/posts/post/${post.id}`, {
                method: "DELETE",
                headers: {"Authorization" : `Bearer ${token}`,
            "Content-Type": "application/json"},
            })
            if (!response.ok){
                const errorBody = await response.text()
                throw new Error(errorBody)
            }
            setPosts((posts) => posts.filter(p => p.id != post.id))

        } catch (error) {
            if (error instanceof Error){
                setError(error.message)
            }
        }
    }

    return(
        <>
            {error}
            <div className="flex gap-5 mx-auto md:gap-5 md:w-3/4">
                <div className="flex flex-1 flex-col min-w-1/5 items-center text-md text-slate-800 font-inter font-bold ">
                    <p className="text-3xl md:text-5xl">{date[0]}</p>
                    <p>{date[1] + " " + date[2]}</p>
                </div>
                <div className="border border-gray-400"></div>
                <div className="flex flex-4 flex-col gap-5">
                <p className="text-2xl md:text-4xl font-inter text-slate-800 tracking-wide font-bold" >
                    {post.published ? (<Link className="hover:underline hover:text-slate-700" to={`/post/${post.id}`}>{(post.title).toUpperCase()}</Link>)
                    : (<span className="text-gray-400">{(post.title).toUpperCase()}</span>)}
                </p>
                    <p className="text-sm md:text-lg text-content-color leading-7">{post.text}</p>
                </div>
                <div className="flex flex-1 justify-end gap-2 shrink-0">
                    <Pencil className="icon-btn" onClick={setEdit} size={15} />
                    <Delete className="icon-btn" onClick={handleDelete} size={15} />
                </div>
            </div>
        </>
    )
}

export function ProfilePosts(){
    const [posts, setPosts] = useState<ProfilePosts[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isEdit, setIsEdit] = useState<number | null>(null)
    const [form, setForm] = useState<FormType>({
        title: '',
        content: '',
        published: false,
    })

    useEffect(() => {
        const controller = new AbortController()
        const load = async () => {
            try{
                const result = await fetchApi(`posts`, controller.signal)
                setPosts(result)
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
                {error ? (<div className="font-bold text-xl">{error}</div>) : (
                    <>
                        {posts.map((post) =>
                            post.id == isEdit ? 
                            (<PostEditForm key={post.id} 
                                form={form} 
                                post={post}
                                setIsEdit={setIsEdit}
                                setPosts={setPosts}
                                setForm={setForm}
                                />) : 
                            (<ProfilePost key={post.id} 
                                post={post} 
                                setPosts={setPosts}
                                setIsEdit={setIsEdit}
                                setForm={setForm}/>)
                        )}
                    </>
                )}
            </Dashboard>
        </>    
    )
}

export default function Profile(){
    return (
        <>
            <Header />
            <Dashboard>
                <Link className="bg-gray-200 flex justify-center items-center md:w-3/4 h-20" to="comments">
                    <div className="text-xl flex items-center font-semibold w-[95%] h-2/3 mx-auto hover:bg-zinc-300">
                        <p className="ml-5">Comments</p>
                    </div>
                </Link>
                <Link className="bg-gray-200 flex justify-center items-center md:w-3/4 h-20" to="posts">
                    <div className="text-xl flex items-center font-semibold w-[95%] h-2/3 mx-auto hover:bg-zinc-300">
                        <p className="ml-5">Posts</p>
                    </div>
                </Link>
            </Dashboard>
        </>
    )
}
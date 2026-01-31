import React, { useState, useEffect } from "react";
import fetchApi from "../utils/fetchApi";
import { Form } from "react-router";
import { format } from "date-fns";
import "../styles/App.css"
import { Delete, Pencil } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL

type idType = {
    id: number
}

type createComment = {
    setComments: React.Dispatch<React.SetStateAction<CommentsObj[]>>,
    id: number
}

type CommentsObj = {
    id: number,
    text: string,
    date: Date | string,
    user: {email: string, id: number}
}

type CommentType = {
    comment: CommentsObj,
    setComments: React.Dispatch<React.SetStateAction<CommentsObj[]>>
}

// Create comment
function CreateComment({setComments, id}: createComment){
    const [content, setContent] = useState<string>('')
    const [error, setError] = useState<string>('')


    const changeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value)
    }

    const submitComment = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${API_URL}/comments/${id}`, {
                method: "POST",
                headers:{"Authorization" : `Bearer ${token}`, "Content-Type": "application/json"} ,
                body: JSON.stringify({content})
            })
    
            const res = await response.json()
            if (response.status >= 400){
                throw new Error(res.errors[0])
            }
            const payload:CommentsObj = res
            setComments((comments) => [...comments, payload])
            setError('')
            setContent('')
        } catch (error) {
            if (error instanceof Error){
                setError(error.message)
            }
        }
    }

    return (
        <>
            {error}
            <Form className="flex gap-3 items-start" onSubmit={submitComment}>
                <textarea className="textarea-style"
                placeholder="Share your thought" 
                name="content" 
                id="content"
                value={content}
                onChange={changeContent}>
                </textarea>
                <button className="login-btn" type="submit">Send</button>
            </Form>
        </>
    )
}

//Children component of Comments
function Comment({setComments, comment}: CommentType) {
    const [content, setContent] = useState<string>('')
    const [isEdit, setEdit] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const user = localStorage.getItem("userId")
    const onComment = Number(user) == comment.user.id
    const date = format(comment.date, "kk:mm dd/M")

    // isEdit state flag
    const handleEdit = () => {
        setContent(comment.text)
        setEdit(true)
    }

    //Delete comment
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token")
            const userId = localStorage.getItem("userId")
            const response = await fetch(`${API_URL}/comments/${comment.id}`, {
                method: "DELETE",
                headers: {"Authorization" : `Bearer ${token}`,
            "Content-Type": "application/json"},
                body: JSON.stringify({userId})
            })
            if (!response.ok){
                const errorBody = await response.text()
                throw new Error(errorBody)
            }
            const result = await response.json()
            setComments((comments) => comments.filter(comment => comment.id !== result.id))

        } catch (error) {
            if (error instanceof Error){
                setError(error.message)
            }
        }
    }

    // update comment
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem("token")
            const userId = localStorage.getItem("userId")
            const response = await fetch(`${API_URL}/comments/${comment.id}`, {
                method: "PUT",
                headers: {"Authorization": `Bearer ${token}`,
                "Content-Type" : "application/json"},
                body: JSON.stringify({content, userId})
            })
            const result = await response.json()
            if (!response.ok){
                throw new Error(result.errors[0])
            }

            setComments((comments) => comments.map((com) => (
                com.id === result.id ? {...com, text: content} : com
            )))
            setEdit(false)
        } catch (error) {
            if (error instanceof Error){
                setError(error.message)
            }
        }
    }

    //edit form to display when isedit is true
    const editForm = 
    <Form className="flex justify-between" onSubmit={handleSubmit}>
        {error}
        <textarea className="textarea-style" 
        name="content"
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}>
        </textarea>
        <div className="flex gap-3 font-bold">
            <button className="icon-btn" type="submit">Save</button>
            <button className="icon-btn" type="button" onClick={() => setEdit(false)}>Cancel</button>
        </div>
    </Form>

    if (isEdit){
        return (
            <div className="comment-div flex-col">
                <div className="font-bold">
                    {comment.user.email}
                </div>
                {editForm}
            </div>
        )
    }

    return (
        <div className="comment-div">
            {error}
            <div className="flex-1 min-w-0">
                <div className="flex flex-col">
                    <p className="font-bold">{comment.user.email}</p>
                    <p className="text-xs text-gray-500">{date}</p>
                </div>
                <div className="break-words">
                    {comment.text}
                </div>
            </div>
            {onComment && 
            <div className="flex gap-2 shrink-0">
                <Pencil className="icon-btn" onClick={handleEdit} size={15} />
                <Delete className="icon-btn" onClick={handleDelete} size={15} />
            </div>}
        </div>
    )
}

// Children component of SpecificPost of Post.tsx
export default function Comments({id}: idType) {
    const [comments, setComments] = useState<CommentsObj[]>([])
    const [error, setError] = useState<string>('')

    useEffect(() => {
        const controller = new AbortController()
        async function load() {
            try{
                const result = await fetchApi(`comments/${id}`, controller.signal)
                setComments(result)
                setError('')
            } catch(error) {
                if (error instanceof DOMException && error.name === 'AbortError'){
                    console.log("Aborted")
                    return
                }
                if (error instanceof Response){
                    setError("Please login to view comments")
                }
            }
        }
        load()
        return () => controller.abort()
    }, [id])

    if (error){
        return (
            <>
                <div className="flex justify-center font-semibold">{error}</div>
                <div className="relative flex justify-center blur-md">
                    Comments
                </div>
                
            </>
        )
    }

    return (
        <>
            <div className="flex flex-col gap-5 md:w-3/4">
                <hr></hr>
                <p className="text-3xl font-bold">Comments</p>
                {comments.map((comment) =>
                    <Comment key={comment.id} setComments={setComments} comment={comment}/>
                )}
                <CreateComment setComments={setComments} id={Number(id)} />
            </div>
        </>
    )
}
import { useRef, useState } from "react";
import Header from "./Header";
import { Dashboard } from "./Background/Background";
import { Editor } from '@tinymce/tinymce-react';
import { ErrDisplay } from "./Error/ErrorDisplay";
const TINY_MCE = import.meta.env.VITE_TINY_MCE
const API_URL = import.meta.env.VITE_API_URL


function PusblishPost(){
    const [title, setTitle] = useState<string>('')
    const [published, setPublished] = useState<boolean>(true)
    const [errors, setErrors] = useState<string[]>([])
    const [message, setMessage] = useState<string>('')
    const editorRef = useRef<any>(null);

    const handleSubmit = async () => {
        setErrors([])
        const payload = {
            title: title,
            content: editorRef.current?.getContent({format: "text"}),
            published: published
        }

        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`${API_URL}/posts`, {
                method: "POST",
                headers: {"Authorization" : `Bearer ${token}`, 
                "Content-Type" : "application/json"},
                body: JSON.stringify(payload)
            })
            const result = await response.json()
            if (response.status >= 400){
                if (result.errors){
                    setErrors(result.errors)
                    return
                } else{
                    throw new Error("Server Error")
                }
            }
            setTitle('')
            editorRef.current?.setContent('')
            setMessage(result.message)
            setTimeout(() => setMessage(''), 5000)
        } catch (error) {
            if (error instanceof Error){
                setErrors([error.message])
            } else {
                setErrors(["An unexpected error occurred"]);
            }
        }

    }; 

    const hasCriticalError = errors.length > 0 && 
        (errors[0] === "Server Error" || errors[0].includes("Unauthorized"));

    return (
        <>
            {message ? (<div className={`
            fixed top-0 left-150 right-150 flex justify-center z-40 rounded-xs
            p-3 font-bold bg-orange-100 animate-[slide-in-down_0.5s_ease-out_forwards]`}>{message}</div>) : null}
            <Header />
            <Dashboard>
                {hasCriticalError ? (<h1 className="font-bold text-2xl">{errors[0]}</h1>) : 
                (<>
                    <ErrDisplay errors={errors} keyword="Title"/>
                    <input 
                    className="w-3/4 bg-zinc-200 px-5 py-2 font-bold text-black"
                    type="text" 
                    name="title"
                    id="title"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    />

                    <ErrDisplay errors={errors} keyword="Blog"/>
                    <Editor
                    apiKey={TINY_MCE}
                    onInit={(_evt, editor) => editorRef.current = editor}
                    init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                    />
                    <label className="flex font-bold gap-2" htmlFor="published">
                    Publish
                    <input type="checkbox" 
                    name="published" 
                    id="published"
                    checked={published}
                    onChange={() => setPublished(!published)}
                    />
                    </label>
                    <button className="group login-btn" onClick={handleSubmit}><span className="hover-text">Publish</span></button>
                </>)}
            </Dashboard>
        </>
    )
}

export default PusblishPost
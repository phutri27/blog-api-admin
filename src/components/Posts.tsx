import type { PostProperty } from "../App"
import { format } from "date-fns";
import { Link } from "react-router"
import "../styles/App.css"
type PostProp = {
    post: PostProperty,
    type: string
}

export default function Posts({post, type}: PostProp){

    const date = format(post.date, "dd MMM yyyy").split(" ")
    const textArr = post.text.split(" ")
    let text = post.text
    if (type !== "specific") {
        text = textArr.length >= 50 ? textArr.slice(0, 51).join(" ") : textArr.join(" ")
    }
    return(
        <div className="flex gap-5 md:gap-5 md:w-3/4 ">
            {type !== "specific" ? (
            <>
                <div className="flex flex-col min-w-1/5 items-center text-md text-slate-800 font-inter font-bold ">
                    <p className="text-3xl md:text-5xl">{date[0]}</p>
                    <p>{date[1] + " " + date[2]}</p>
                </div>
                <div className="border border-gray-400"></div>
            </>
            ) : null}
            <div className="flex flex-col gap-5">
                <p className="text-2xl md:text-4xl font-inter text-slate-800 tracking-wide font-bold" >
                    {type !== "specific" ? (<Link className="hover:underline hover:text-slate-700" to={`/post/${post.id}`}>{(post.title).toUpperCase()}</Link>) : post.title.toUpperCase()}
                    </p>
                <p className="text-xs md:text-base"><span className="text-gray-500 font-bold">By</span> <span className="text-[10px]">{post.users.email}</span></p>
                <p className="text-sm md:text-lg text-content-color  leading-7">{type !== "specific" ? text : (post.text)}</p>
                {type !== "specific" && text != post.text ? (<div className="group flex justify-center font-semibold">
                    <Link to={`/post/${post.id}`}><button className="group-hover:animate-bounce">Click here to continue reading</button></Link>
                </div>) : null}
            </div>
        </div>
    )
}
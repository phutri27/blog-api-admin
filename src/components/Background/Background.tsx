import { Link } from "react-router"
import "../../styles/App.css"
import type { ReactNode } from "react"

 
interface ChildrenNode{
    children: ReactNode
}
// bg-slate-700 rounded-2xl px-3 py-1 cursor-pointer border-2 hover:bg-slate-500

export function NavBar() {
    return (
        <div className="h-1/8 md:h-1/3 flex justify-between w-screen bg-slate-900">
            <Link className="m-5 ml-7 text-white font-bold text-2xl md:text-5xl" to="/home">BLOG NEWS</Link>
            <div className="m-5 text-white flex gap-5 font-bold text-xl md:text-2xl">
                <Link to="/login"><button className="group login-btn bg-slate-400"><span className="hover-text">Login</span></button></Link>
                <Link to="/signup"><button className="group signup-btn bg-slate-400 px-3"><span className="hover-text">Sign Up</span></button></Link>
            </div>
        </div>
    )
}

export function Dashboard({children}: ChildrenNode){
    return (
        <div className="flex flex-col gap-10 md:items-center bg-gray-100 min-h-dvh w-full md:max-w-6xl mx-auto px-4 py-8">
            {children}
        </div>
    )
} 
import { useNavigate } from "react-router"
import { Link } from "react-router"

function Header(){
    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.clear()
        navigate("/")
    }

    return (    
        <div className="h-1/8 md:h-1/3 flex justify-between w-screen bg-slate-900 items-start">
            <Link className="m-5 ml-7 text-white font-bold text-2xl md:text-5xl" to="/home">BLOG NEWS</Link>
            <div className="m-5 text-white flex gap-5 font-bold text-lg md:text-2xl">
                <Link to="/new_post"><button className="group login-btn bg-slate-400"><span className="hover-text">Create Post</span></button></Link>
                <Link to="/profile"><button className="group login-btn bg-slate-400"><span className="hover-text">Profile</span></button></Link>
                <button className="group signup-btn bg-slate-400 whitespace-nowrap" onClick={handleLogout}><span className="hover-text">Log out</span></button>
            </div>
        </div>
    )
}

export default Header
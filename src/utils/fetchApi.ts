const API_URL = import.meta.env.VITE_API_URL

export default async function fetchApi(url: string, signal?: AbortSignal){
    const token = localStorage.getItem("token") || null
    const response = await fetch(`${API_URL}/${url}`,{
        headers: token ? {'Authorization': `Bearer ${token}`} : {},
        signal: signal ? signal : null
    })
    if (!response.ok) {
        throw new Response("Unauthorized", {status: 401})
    }
    const result = await response.json()
    
    return result
}
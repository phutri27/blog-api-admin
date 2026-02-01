type ErrorDisplay = {
    errors: string[],
    keyword: string
}

export function ErrDisplay({errors, keyword}: ErrorDisplay) {
    return (
        <>
            {errors.map((err) => 
                (err.includes(keyword) ? 
            <div className="text-red-500">{err}</div> : null)
            )}
        </>
    )
}
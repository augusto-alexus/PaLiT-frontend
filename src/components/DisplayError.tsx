export function DisplayError({ error }: { error: unknown }) {
    if (!error) return <></>
    return <h2 className='text-3xl text-center text-cs-warning'>
        {
            error instanceof Error
                ? `Error: ${error.message}`
                : "Unknown error occurred"
        }
    </h2>
}

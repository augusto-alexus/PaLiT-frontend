export function DisplayError({ error }: { error: unknown }) {
    if (!error) return <></>
    return (
        <h2 className='text-center text-3xl text-cs-warning'>
            {error instanceof Error ? `Error: ${error.message}` : 'Unknown error occurred'}
        </h2>
    )
}

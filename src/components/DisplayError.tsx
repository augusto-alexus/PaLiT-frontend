export function DisplayError({ error }: { error: unknown }) {
    if (!error) return <></>
    if (error instanceof Error) return <h2>Помилка: ${error.message}</h2>
    return <h2>Виникла невідома помилка</h2>
}

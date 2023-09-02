import { Link } from 'react-router-dom'
import { routes } from './routes.ts'

export function HomePage() {
    return (
        <main className='flex h-full flex-col justify-center gap-4 text-center'>
            <h1 className='mb-8'>Thesis Tracker</h1>
            <Link to={routes.signIn}>Увійти</Link>
            <Link to={routes.signUp}>Зареєструватися</Link>
        </main>
    )
}

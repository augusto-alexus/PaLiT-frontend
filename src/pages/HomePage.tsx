import { Link } from 'react-router-dom'
import { pageRoutes } from './index.tsx'

function HomePage() {
  return (
    <main className='flex h-full flex-col justify-center gap-4 text-center'>
      <h1 className='mb-8'>Thesis Tracker</h1>
      <Link to={pageRoutes.auth.login}>Увійти</Link>
      <Link to={pageRoutes.auth.register}>Зареєструватися</Link>
    </main>
  )
}

export default HomePage

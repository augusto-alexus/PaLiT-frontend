import { Link } from 'react-router-dom'
import { pageRoutes } from './index.tsx'

function HomePage() {
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='mb-8'>Thesis Tracker</h1>
      <Link to={pageRoutes.auth.login}>Увійти</Link>
      <Link to={pageRoutes.auth.register}>Зареєструватися</Link>
    </div>
  )
}

export default HomePage

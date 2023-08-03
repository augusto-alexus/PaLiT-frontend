import './App.css'
import { Route, Routes } from 'react-router-dom'
import { pageRoutes } from './pages'
import HomePage from './pages/HomePage.tsx'
import SignInPage from './pages/auth/SignInPage.tsx'
import SignUpPage from './pages/auth/SignUpPage.tsx'

function App() {
  return (
    <Routes>
      <Route index path='/' element={<HomePage />} />
      <Route path={pageRoutes.auth.login} element={<SignInPage />} />
      <Route path={pageRoutes.auth.register} element={<SignUpPage />} />
    </Routes>
  )
}

export default App

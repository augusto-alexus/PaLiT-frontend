import './App.css'
import { Route, Routes } from 'react-router-dom'
import { pageRoutes } from './pages'
import HomePage from './pages/HomePage.tsx'
import LoginPage from './pages/auth/LoginPage.tsx'
import RegistrationPage from './pages/auth/RegistrationPage.tsx'

function App() {
  return (
    <Routes>
      <Route index path='/' element={<HomePage />} />
      <Route path={pageRoutes.auth.login} element={<LoginPage />} />
      <Route path={pageRoutes.auth.register} element={<RegistrationPage />} />
    </Routes>
  )
}

export default App

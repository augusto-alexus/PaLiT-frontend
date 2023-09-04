import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import '~/App.css'
import {
    routes,
    PlaceholderPage,
    SignUpPage,
    SignInPage,
    HomePage,
} from '~/pages'

function App() {
    return (
        <>
            <Routes>
                <Route index path='/' element={<PlaceholderPage />} />
                <Route path={routes.signIn} element={<SignInPage />} />
                <Route path={routes.signUp} element={<SignUpPage />} />
                <Route path={routes.home} element={<HomePage />} />
            </Routes>
            <ToastContainer theme='dark' />
        </>
    )
}

export default App

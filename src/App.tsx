import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import '~/App.css'
import { routes, HomePage, SignUpPage, SignInPage } from '~/pages'

function App() {
    return (
        <>
            <Routes>
                <Route index path='/' element={<HomePage />} />
                <Route path={routes.signIn} element={<SignInPage />} />
                <Route path={routes.signUp} element={<SignUpPage />} />
            </Routes>
            <ToastContainer theme='dark' />
        </>
    )
}

export default App

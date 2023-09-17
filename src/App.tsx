import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import '~/App.css'
import {
    routes,
    PlaceholderPage,
    SignUpPage,
    SignInPage,
    HomeFiles,
    HomeFilePreview,
} from '~/pages'
import { HomeBase } from '~/pages/home/HomeBase.tsx'

function App() {
    return (
        <>
            <Routes>
                <Route index path='/' element={<PlaceholderPage />} />
                <Route path={routes.signIn} element={<SignInPage />} />
                <Route path={routes.signUp} element={<SignUpPage />} />
                <Route path={routes.home.root} element={<HomeBase />}>
                    <Route path={routes.home.files} element={<HomeFiles />} />
                    <Route
                        path={routes.home.filePreview()}
                        element={<HomeFilePreview />}
                    />
                    <Route
                        index
                        path='*'
                        element={<Navigate to={routes.home.files} />}
                    />
                </Route>
            </Routes>
            <ToastContainer theme='dark' />
        </>
    )
}

export default App

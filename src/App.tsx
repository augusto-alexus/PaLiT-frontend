import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import '~/App.css'
import {
    FilePreview,
    Files,
    LoggedDashboardWrapper,
    PlaceholderLanding,
    routes,
    SignIn,
    SignUp,
    StudentList,
    TeacherList,
} from '~/pages'

function App() {
    return (
        <>
            <Routes>
                <Route index path='/' element={<PlaceholderLanding />} />
                <Route path={routes.signIn} element={<SignIn />} />
                <Route path={routes.signUp} element={<SignUp />} />
                <Route path='*' element={<LoggedDashboardWrapper />}>
                    <Route path={routes.home.files} element={<Files />} />
                    <Route
                        path={routes.home.studentList}
                        element={<StudentList />}
                    />
                    <Route
                        path={routes.home.teacherList}
                        element={<TeacherList />}
                    />
                    <Route
                        path={routes.home.filePreview()}
                        element={<FilePreview />}
                    />
                    <Route
                        index
                        path={routes.home.dashboard}
                        element={<Navigate to={routes.home.files} />}
                    />
                </Route>
            </Routes>
            <ToastContainer theme='dark' />
        </>
    )
}

export default App

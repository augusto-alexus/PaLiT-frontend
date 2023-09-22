import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import '~/App.css'
import FilePreview from '~/pages/FilePreview.tsx'
import Files from '~/pages/Files.tsx'
import LoggedDashboardWrapper from '~/pages/LoggedDashboardWrapper.tsx'
import PlaceholderLanding from '~/pages/PlaceholderLanding.tsx'
import routes from '~/pages/routes.ts'
import SignIn from '~/pages/SignIn.tsx'
import SignUp from '~/pages/SignUp.tsx'
import StudentList from '~/pages/StudentList.tsx'
import TeacherList from '~/pages/TeacherList.tsx'

function App() {
    return (
        <>
            <Routes>
                <Route index path='/' element={<PlaceholderLanding />} />
                <Route path={routes.signIn} element={<SignIn />} />
                <Route path={routes.signUp} element={<SignUp />} />
                <Route
                    path={routes.home.root}
                    element={<LoggedDashboardWrapper />}
                >
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

import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import '~/App.css'
import {
    AuthRedirect,
    FilePreview,
    Invitations,
    LoggedDashboardWrapper,
    MyProject,
    MyStudent,
    MyStudents,
    PlaceholderLanding,
    routes,
    SignIn,
    SignUp,
    StudentFeed,
    StudentList,
    TeacherList,
} from '~/pages'
import { Dashboard } from '~/pages/Dashboard.tsx'
import './i18.ts'

function App() {
    return (
        <>
            <Routes>
                <Route index path='/' element={<PlaceholderLanding />} />
                <Route path={routes.signIn} element={<SignIn />} />
                <Route path={routes.signUp} element={<SignUp />} />
                <Route path='*' element={<LoggedDashboardWrapper />}>
                    <Route
                        index
                        path={routes.authRedirect}
                        element={<AuthRedirect />}
                    />
                    <Route path={routes.dashboard} element={<Dashboard />} />
                    <Route
                        path={routes.studentList}
                        element={<StudentList />}
                    />
                    <Route
                        path={routes.teacherList}
                        element={<TeacherList />}
                    />

                    <Route
                        path={routes.invitations}
                        element={<Invitations />}
                    />
                    <Route path={routes.myStudents} element={<MyStudents />} />
                    <Route path={routes.myStudent()} element={<MyStudent />}>
                        <Route index element={<StudentFeed />} />
                        <Route
                            path={routes.filePreview()}
                            element={<FilePreview />}
                        />
                    </Route>
                    <Route path={routes.myProject} element={<MyProject />}>
                        <Route index element={<StudentFeed />} />
                        <Route
                            path={routes.filePreview()}
                            element={<FilePreview />}
                        />
                    </Route>
                </Route>
            </Routes>
            <ToastContainer theme='dark' />
        </>
    )
}

export default App

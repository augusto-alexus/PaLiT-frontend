import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import '~/App.css'
import {
    AuthPagesWrapper,
    AuthRedirect,
    FilePreview,
    HodStageApproval,
    HodTeams,
    Invitations,
    MyProject,
    MyStudent,
    MyStudents,
    routes,
    SignIn,
    SignUpStudent,
    StudentWorkReview,
    StudentFeed,
    StudentList,
    TeacherList,
    HodUserTable,
    HodRoot,
    HodUser,
    HodUserEdit,
    SignUpRoot,
} from '~/pages'
import './i18.ts'
import { SignUpTeacher } from '~/pages/auth'

function App() {
    return (
        <>
            <Routes>
                <Route path={routes.signIn} element={<SignIn />} />
                <Route path={routes.signUp.root} element={<SignUpRoot />}>
                    <Route path={routes.signUp.student} element={<SignUpStudent />} />
                    <Route path={routes.signUp.teacher} element={<SignUpTeacher />} />
                </Route>
                <Route path='*' element={<AuthPagesWrapper />}>
                    <Route index path='*' element={<AuthRedirect />} />
                    <Route path={routes.hod.root} element={<HodRoot />}>
                        <Route path={routes.hod.stageApproval} element={<HodStageApproval />} />
                        <Route path={routes.hod.teams} element={<HodTeams />} />
                        <Route path={routes.hod.users.root}>
                            <Route index element={<HodUserTable />} />
                            <Route path={routes.hod.users.user()} element={<HodUser />} />
                            <Route path={routes.hod.users.userEdit} element={<HodUserEdit />} />
                        </Route>
                    </Route>
                    <Route path={routes.studentList} element={<StudentList />} />
                    <Route path={routes.teacherList} element={<TeacherList />} />
                    <Route path={routes.invitations} element={<Invitations />} />
                    <Route path={routes.myStudents} element={<MyStudents />} />
                    <Route path={routes.myStudent()} element={<MyStudent />}>
                        <Route index element={<StudentFeed />} />
                        <Route path={routes.filePreview()} element={<FilePreview />} />
                    </Route>
                    <Route path={routes.studentWorkReview()} element={<StudentWorkReview />} />
                    <Route path={routes.myProject} element={<MyProject />}>
                        <Route index element={<StudentFeed />} />
                        <Route path={routes.filePreview()} element={<FilePreview />} />
                    </Route>
                </Route>
            </Routes>
            <ToastContainer theme='dark' />
        </>
    )
}

export default App

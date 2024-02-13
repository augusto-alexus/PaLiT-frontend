import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import '~/App.css'
import {
    AuthPagesWrapper,
    AuthRedirect,
    HodStageApproval,
    HodTeams,
    Invitations,
    MyProject,
    MyStudent,
    TeacherStudents,
    routes,
    SignIn,
    SignUpStudent,
    StudentWorkReview,
    StudentFeed,
    StudentTeachers,
    HodUserTable,
    HodRoot,
    HodUser,
    HodUserEdit,
    SignUpRoot,
    SignUpTeacher,
    TeacherRoot,
    TeacherInviteStudents,
    StudentRoot,
} from '~/pages'
import './i18.ts'

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

                    <Route path={routes.teacher.root} element={<TeacherRoot />}>
                        <Route path={routes.teacher.students} element={<TeacherInviteStudents />} />
                        <Route path={routes.teacher.myStudents} element={<TeacherStudents />} />
                        <Route path={routes.teacher.invitations} element={<Invitations />} />
                    </Route>

                    <Route path={routes.student.root} element={<StudentRoot />}>
                        <Route path={routes.student.teachers} element={<StudentTeachers />} />
                    </Route>

                    <Route path={routes.common.invitations} element={<Invitations />} />
                    <Route path={routes.common.workReview()} element={<StudentWorkReview />} />

                    <Route path={routes.myStudent()} element={<MyStudent />}>
                        <Route index element={<StudentFeed />} />
                    </Route>

                    <Route path={routes.myProject} element={<MyProject />}>
                        <Route index element={<StudentFeed />} />
                    </Route>
                </Route>
            </Routes>
            <ToastContainer theme='dark' />
        </>
    )
}

export default App

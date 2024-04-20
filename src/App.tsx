import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import '~/App.css'
import {
    AuthRoot,
    AuthRedirect,
    Teams,
    Invitations,
    MyStudents,
    routes,
    SignInPage,
    StudentWorkReview,
    Users,
    User,
    UserEdit,
    SignUpRoot,
    InviteStudents,
    NewTeam,
    EditTeam,
    RoleStageApproval,
    SignUpStudentPage,
    SignUpTeacherPage,
    InviteTeachers,
    StudentFeedWrapper,
} from '~/pages'
import './i18.ts'
import { Projects } from '~/pages/teacher.Projects.tsx'

function App() {
    return (
        <>
            <Routes>
                <Route path={routes.signIn} element={<SignInPage />} />
                <Route path={routes.signUp.root} element={<SignUpRoot />}>
                    <Route path={routes.signUp.student} element={<SignUpStudentPage />} />
                    <Route path={routes.signUp.teacher} element={<SignUpTeacherPage />} />
                </Route>
                <Route path='*' element={<AuthRoot />}>
                    <Route index path='*' element={<AuthRedirect />} />

                    <Route path={routes.roleStageApproval} element={<RoleStageApproval />} />
                    <Route path={routes.teams} element={<Teams />} />
                    <Route path={routes.newTeam} element={<NewTeam />} />
                    <Route path={routes.editTeam()} element={<EditTeam />} />
                    <Route path={routes.users} element={<Users />} />
                    <Route path={routes.user()} element={<User />} />
                    <Route path={routes.userEdit} element={<UserEdit />} />

                    <Route path={routes.myStudents} element={<MyStudents />} />
                    <Route path={routes.projects} element={<Projects />} />

                    <Route path={routes.inviteTeachers} element={<InviteTeachers />} />
                    <Route path={routes.inviteStudents} element={<InviteStudents />} />
                    <Route path={routes.invitations} element={<Invitations />} />

                    <Route path={routes.studentFeed()} element={<StudentFeedWrapper />} />
                    <Route path={routes.workReview()} element={<StudentWorkReview />} />
                </Route>
            </Routes>
            <ToastContainer theme='dark' />
        </>
    )
}

export default App

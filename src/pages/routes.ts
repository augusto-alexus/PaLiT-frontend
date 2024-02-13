export const routes = {
    signIn: 'sign-in',
    signUp: {
        root: 'sign-up',
        student: 'student',
        teacher: 'teacher',
    },
    authRedirect: 'auth-redirect',
    aAuthRedirect: '/auth-redirect',
    teacher: {
        root: 'teacher',
        students: 'students',
        aStudents: '/teacher/students',
        myStudents: 'my-students',
        aMyStudents: '/teacher/my-students',
        invitations: 'invitations',
        aInvitations: '/teacher/invitations',
    },
    common: {
        invitations: 'invitations',
        aInvitations: '/invitations',
        workReview: (studentId?: string, documentId?: string) =>
            buildUrlWithSearchParams('work-review', { studentId: studentId ?? '', documentId: documentId ?? '' }),
        aWorkReview: (studentId?: string, documentId?: string) =>
            buildUrlWithSearchParams('/work-review', { studentId: studentId ?? '', documentId: documentId ?? '' }),
    },
    student: {
        root: 'student',
        teachers: 'teachers',
        aTeachers: '/student/teachers',
    },
    dashboard: 'dashboard',
    files: 'files',
    filePreview: (documentId?: number) => `file-preview/${documentId ? documentId : ':documentId'}`,
    myProject: 'my-project',
    myStudent: (studentId?: number) => `my-student/${studentId ? studentId : ':studentId'}`,
    hod: Object.freeze({
        root: 'hod',
        stageApproval: 'stage-approval',
        aStageApproval: '/hod/stage-approval',
        teams: 'teams',
        aTeams: '/hod/teams',
        users: Object.freeze({
            root: 'users',
            aRoot: '/hod/users',
            user: (userId?: string) => `${userId ? userId : ':userId'}`,
            aUser: (userId?: string) => `/hod/users/${userId ? userId : ':userId'}`,
            userEdit: 'edit',
            aUserEdit: '/hod/users/edit',
        }),
    }),
}

function buildUrlWithSearchParams(baseUrl: string, searchParamsData: Record<string, string>): string {
    const searchParams = new URLSearchParams(searchParamsData)
    if (searchParams.size > 0) return baseUrl + '?' + searchParams.toString()
    return baseUrl
}

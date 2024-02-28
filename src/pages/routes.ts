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
        myStudent: (studentId?: string) => buildUrlWithSearchParams('my-student', { studentId }),
        aMyStudent: (studentId?: string) => buildUrlWithSearchParams('/teacher/my-student', { studentId }),
    },
    common: {
        invitations: 'invitations',
        aInvitations: '/invitations',
        workReview: (studentId?: string, documentId?: string) =>
            buildUrlWithSearchParams('work-review', { studentId, documentId }),
        aWorkReview: (studentId?: string, documentId?: string) =>
            buildUrlWithSearchParams('/work-review', { studentId, documentId }),
        studentFeed: (studentId?: string) => buildUrlWithSearchParams('student-feed', { studentId }),
        aStudentFeed: (studentId?: string) => buildUrlWithSearchParams('/student-feed', { studentId }),
    },
    student: {
        root: 'student',
        teachers: 'teachers',
        aTeachers: '/student/teachers',
        myProject: 'my-project',
        aMyProject: '/student/my-project',
    },
    ps: Object.freeze({
        root: 'ps',
        students: 'students',
        aStudents: '/ps/students',
    }),
    hod: Object.freeze({
        root: 'hod',
        projects: 'works',
        aProjects: '/hod/works',
        stageApproval: 'stage-approval',
        aStageApproval: '/hod/stage-approval',
        teams: 'teams',
        aTeams: '/hod/teams',
        newTeam: 'teams/new',
        aNewTeam: '/hod/teams/new',
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

function buildUrlWithSearchParams(baseUrl: string, searchParamsData: Record<string, string | undefined>): string {
    const searchParams: string[] = Object.entries(searchParamsData).reduce((res, e) => {
        if (e[1]) res.push(e[0] + '=' + e[1])
        return res
    }, [] as string[])
    if (searchParams.length > 0) {
        return baseUrl + '?' + searchParams.join('&')
    }
    return baseUrl
}

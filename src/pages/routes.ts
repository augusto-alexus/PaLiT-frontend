export const routes = {
    signIn: 'sign-in',
    aSignIn: '/sign-in',
    signUp: {
        root: 'sign-up',
        student: 'student',
        teacher: 'teacher',
    },
    authRedirect: 'auth-redirect',
    aAuthRedirect: '/auth-redirect',

    roleStageApproval: 'stage-approval',
    aRoleStageApproval: '/stage-approval',
    teams: 'teams',
    aTeams: '/teams',
    newTeam: 'teams/new',
    aNewTeam: '/teams/new',
    editTeam: (teamId?: string) => `teams/${teamId ? teamId : ':teamId'}`,
    aEditTeam: (teamId?: string) => `/teams/${teamId ? teamId : ':teamId'}`,
    users: 'users',
    aUsers: '/users',
    user: (userId?: string) => `users/${userId ? userId : ':userId'}`,
    aUser: (userId?: string) => `/users/${userId ? userId : ':userId'}`,
    userEdit: 'users/edit',
    aUserEdit: '/users/edit',

    inviteTeachers: 'invite-teachers',
    aInviteTeachers: '/invite-teachers',
    inviteStudents: 'students',
    aInviteStudents: '/students',
    invitations: 'invitations',
    aInvitations: '/invitations',

    myStudents: 'my-students',
    aMyStudents: '/my-students',
    projects: 'projects',
    aProjects: '/projects',

    workReview: (studentId?: string, documentId?: string) =>
        buildUrlWithSearchParams('work-review', { studentId, documentId }),
    aWorkReview: (studentId?: string, documentId?: string) =>
        buildUrlWithSearchParams('/work-review', { studentId, documentId }),
    studentFeed: (studentId?: string) => buildUrlWithSearchParams('student-feed', { studentId }),
    aStudentFeed: (studentId?: string) => buildUrlWithSearchParams('/student-feed', { studentId }),
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

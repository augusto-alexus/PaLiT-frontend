export const routes = Object.freeze({
    signIn: 'sign-in',
    signUp: 'sign-up',
    dashboard: 'dashboard',
    files: 'files',
    filePreview: (documentId?: number) => `file-preview/${documentId ? documentId : ':documentId'}`,
    studentList: 'students',
    teacherList: 'teachers',
    myProject: 'my-project',
    myStudents: 'my-students',
    myStudent: (studentId?: number) => `my-student/${studentId ? studentId : ':studentId'}`,
    studentWorkReview: (studentId?: number, documentId?: number) =>
        `student/${studentId ? studentId : ':studentId'}/document/${documentId ? documentId : ':documentId'}`,
    invitations: 'invitations',
    authRedirect: 'auth-redirect',
    hod: Object.freeze({
        stageApproval: 'hod/stage-approval',
        teams: 'hod/teams',
    }),
})

export const routes = Object.freeze({
    signIn: 'sign-in',
    signUp: 'sign-up',
    dashboard: 'dashboard',
    files: 'files',
    filePreview: (documentId?: string) =>
        `file-preview/${documentId ? documentId : ':documentId'}`,
    studentList: 'students',
    teacherList: 'teachers',
    myProject: 'my-project',
    invitations: 'invitations',
    authRedirect: 'auth-redirect',
})

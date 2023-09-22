export const routes = Object.freeze({
    signIn: 'sign-in',
    signUp: 'sign-up',
    home: Object.freeze({
        dashboard: 'dashboard',
        files: 'files',
        filePreview: (documentId?: string) =>
            `file-preview/${documentId ? documentId : ':documentId'}`,
        studentList: 'students',
        teacherList: 'teachers',
    }),
})

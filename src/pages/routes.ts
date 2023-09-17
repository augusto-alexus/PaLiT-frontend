export const routes = Object.freeze({
    signIn: '/sign-in',
    signUp: '/sign-up',
    home: Object.freeze({
        root: '/home',
        files: 'files',
        filePreview: (documentId?: string) =>
            `file-preview/${documentId ? documentId : ':documentId'}`,
    }),
})

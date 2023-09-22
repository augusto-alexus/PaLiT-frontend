function prefixEndpoints(endpoint: string): string {
    return `http://localhost:8080/api/${endpoint}`
}

export default Object.freeze({
    signIn: prefixEndpoints('auth/login'),
    signUpStudent: prefixEndpoints('auth/student/signup'),
    signUpTeacher: prefixEndpoints('auth/teacher/signup'),
    currentUser: prefixEndpoints('user/current'),
    getAllStudents: prefixEndpoints('student/all'),
    getAllTeachers: prefixEndpoints('teacher/all'),
    getAllRequestsTeacher: prefixEndpoints('teacher/request'),
    getStudentDocuments: (studentId: string) =>
        prefixEndpoints(`student/${studentId}/file-info`),
    uploadFile: (studentId: string) =>
        prefixEndpoints(`/file/student/${studentId}`),
})

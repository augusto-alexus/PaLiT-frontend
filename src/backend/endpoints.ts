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
    getAllRequestsStudent: prefixEndpoints('student/request'),
    student2TeacherRequest: (teacherId: number) =>
        prefixEndpoints(`student/request/${teacherId}`),
    teacher2StudentRequest: (studentId: number) =>
        prefixEndpoints(`teacher/request/${studentId}`),
    getStudentDocuments: (studentId: number) =>
        prefixEndpoints(`student/${studentId}/file-info`),
    uploadFile: (studentId: number) =>
        prefixEndpoints(`file/student/${studentId}`),
    rejectRequest: (requestId: number) =>
        prefixEndpoints(`request/${requestId}`),
    approveRequest: (requestId: number) =>
        prefixEndpoints(`request/${requestId}`),
    currentAdvisor: prefixEndpoints('student/current-adviser'),
    currentStudents: prefixEndpoints('teacher/current-student'),
})

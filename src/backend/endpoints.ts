function prefixEndpoints(endpoint: string): string {
    // return `http://18.153.15.248/api/${endpoint}`
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
    rejectRequest: (requestId: number) =>
        prefixEndpoints(`request/${requestId}`),
    approveRequest: (requestId: number) =>
        prefixEndpoints(`request/${requestId}`),
    currentAdvisor: prefixEndpoints('student/current-adviser'),
    currentStudents: prefixEndpoints('teacher/current-student'),
    files: Object.freeze({
        getDocument: (documentId: number) =>
            prefixEndpoints(`file/${documentId}`),
        reviewDocument: (documentId: number) =>
            prefixEndpoints(`file/${documentId}`),
        moveToNextStage: (documentId: number, stageId: number) =>
            prefixEndpoints(`file/${documentId}/move-to-next-stage/${stageId}`),
        getStudentDocuments: (studentId: number) =>
            prefixEndpoints(`student/${studentId}/file-info`),
        uploadFile: (studentId: number) =>
            prefixEndpoints(`file/student/${studentId}`),
    }),
    stages: Object.freeze({
        getAll: prefixEndpoints('stage/all'),
        getTeachersStages: (teacherId: number) =>
            prefixEndpoints(`teacher-stage-approve/teacher/${teacherId}`),
        approveStageForAll: (stageId: number) =>
            prefixEndpoints(`teacher-stage-approve/${stageId}`),
        teacherStageApprove: prefixEndpoints('teacher-stage-approve'),
    }),
    comments: Object.freeze({
        postComment: (
            documentId: number,
            studentId: number,
            teacherId: number,
            stageId: number
        ) =>
            prefixEndpoints(
                `comment/${documentId}/${studentId}/${teacherId}/${stageId}`
            ),
        getComments: (documentId: number) =>
            prefixEndpoints(`comment/${documentId}`),
    }),
    hod: Object.freeze({
        getAllRequests: prefixEndpoints('request/head-department/all'),
        updateRequest: (requestId: number) =>
            prefixEndpoints(`request/${requestId}/head-department`),
    }),
})

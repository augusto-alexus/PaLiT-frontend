import { baseUrl } from '~/backend/base.ts'

export default Object.freeze({
    signIn: 'auth/login',
    signUpStudent: 'auth/student/signup',
    signUpTeacher: 'auth/teacher/signup',
    currentUser: 'user/current',
    getAllStudents: 'student/all',
    getAllTeachers: 'teacher/all',
    getAllRequestsTeacher: 'teacher/request',
    getAllRequestsStudent: 'student/request',
    student2TeacherRequest: (teacherId: number) => `student/request/${teacherId}`,
    teacher2StudentRequest: (studentId: number) => `teacher/request/${studentId}`,
    rejectRequest: (requestId: number) => `request/${requestId}`,
    approveRequest: (requestId: number) => `request/${requestId}`,
    currentAdvisor: 'student/current-adviser',
    currentStudents: 'teacher/current-student',
    theme: Object.freeze({
        getTheme: (studentId: string) => `student/theme/${studentId}`,
        updateTheme: (studentId: string) => `theme/${studentId}`,
    }),
    role: Object.freeze({
        getAll: 'role/all',
    }),
    student: Object.freeze({
        getAllStudentsWithStatus: 'student/hod-info',
    }),
    files: Object.freeze({
        getDocument: (documentId: string) => baseUrl + `/file/${documentId}`,
        reviewDocument: (documentId: string) => `file/${documentId}`,
        moveToNextStage: (documentId: string, stageId: number) => `file/${documentId}/move-to-next-stage/${stageId}`,
        getStudentDocuments: (studentId: string) => `student/${studentId}/file-info`,
        uploadFile: (studentId: number) => baseUrl + `/file/student/${studentId}`,
        uploadCsv: baseUrl + '/email/csv',
    }),
    stages: Object.freeze({
        getAll: 'stage/all',
        getTeachersStages: (teacherId: number) => `teacher-stage-approve/teacher/${teacherId}`,
        approveStageForAllInRole: (stageId: number, roleId: string) => `teacher-stage-approve/${stageId}/${roleId}`,
        teacherStageApprove: 'teacher-stage-approve',
    }),
    comments: Object.freeze({
        postComment: (documentId: string, userId: string) => `comment/${documentId}/${userId}`,
        getComments: (documentId: string) => `comment/${documentId}`,
    }),
    hod: Object.freeze({
        getAllRequests: 'request/head-department/all',
        updateRequest: (requestId: number) => `request/${requestId}/head-department`,
    }),
    user: Object.freeze({
        createStudent: 'user/student',
        updateStudent: (userId: string) => `user/student/${userId}`,
        createTeacher: 'user/teacher',
        updateTeacher: (userId: string) => `user/teacher/${userId}`,
        getAll: 'user/all',
        getById: (id: string) => `user/${id}`,
        deleteById: (id: string) => `user/${id}`,
    }),
})

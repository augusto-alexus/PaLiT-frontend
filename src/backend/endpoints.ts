function prefixEndpoints(endpoint: string): string {
    return `http://localhost:8080/api/${endpoint}`
}

export const endpoints = Object.freeze({
    signIn: prefixEndpoints('auth/login'),
    signUpStudent: prefixEndpoints('auth/student/signup'),
    signUpTeacher: prefixEndpoints('auth/teacher/signup'),
    currentUser: prefixEndpoints('user/current'),
    getAllStudents: prefixEndpoints('student/all'),
    getAllTeachers: prefixEndpoints('teacher/all'),
})

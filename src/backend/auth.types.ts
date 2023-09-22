interface IRoleDTO {
    id: string
    name: string
}

interface IStudentDTO {
    studentId: string
    degree: string
}

export interface ICurrentUserDTO {
    firstName: string
    lastName: string
    email: string
    userId: number
    roleDTO: IRoleDTO
    studentDTO?: IStudentDTO
}

export interface ISignInDTO {
    email: string
    password: string
}

export interface IStudentSignUpDTO extends ITeacherSignUpDTO {
    cluster: string
    faculty: string
    graduateDate: string
    degree: string
}

export interface ITeacherSignUpDTO {
    firstName: string
    lastName: string
    email: string
    password: string
}

import { Language, RequestDirection, Role } from '~/models'
import endpoints from './endpoints'
import axios from './base.ts'
import { handleError, StudentAlreadyHasTeacherError, TeacherInviteLimitError, YourInviteLimitError } from './error.ts'

export function getRequests(role: Role) {
    if (role == 'student') return getRequestsStudent()
    return getRequestsTeacher()
}

async function getRequestsTeacher() {
    return axios
        .get(endpoints.getAllRequestsTeacher)
        .then(({ data }) => (data as IRequestStudent[]).map(parseRequest))
        .catch(handleError())
}

async function getRequestsStudent() {
    return axios
        .get(endpoints.getAllRequestsStudent)
        .then(({ data }) => (data as IRequestTeacher[]).map(parseRequest))
        .catch(handleError())
}

export async function makeRequest(role: Role, { userId, requestBody }: IRequestDTO) {
    const endpoint = role === 'student' ? endpoints.student2TeacherRequest : endpoints.teacher2StudentRequest
    return axios
        .post(endpoint(userId), requestBody)
        .then(({ data }) => data as object)
        .catch(handleError())
}

export async function rejectRequest(requestId: number) {
    return axios
        .delete(endpoints.rejectRequest(requestId))
        .then(({ data }) => data as object)
        .catch(handleError())
}

export async function approveRequest(requestId: number, role: Role) {
    const formData = new FormData()
    formData.append('approved', 'true')
    return axios
        .put(endpoints.approveRequest(requestId), formData)
        .then(({ data }) => data as object)
        .catch(
            handleError(({ status }) => {
                if (status === 409) {
                    throw new StudentAlreadyHasTeacherError()
                } else if (status === 403) {
                    if (role === 'student') throw new TeacherInviteLimitError()
                    else throw new YourInviteLimitError()
                }
            })
        )
}

function parseRequest(data: IRequestStudent | IRequestTeacher): IRequest {
    let user: IRequestUser | undefined = undefined
    if ('studentRequestDTO' in data) {
        user = {
            id: data.studentRequestDTO.studentId,
            firstName: data.studentRequestDTO.firstName,
            lastName: data.studentRequestDTO.lastName,
            degree: data.studentRequestDTO.degree === 'BACHELOR' ? 'bachelor' : 'master',
            faculty: data.studentRequestDTO.faculty,
            cluster: data.studentRequestDTO.cluster,
            graduateDate: data.studentRequestDTO.graduateDate,
        }
    } else if ('teacherRequestDTO' in data) {
        user = {
            id: data.teacherRequestDTO.teacherId,
            firstName: data.teacherRequestDTO.firstName,
            lastName: data.teacherRequestDTO.lastName,
        }
    } else throw new Error("Request data doesn't conform to any known request DTO types.")

    return {
        requestId: data.requestId,
        createdDate: data.createdDate,
        theme: data.theme,
        language: data.language,
        approved: data.approved,
        direction: data.direction,
        user,
    }
}

interface IRequestBase {
    requestId: number
    createdDate: string
    theme: string
    language: Language
    approved: boolean
    direction: RequestDirection
}

interface IRequestStudent extends IRequestBase {
    studentRequestDTO: {
        studentId: number
        degree: 'BACHELOR' | 'MASTER'
        faculty: string
        firstName: string
        lastName: string
        cluster: string
        graduateDate: string
    }
}

interface IRequestTeacher extends IRequestBase {
    teacherRequestDTO: {
        teacherId: number
        firstName: string
        lastName: string
    }
}

interface IRequestUser {
    id: number
    firstName: string
    lastName: string
    degree?: 'bachelor' | 'master'
    faculty?: string
    cluster?: string
    graduateDate?: string
}

export interface IRequest extends IRequestBase {
    user: IRequestUser
}

interface IRequestBody {
    theme: string
    language: Language
}

export interface IRequestDTO {
    userId: number
    requestBody: IRequestBody
}

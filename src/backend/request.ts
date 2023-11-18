import axios from 'axios'
import endpoints from '~/backend/endpoints.ts'
import { Role } from '~/models'

export function getRequests(accessToken: string, role: Role) {
    if (role == 'student') return getRequestsStudent(accessToken)
    return getRequestsTeacher(accessToken)
}

async function getRequestsTeacher(accessToken: string) {
    const response = await axios.get(endpoints.getAllRequestsTeacher, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    return (response.data as IRequestStudent[]).map(parseRequest)
}

async function getRequestsStudent(accessToken: string) {
    const response = await axios.get(endpoints.getAllRequestsStudent, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    return (response.data as IRequestTeacher[]).map(parseRequest)
}

export async function makeStudent2TeacherRequest(request: IRequestDTO) {
    return makeRequest(endpoints.student2TeacherRequest, request)
}

export async function makeTeacher2StudentRequest(request: IRequestDTO) {
    return makeRequest(endpoints.teacher2StudentRequest, request)
}

async function makeRequest(
    endpoint: (id: number) => string,
    { accessToken, userId, requestBody }: IRequestDTO
) {
    const response = await axios.post(endpoint(userId), requestBody, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    return response.data as object
}

export async function rejectRequest({
    accessToken,
    requestId,
}: {
    accessToken: string
    requestId: number
}) {
    const response = await axios.delete(endpoints.rejectRequest(requestId), {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    return response.data as object
}

export async function approveRequest({
    accessToken,
    requestId,
}: {
    accessToken: string
    requestId: number
}) {
    const formData = new FormData()
    formData.append('approved', 'true')
    const response = await axios.put(
        endpoints.approveRequest(requestId),
        formData,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    )
    return response.data as object
}

interface IRequestBase {
    requestId: number
    createdDate: string
    theme: string
    language: 'UA' | 'ENG'
    approved: boolean
    direction: 'STUDENT' | 'TEACHER'
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

function parseRequest(data: IRequestStudent | IRequestTeacher): IRequest {
    let user: IRequestUser | undefined = undefined
    if ('studentRequestDTO' in data) {
        user = {
            id: data.studentRequestDTO.studentId,
            firstName: data.studentRequestDTO.firstName,
            lastName: data.studentRequestDTO.lastName,
            degree:
                data.studentRequestDTO.degree === 'BACHELOR'
                    ? 'bachelor'
                    : 'master',
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
    } else
        throw new Error(
            "Request data doesn't conform to any known request DTO types."
        )

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

interface IRequestBody {
    theme: string
    language: 'UA' | 'ENG'
}

export interface IRequestDTO {
    accessToken: string
    userId: number
    requestBody: IRequestBody
}

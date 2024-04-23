import { IHoDRequest, Language, parseHoDRequestDTO, RequestDirection } from '~/models'
import endpoints from './endpoints'
import axios from './base.ts'
import { handleError, TeacherInviteLimitError } from './error.ts'

export async function getAllRequests(): Promise<IHoDRequest[]> {
    return axios
        .get(endpoints.hod.getAllRequests)
        .then(({ data }) => (data as IHoDRequestDTO[]).map(parseHoDRequestDTO))
        .catch(handleError())
}

export async function createTeam(teacherId: string, studentId: string, theme: string, language: Language) {
    return axios
        .post(endpoints.hod.createTeam(teacherId, studentId), {
            theme,
            language,
            approveDirection: 'TEACHER',
        })
        .catch(handleError())
}

export async function editTeam(teacherId: string, studentId: string) {
    return axios.put(endpoints.hod.editTeam(teacherId, studentId)).catch(
        handleError(({ status }) => {
            if (status === 403) throw new TeacherInviteLimitError()
        })
    )
}

export interface IHoDRequestDTO {
    requestId: number
    teacherId: number
    studentId: number
    theme: string
    language: Language
    approved: boolean
    createdDate: string
    direction: RequestDirection
}

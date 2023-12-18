import axios from 'axios'
import { getAuthConfig } from './base'
import endpoints from './endpoints'

export interface IStageDTO {
    stageId: number
    name: string
    serialOrder: number
}

export async function getAllStages(accessToken: string) {
    const response = await axios.get(
        endpoints.stages.getAll,
        getAuthConfig(accessToken)
    )
    return response.data as IStageDTO[]
}

export async function getTeachersStages(
    accessToken: string,
    teacherId: number
) {
    const response = await axios.get(
        endpoints.stages.getTeachersStages(teacherId),
        getAuthConfig(accessToken)
    )
    return response.data as number[]
}

export async function approveStageForTeacher(
    accessToken: string,
    teacherId: number,
    stageId: number
) {
    await axios.post(
        endpoints.stages.teacherStageApprove,
        { teacherId, stageId },
        getAuthConfig(accessToken)
    )
    return teacherId
}

export async function restrictStageForTeacher(
    accessToken: string,
    teacherId: number,
    stageId: number
) {
    await axios.delete(endpoints.stages.teacherStageApprove, {
        ...getAuthConfig(accessToken),
        data: { teacherId, stageId },
    })
    return teacherId
}

export async function approveStageForAll(accessToken: string, stageId: number) {
    await axios.post(
        endpoints.stages.approveStageForAll(stageId),
        null,
        getAuthConfig(accessToken)
    )
    return null
}

export async function restrictStageForAll(
    accessToken: string,
    stageId: number
) {
    await axios.delete(
        endpoints.stages.approveStageForAll(stageId),
        getAuthConfig(accessToken)
    )
    return null
}

import axios from 'axios'
import endpoints from '~/backend/endpoints.ts'

export interface IStageDTO {
    stageId: number
    name: string
    serialOrder: number
}

export async function getAllStages(accessToken: string) {
    const response = await axios.get(endpoints.stages.getAll, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    return response.data as IStageDTO[]
}

export async function getTeachersStages(
    accessToken: string,
    teacherId: number
) {
    const response = await axios.get(
        endpoints.stages.getTeachersStages(teacherId),
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    )
    return response.data as number[]
}

export async function approveStageForAll(accessToken: string, stageId: number) {
    await axios.post(endpoints.stages.approveStageForAll(stageId), null, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    return null
}

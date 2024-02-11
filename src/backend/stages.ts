import endpoints from './endpoints'
import axios from './base.ts'

export interface IStageDTO {
    stageId: number
    name: string
    serialOrder: number
}

export async function getAllStages() {
    const response = await axios.get(endpoints.stages.getAll)
    return (response.data as IStageDTO[])?.sort((a, b) => a.serialOrder - b.serialOrder)
}

export async function getTeachersStages(teacherId: number) {
    const response = await axios.get(endpoints.stages.getTeachersStages(teacherId))
    return response.data as number[]
}

export async function approveStageForTeacher(teacherId: number, stageId: number) {
    await axios.post(endpoints.stages.teacherStageApprove, { teacherId, stageId })
    return teacherId
}

export async function restrictStageForTeacher(teacherId: number, stageId: number) {
    await axios.delete(endpoints.stages.teacherStageApprove, {
        data: { teacherId, stageId },
    })
    return teacherId
}

export async function approveStageForAllInRole(stageId: number, roleId: string) {
    await axios.post(endpoints.stages.approveStageForAllInRole(stageId, roleId))
    return null
}

export async function restrictStageForAll(stageId: number, roleId: string) {
    await axios.delete(endpoints.stages.approveStageForAllInRole(stageId, roleId))
    return null
}

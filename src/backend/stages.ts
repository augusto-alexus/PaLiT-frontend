import endpoints from './endpoints'
import axios from './base.ts'
import { IRoleDTO } from '~/backend/auth.ts'

export interface IStageDTO {
    stageId: number
    name: string
    serialOrder: number
}

export interface IRoleStageApprovalDTO {
    id: string
    stageDTO: IStageDTO
    roleDTO: IRoleDTO
}

export async function getAllStages() {
    const response = await axios.get(endpoints.stages.getAll)
    return (response.data as IStageDTO[])?.sort((a, b) => a.serialOrder - b.serialOrder)
}

export async function getAllRoleStageApprovals() {
    const response = await axios.get(endpoints.stages.getAllRolesApproval)
    return response.data as IRoleStageApprovalDTO[]
}

export async function createRoleStageApproval(roleId: string, stageId: string) {
    const response = await axios.post(endpoints.stages.createRoleApproval(roleId, stageId))
    return response.data as object
}

export async function deleteRoleStageApproval(roleId: string, stageId: string) {
    const response = await axios.delete(endpoints.stages.deleteRoleApproval(roleId, stageId))
    return response.data as object
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

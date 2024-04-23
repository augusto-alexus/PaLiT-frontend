import endpoints from './endpoints'
import axios from './base.ts'
import { IRoleDTO } from '~/backend/auth.ts'
import { handleError } from '~/backend/error.ts'

export async function getAllStages() {
    return axios
        .get(endpoints.stages.getAll)
        .then(({ data }) => (data as IStageDTO[])?.sort((a, b) => a.serialOrder - b.serialOrder))
        .catch(handleError())
}

export async function getAllRoleStageApprovals() {
    return axios
        .get(endpoints.stages.getAllRolesApproval)
        .then(({ data }) => data as IRoleStageApprovalDTO[])
        .catch(handleError())
}

export async function createRoleStageApproval(roleId: string, stageId: string) {
    return axios
        .post(endpoints.stages.createRoleApproval(roleId, stageId))
        .then(({ data }) => data as object)
        .catch(handleError())
}

export async function deleteRoleStageApproval(roleId: string, stageId: string) {
    return axios
        .delete(endpoints.stages.deleteRoleApproval(roleId, stageId))
        .then(({ data }) => data as object)
        .catch(handleError())
}

export async function getTeachersStages(teacherId: number) {
    return axios
        .get(endpoints.stages.getTeachersStages(teacherId))
        .then(({ data }) => data as number[])
        .catch(handleError())
}

export async function approveStageForTeacher(teacherId: number, stageId: number) {
    return axios
        .post(endpoints.stages.teacherStageApprove, { teacherId, stageId })
        .then(() => teacherId)
        .catch(handleError())
}

export async function restrictStageForTeacher(teacherId: number, stageId: number) {
    return axios
        .delete(endpoints.stages.teacherStageApprove, {
            data: { teacherId, stageId },
        })
        .then(() => teacherId)
        .catch(handleError())
}

export async function approveStageForAllInRole(stageId: number, roleId: string) {
    return axios
        .post(endpoints.stages.approveStageForAllInRole(stageId, roleId))
        .then(() => null)
        .catch(handleError())
}

export async function restrictStageForAll(stageId: number, roleId: string) {
    return axios
        .delete(endpoints.stages.approveStageForAllInRole(stageId, roleId))
        .then(() => null)
        .catch(handleError())
}

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

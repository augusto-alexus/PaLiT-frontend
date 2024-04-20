import { useTranslation } from 'react-i18next'
import { Button, MainContentLoading } from '~/components'
import {
    useAllRoles,
    useAllRoleStageApprovals,
    useAllStages,
    useCreateRoleStageApproval,
    useCurrentUser,
    useDeleteRoleStageApproval,
} from '~/hooks'
import { IRoleDTO, IRoleStageApprovalDTO } from '~/backend'
import { Navigate } from 'react-router-dom'
import { routes } from '~/pages/index.ts'

export function RoleStageApproval() {
    const { role } = useCurrentUser()
    const { t } = useTranslation()
    const { data: roles, isInitialLoading: rolesLoading } = useAllRoles()
    const { data: roleStageApprovals, isInitialLoading: roleStageApprovalsLoading } = useAllRoleStageApprovals()

    if (role !== 'HoD') return <Navigate to={routes.aAuthRedirect} />
    if (rolesLoading || roleStageApprovalsLoading) return <MainContentLoading />

    const teacherRoles = roles?.filter((r) => r.name === 'HoD' || r.name === 'PS' || r.name === 'teacher')

    return (
        <div className='flex w-full flex-col gap-12'>
            {!teacherRoles?.length && (
                <h2 className='text-center text-2xl font-semibold'>{t('dashboard.noTeachers')}</h2>
            )}
            {!!teacherRoles?.length && (
                <div className='flex flex-col flex-nowrap gap-16'>
                    <RoleStageTable roles={teacherRoles} roleStageApprovals={roleStageApprovals} />
                </div>
            )}
        </div>
    )
}

function RoleStageTable({
    roles,
    roleStageApprovals,
}: {
    roles: IRoleDTO[]
    roleStageApprovals?: IRoleStageApprovalDTO[]
}) {
    return (
        <table className='mx-auto w-full table-fixed border-separate md:w-4/5 lg:w-3/4 xl:w-2/3'>
            <TableHeader />
            <tbody>
                {roles?.map((r, idx) => (
                    <RoleStageRow key={`${r.id} | ${idx}`} role={r} roleStageApprovals={roleStageApprovals} />
                ))}
            </tbody>
        </table>
    )
}

function TableHeader() {
    const { t } = useTranslation()
    const { data: allStages } = useAllStages()
    return (
        <thead className='font-bold italic'>
            <tr>
                <td>{t('role')}</td>
                {allStages?.map((s) => (
                    <td key={s.stageId} className='text-center font-bold'>
                        {t(`stages.${s.name}`)}
                    </td>
                ))}
            </tr>
        </thead>
    )
}

function RoleStageRow({ role, roleStageApprovals }: { role: IRoleDTO; roleStageApprovals?: IRoleStageApprovalDTO[] }) {
    const { t } = useTranslation()
    const { data: allStages } = useAllStages()
    const { mutate: createRoleStageApproval } = useCreateRoleStageApproval()
    const { mutate: deleteRoleStageApproval } = useDeleteRoleStageApproval()

    return (
        <tr>
            <td>{t(`roles.${role.name}`)}</td>
            {allStages?.map((s) => {
                const isApproved = !!roleStageApprovals?.find(
                    (v) => v.stageDTO.stageId === s.stageId && v.roleDTO.id === role.id
                )
                return (
                    <td key={s.stageId} className={`group w-32 ${isApproved ? 'bg-green-300' : 'bg-red-500'}`}>
                        {isApproved ? (
                            <Button
                                preset='text'
                                className='invisible mx-auto w-full text-sm text-cs-text-dark hover:text-cs-text-dark group-hover:visible'
                                onClick={() =>
                                    deleteRoleStageApproval({
                                        roleId: role.id,
                                        stageId: s.stageId.toString(),
                                    })
                                }
                            >
                                {t('dashboard.restrictForTeacher')}
                            </Button>
                        ) : (
                            <Button
                                preset='text'
                                className='invisible mx-auto w-full text-sm text-cs-text-light hover:text-cs-text-light group-hover:visible'
                                onClick={() =>
                                    createRoleStageApproval({
                                        roleId: role.id,
                                        stageId: s.stageId.toString(),
                                    })
                                }
                            >
                                {t('dashboard.allowForTeacher')}
                            </Button>
                        )}
                    </td>
                )
            })}
        </tr>
    )
}

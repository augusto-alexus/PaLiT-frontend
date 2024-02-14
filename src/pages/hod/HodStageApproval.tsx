import { useTranslation } from 'react-i18next'
import { Button } from '~/components'
import {
    useAllRoles,
    useAllStages,
    useAllTeachers,
    useApproveStageForAll,
    useApproveStageForTeacher,
    useGetTeacherStages,
    useRestrictStageForAll,
    useRestrictStageForTeacher,
} from '~/hooks'
import { ITeacher } from '~/models'
import { IRoleDTO } from '~/backend'

export function HodStageApproval() {
    const { t } = useTranslation()
    const { data: teachers } = useAllTeachers()
    const { data: roles } = useAllRoles()

    const teacherRole = roles?.find((r) => r.name === 'teacher')
    const hodRole = roles?.find((r) => r.name === 'HoD')
    const psRole = roles?.find((r) => r.name === 'PS')

    return (
        <div className='flex w-full flex-col gap-12'>
            {teachers?.length ? (
                <h2 className='text-center text-2xl font-semibold'>{t('dashboard.stage2TeacherMapping')}</h2>
            ) : (
                <h2 className='text-center text-2xl font-semibold'>{t('dashboard.noTeachers')}</h2>
            )}
            {teachers?.length && (
                <div className='flex flex-col flex-nowrap gap-16'>
                    {teacherRole && (
                        <TeacherStageTable roleDTO={teacherRole} allTeachers={teachers} showStages={true} />
                    )}
                    {hodRole && <TeacherStageTable roleDTO={hodRole} allTeachers={teachers} showStages={false} />}
                    {psRole && <TeacherStageTable roleDTO={psRole} allTeachers={teachers} showStages={false} />}
                </div>
            )}
        </div>
    )
}

function TableHeader({
    roleDTO,
    showStages,
    showTooltip,
}: {
    roleDTO: IRoleDTO
    showStages: boolean
    showTooltip: boolean
}) {
    const { t } = useTranslation()
    const { data: allStages } = useAllStages()
    const { mutate: approveStageForAll } = useApproveStageForAll()
    const { mutate: restrictStageForAll } = useRestrictStageForAll()
    return (
        <thead>
            <tr>
                <td className='font-bold'>{showTooltip ? '' : t(`roles.${roleDTO.name}`)}</td>
                {allStages?.map((s) => (
                    <td key={s.stageId} className='text-center font-bold'>
                        {showStages && `№ ${s.serialOrder}: ${s.name}`}
                    </td>
                ))}
            </tr>
            {showTooltip && (
                <tr>
                    <td className='font-bold'>{t(`roles.${roleDTO.name}`)}</td>
                    {allStages?.map((s) => (
                        <td key={s.stageId}>
                            <Button
                                preset='text'
                                className='w-full text-sm'
                                onClick={() =>
                                    approveStageForAll({
                                        stageId: s.stageId,
                                        roleId: roleDTO.id,
                                    })
                                }
                            >
                                {t('dashboard.allowForAllTeachers')}
                            </Button>
                            <Button
                                preset='text'
                                className='w-full text-sm text-cs-warning'
                                onClick={() =>
                                    restrictStageForAll({
                                        stageId: s.stageId,
                                        roleId: roleDTO.id,
                                    })
                                }
                            >
                                {t('dashboard.restrictForAllTeachers')}
                            </Button>
                        </td>
                    ))}
                </tr>
            )}
        </thead>
    )
}

function TeacherStageTable({
    roleDTO,
    allTeachers,
    showStages,
}: {
    roleDTO: IRoleDTO
    allTeachers: ITeacher[]
    showStages: boolean
}) {
    const { t } = useTranslation()
    const teachersWithRole = allTeachers.filter((t) => t.roleDTO.id === roleDTO.id)
    if (teachersWithRole.length === 0)
        return (
            <h2 className='text-2xl text-cs-text-dark'>
                {t('dashboard.noUsersWithRole', { roleName: t(`roles.${roleDTO.name}`) })}
            </h2>
        )

    return (
        <table className='mx-auto w-full table-fixed border-separate md:w-4/5 lg:w-3/4 xl:w-2/3'>
            <TableHeader roleDTO={roleDTO} showStages={showStages} showTooltip={teachersWithRole.length > 1} />
            <tbody>
                {teachersWithRole?.map((t, idx) => (
                    <TeacherStages key={`${t.teacherId} | ${idx}`} teacher={t} />
                ))}
            </tbody>
        </table>
    )
}

function TeacherStages({ teacher }: { teacher: ITeacher }) {
    const { t } = useTranslation()
    const { data } = useGetTeacherStages(teacher.teacherId)
    const { data: allStages } = useAllStages()
    const { mutate: approveStageForTeacher } = useApproveStageForTeacher()
    const { mutate: restrictStageForTeacher } = useRestrictStageForTeacher()
    return (
        <tr>
            <td>
                {teacher.lastName} {teacher.firstName}
            </td>
            {allStages?.map((s) => {
                const isApproved = !!data?.find((v) => v === s.stageId)
                return (
                    <td key={s.stageId} className={`group w-32 ${isApproved ? 'bg-green-300' : 'bg-red-500'}`}>
                        {isApproved ? (
                            <Button
                                preset='text'
                                className='invisible mx-auto w-full text-sm text-cs-text-dark hover:text-cs-text-dark group-hover:visible'
                                onClick={() =>
                                    restrictStageForTeacher({
                                        teacherId: teacher.teacherId,
                                        stageId: s.stageId,
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
                                    approveStageForTeacher({
                                        teacherId: teacher.teacherId,
                                        stageId: s.stageId,
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

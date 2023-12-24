import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'
import { Button } from '~/components'
import {
    useAllStages,
    useAllTeachers,
    useApproveStageForAll,
    useApproveStageForTeacher,
    useCurrentUser,
    useGetTeacherStages,
    useRestrictStageForAll,
    useRestrictStageForTeacher,
} from '~/hooks'
import { ITeacher } from '~/models'
import { routes } from '~/pages'

export function HodStageApproval() {
    const { role } = useCurrentUser()
    const { t } = useTranslation()
    const { data: allStages } = useAllStages()
    const { data: teachers } = useAllTeachers()
    const { mutate: approveStageForAll } = useApproveStageForAll()
    const { mutate: restrictStageForAll } = useRestrictStageForAll()

    if (role !== 'HoD') return <Navigate to={`/${routes.authRedirect}`} />

    return (
        <div className='mx-auto flex w-10/12 gap-24'>
            <div className='flex w-full flex-col gap-12'>
                <h2 className='text-center text-2xl font-semibold'>
                    {t('dashboard.stage2TeacherMapping')}
                </h2>
                <table className='mx-auto table-fixed border-separate xl:w-2/3'>
                    <thead>
                        <tr>
                            <td></td>
                            {allStages?.map((s) => (
                                <td
                                    key={s.stageId}
                                    className='text-center font-bold'
                                >
                                    № {s.serialOrder}: {s.name}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className='text-center font-bold'>
                                {t('dashboard.teacher')}
                            </td>
                            {allStages?.map((s) => (
                                <td key={s.stageId}>
                                    <Button
                                        preset='text'
                                        className='w-full text-sm'
                                        onClick={() =>
                                            approveStageForAll({
                                                stageId: s.stageId,
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
                                            })
                                        }
                                    >
                                        {t('dashboard.restrictForAllTeachers')}
                                    </Button>
                                </td>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {teachers?.map((t) => (
                            <TeacherStages key={t.teacherId} teacher={t} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
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
            <td className='text-center'>
                {teacher.lastName} {teacher.firstName}
            </td>
            {allStages?.map((s) => {
                const isApproved = !!data?.find((v) => v === s.stageId)
                return (
                    <td
                        key={s.stageId}
                        className={`group ${
                            isApproved ? 'bg-green-300' : 'bg-red-500'
                        }`}
                    >
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

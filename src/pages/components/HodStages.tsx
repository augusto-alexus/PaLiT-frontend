import { useTranslation } from 'react-i18next'
import { Button } from '~/components'
import {
    useAllStages,
    useAllTeachers,
    useApproveStageForAll,
    useGetTeacherStages,
} from '~/hooks'
import { ITeacher } from '~/models'

export function HodStages() {
    const { t } = useTranslation()
    const { data: allStages } = useAllStages()
    const { data: teachers } = useAllTeachers()
    const { mutate } = useApproveStageForAll()

    return (
        <div className='flex w-full flex-col gap-12'>
            <h2 className='text-center text-2xl font-semibold'>
                {t('dashboard.stage2TeacherMapping')}
            </h2>
            <table className='w-full table-fixed border-separate'>
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
                                    className='text-sm'
                                    onClick={() =>
                                        mutate({ stageId: s.stageId })
                                    }
                                >
                                    {t('dashboard.allowForAllTeachers')}
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
    )
}

function TeacherStages({ teacher }: { teacher: ITeacher }) {
    const { data } = useGetTeacherStages(teacher)
    const { data: allStages } = useAllStages()
    return (
        <tr>
            <td className='text-center'>
                {teacher.lastName} {teacher.firstName}
            </td>
            {allStages?.map((s) => (
                <td
                    key={s.stageId}
                    className={`${
                        data?.find((v) => v === s.stageId)
                            ? 'bg-green-300'
                            : 'bg-red-500'
                    }`}
                ></td>
            ))}
        </tr>
    )
}

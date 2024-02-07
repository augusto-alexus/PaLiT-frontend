import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'
import { ITableHeader, Loading, Table } from '~/components'
import { useAllHoDRequests, useAllStudents, useAllTeachers, useCurrentUser } from '~/hooks'
import { routes } from '~/pages'

export function HodTeams() {
    const { role } = useCurrentUser()
    const { t } = useTranslation()
    const { data: allRequests, isLoading: isLoadingRequests } = useAllHoDRequests()
    const { data: allStudents, isLoading: isLoadingStudents } = useAllStudents()
    const { data: allTeachers, isLoading: isLoadingTeachers } = useAllTeachers()

    if (role !== 'HoD') return <Navigate to={`/${routes.authRedirect}`} />

    const suitableRequests = allRequests?.filter((r) => r.teamApproved)

    if (isLoadingRequests || isLoadingStudents || isLoadingTeachers) return <Loading />

    if (
        !suitableRequests ||
        suitableRequests?.length === 0 ||
        !allStudents ||
        allStudents?.length === 0 ||
        !allTeachers ||
        allTeachers?.length === 0
    )
        return <h2 className='w-full text-center text-2xl font-semibold'>{t('dashboard.noTeams')}</h2>

    const tableCols: ITableHeader[] = [
        { key: 'teacherName', label: t('dashboard.teacher') },
        { key: 'studentName', label: t('dashboard.student') },
        { key: 'theme', label: t('dashboard.theme') },
    ]

    const tableRows = suitableRequests.reduce((res, r) => {
        const teacher = allTeachers.find((t) => t.teacherId === r.teacherId)
        const student = allStudents.find((s) => s.studentId === r.studentId)
        if (teacher && student)
            res.push({
                teacherName: `${teacher.lastName}, ${teacher.firstName}`,
                studentName: `${student.lastName}, ${student.firstName}`,
                theme: r.theme,
            })
        return res
    }, [] as ITeamTableRow[])

    return (
        <div className='mx-auto flex w-10/12 gap-24'>
            <div className='flex w-full flex-col gap-12'>
                <h2 className='text-center text-2xl font-semibold'>{t('dashboard.teams')}</h2>
                <div className='mx-auto flex w-11/12 flex-col gap-4'>
                    <Table<ITeamTableRow>
                        cols={tableCols}
                        rows={tableRows}
                        options={{
                            sortFn: (a, b) => {
                                const t = a.teacherName.localeCompare(b.teacherName)
                                if (t !== 0) return t
                                return a.studentName.localeCompare(b.studentName)
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

interface ITeamTableRow {
    teacherName: string
    studentName: string
    theme: string
}

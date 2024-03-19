import { useTranslation } from 'react-i18next'
import { Button, ITableHeader, Loading, Table } from '~/components'
import { useAllHoDRequests, useAllStudents, useAllTeachers } from '~/hooks'
import { useNavigate } from 'react-router-dom'
import { routes } from '~/pages'

export function HodTeams() {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { data: allRequests, isLoading: isLoadingRequests } = useAllHoDRequests()
    const { data: allStudents, isLoading: isLoadingStudents } = useAllStudents()
    const { data: allTeachers, isLoading: isLoadingTeachers } = useAllTeachers()

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
        <div className='flex w-full flex-col gap-12'>
            <div className='mx-auto flex w-7/12 flex-col gap-4'>
                <Table<ITeamTableRow>
                    cols={tableCols}
                    rows={tableRows}
                    tooltipExtensions={[
                        <Button
                            key='1'
                            className='bg-cs-secondary text-center hover:bg-cs-secondary/70'
                            onClick={() => navigate(routes.hod.aNewTeam)}
                        >
                            {t('dashboard.createNewTeam')}
                        </Button>,
                    ]}
                    options={{
                        searchFn: (a, q) =>
                            a.studentName.replace(',', '').toLowerCase().includes(q.toLowerCase()) ||
                            a.teacherName.replace(',', '').toLowerCase().includes(q.toLowerCase()) ||
                            a.theme.toLowerCase().includes(q.toLowerCase()),
                        sortFn: (a, b) => {
                            const t = a.teacherName.localeCompare(b.teacherName)
                            if (t !== 0) return t
                            return a.studentName.localeCompare(b.studentName)
                        },
                    }}
                />
            </div>
        </div>
    )
}

interface ITeamTableRow {
    teacherName: string
    studentName: string
    theme: string
}

import { useTranslation } from 'react-i18next'
import { Button, ITableHeader, MainContentLoading, Table } from '~/components'
import { useGetAllTeams } from '~/hooks'
import { Link, useNavigate } from 'react-router-dom'
import { routes } from '~/pages'

export function HodTeams() {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { teams, teamsLoading } = useGetAllTeams()

    if (teamsLoading) return <MainContentLoading />

    if (!teams?.length) return <h2 className='w-full text-center text-2xl font-semibold'>{t('dashboard.noTeams')}</h2>

    const tableCols: ITableHeader[] = [
        { key: 'teacherName', label: t('dashboard.teacher') },
        { key: 'studentName', label: t('dashboard.student') },
        { key: 'theme', label: t('dashboard.theme') },
        { key: 'editTeam', label: '', style: 'w-8' },
    ]

    const tableRows = teams.map((team) => ({
        teacherName: `${team.teacher.lastName}, ${team.teacher.firstName}`,
        studentName: `${team.student.lastName}, ${team.student.firstName}`,
        theme: team.projectInfo.theme,
        editTeam: (
            <Link to={routes.hod.aEditTeam(team.projectInfo.id)} title={t('dashboard.editTeam')}>
                <i className='ri-history-line' />
            </Link>
        ),
    }))

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
    editTeam: JSX.Element
}

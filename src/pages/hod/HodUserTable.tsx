import { useTranslation } from 'react-i18next'
import { ITableHeader, Loading, Table } from '~/components'
import { useAllUsers } from '~/hooks'
import { Link } from 'react-router-dom'
import { routes } from '~/pages'

export function HodUserTable() {
    const { t } = useTranslation()
    const { users, isLoading } = useAllUsers()

    if (isLoading) return <Loading />

    if (!users || !users?.length)
        return <h2 className="w-full text-center text-2xl font-semibold">{t('dashboard.noUsers')}</h2>

    const tableCols: ITableHeader[] = [
        { key: 'fullName', label: t('fullName') },
        { key: 'email', label: t('email') },
        { key: 'openUserBtn', label: '' },
    ]

    const tableRows = users.map(
        (u) =>
            ({
                email: u.email,
                fullName: `${u.lastName}, ${u.firstName}`,
                openUserBtn: (
                    <Link to={routes.hod.users.user(u.userId.toString())}>
                        <i className="ri-pencil-fill" />
                    </Link>
                ),
            } as ITeamTableRow),
    )

    return (
        <div className="flex w-full flex-col gap-12">
            <div className="flex mx-auto w-5/12 flex-col gap-4">
                <Table<ITeamTableRow>
                    cols={tableCols}
                    rows={tableRows}
                    options={{
                        sortFn: (a, b) => a.fullName.localeCompare(b.fullName),
                    }}
                />
            </div>
            <Link to={routes.hod.users.aUserEdit} className="mb-10 font-normal mx-auto">
                {'+ ' + t('dashboard.addUser')}
            </Link>
        </div>
    )
}

interface ITeamTableRow {
    email: string
    fullName: string
    openUserBtn: JSX.Element
}

import { useTranslation } from 'react-i18next'
import { Button, IconButton, ITableHeader, Loading, Table, toast } from '~/components'
import { useAccessToken, useAllUsers, useCurrentUser } from '~/hooks'
import { Navigate, useNavigate } from 'react-router-dom'
import { routes } from '~/pages/index.ts'
import { useState } from 'react'
import { uploadUserInvitationCsv } from '~/backend'

export function Users() {
    const { role } = useCurrentUser()
    const accessToken = useAccessToken()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { users, isLoading } = useAllUsers()
    const [csvFile, setCsvFile] = useState<File | null>(null)

    if (role !== 'HoD') return <Navigate to={routes.aAuthRedirect} />
    if (isLoading) return <Loading />

    if (!users || !users?.length)
        return <h2 className='w-full text-center text-2xl font-semibold'>{t('dashboard.noUsers')}</h2>

    const tableCols: ITableHeader[] = [
        { key: 'fullName', label: t('fullName') },
        { key: 'email', label: t('email') },
        { key: 'role', label: t('role') },
        { key: 'openUserBtn', label: '', style: 'w-8' },
    ]

    const tableRows = users.map((u) => {
        const roleBadeStyles: string =
            u.role.name === 'HoD'
                ? 'bg-red-500/20 text-red-900'
                : u.role.name === 'PS'
                ? 'bg-amber-500/20 text-amber-900'
                : u.role.name === 'teacher'
                ? 'bg-cyan-500/20 text-cyan-900'
                : 'bg-green-500/20 text-green-900'
        return {
            email: u.email,
            fullName: `${u.lastName}, ${u.firstName}`,
            role: (
                <div
                    className={`relative grid w-fit select-none items-center whitespace-nowrap rounded-md px-2 py-1 font-sans text-xs font-bold uppercase ${roleBadeStyles}`}
                >
                    <span>{t(`roles.${u.role.name}`)}</span>
                </div>
            ),
            openUserBtn: (
                <IconButton onClick={() => navigate(routes.user(u.userId.toString()))}>
                    <i className='ri-pencil-fill' />
                </IconButton>
            ),
        } as ITeamTableRow
    })

    return (
        <div className='flex w-full flex-col gap-12'>
            <div className='mx-auto flex w-1/2 flex-col gap-4'>
                <Table<ITeamTableRow>
                    cols={tableCols}
                    rows={tableRows}
                    tooltipExtensions={[
                        <Button
                            key='1'
                            className='bg-cs-secondary text-center text-sm hover:bg-cs-secondary/70'
                            onClick={() => navigate(routes.aUserEdit)}
                        >
                            {'+ ' + t('dashboard.addUser')}
                        </Button>,
                        <div className='flex flex-col gap-4' key='2'>
                            <label
                                htmlFor='upload-csv'
                                className={`cursor-pointer rounded-lg border border-cs-primary bg-cs-primary px-4 py-2 text-sm text-white hover:bg-cs-accent-blue focus:bg-cs-accent-blue ${
                                    csvFile ? 'text-cs-secondary' : 'text-cs-link'
                                }`}
                            >
                                {t('dashboard.inviteUsersCsv')}
                            </label>
                            <input
                                id='upload-csv'
                                key={csvFile?.name}
                                type='file'
                                disabled={!!csvFile}
                                accept='.csv'
                                className='hidden'
                                onChange={(e) => {
                                    if (e.target.files === null) return
                                    const file = e.target.files[0]
                                    if (confirm(t('dashboard.areYouSureInviteCsv'))) {
                                        void uploadUserInvitationCsv(accessToken, file)
                                        setTimeout(() => {
                                            toast(t('fileUploadedSuccessfully'))
                                            setCsvFile(null)
                                        })
                                    }
                                }}
                            />
                        </div>,
                    ]}
                    options={{
                        searchFn: (a, q) =>
                            a.fullName.replace(',', '').toLowerCase().includes(q.toLowerCase()) ||
                            a.email.toLowerCase().includes(q.toLowerCase()),
                        sortFn: (a, b) => a.fullName.localeCompare(b.fullName),
                    }}
                />
            </div>
        </div>
    )
}

interface ITeamTableRow {
    email: string
    fullName: string
    role: JSX.Element
    openUserBtn: JSX.Element
}

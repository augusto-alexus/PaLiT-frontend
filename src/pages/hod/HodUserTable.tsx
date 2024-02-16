import { useTranslation } from 'react-i18next'
import { Button, IconButton, ITableHeader, Loading, Table, toast } from '~/components'
import { useAccessToken, useAllUsers, useDeleteUser } from '~/hooks'
import { Link, useNavigate } from 'react-router-dom'
import { routes } from '~/pages'
import { useState } from 'react'
import { uploadUserInvitationCsv } from '~/backend'

export function HodUserTable() {
    const accessToken = useAccessToken()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { users, isLoading } = useAllUsers()
    const { mutate: deleteUser } = useDeleteUser(() => toast(t('dashboard.userDeleted')))
    const [csvFile, setCsvFile] = useState<File | null>(null)

    if (isLoading) return <Loading />

    if (!users || !users?.length)
        return <h2 className='w-full text-center text-2xl font-semibold'>{t('dashboard.noUsers')}</h2>

    const tableCols: ITableHeader[] = [
        { key: 'fullName', label: t('fullName') },
        { key: 'email', label: t('email') },
        { key: 'openUserBtn', label: '', style: 'w-8' },
        { key: 'deleteUserBtn', label: '', style: 'w-8' },
    ]

    const tableRows = users.map(
        (u) =>
            ({
                email: u.email,
                fullName: `${u.lastName}, ${u.firstName}`,
                openUserBtn: (
                    <IconButton onClick={() => navigate(routes.hod.users.user(u.userId.toString()))}>
                        <i className='ri-pencil-fill' />
                    </IconButton>
                ),
                deleteUserBtn: (
                    <IconButton
                        onClick={() => {
                            if (
                                confirm(
                                    t('dashboard.areYouSureYouWantToDeleteUser', {
                                        fullName: u.lastName + ' ' + u.firstName,
                                    }) + '?'
                                )
                            )
                                deleteUser({ userId: u.userId.toString() })
                        }}
                    >
                        <i className='ri-delete-bin-2-fill text-cs-warning' />
                    </IconButton>
                ),
            } as ITeamTableRow)
    )

    return (
        <div className='flex w-full flex-col gap-12'>
            <div className='mx-auto flex w-1/2 flex-col gap-4'>
                <Table<ITeamTableRow>
                    cols={tableCols}
                    rows={tableRows}
                    options={{
                        sortFn: (a, b) => a.fullName.localeCompare(b.fullName),
                    }}
                />
            </div>
            <Link to={routes.hod.users.aUserEdit} className='mx-auto font-normal'>
                {'+ ' + t('dashboard.addUser')}
            </Link>
            <div className='mx-auto flex flex-col gap-4'>
                <label
                    htmlFor='upload-csv'
                    className={`cursor-pointer ${csvFile ? 'text-cs-secondary' : 'text-cs-link'}`}
                    onClick={() => {
                        if (csvFile) {
                            void uploadUserInvitationCsv(accessToken, csvFile)
                            setTimeout(() => {
                                toast(t('fileUploadedSuccessfully'))
                                setCsvFile(null)
                            }, 700)
                        }
                    }}
                >
                    {csvFile ? t('confirmUploadWork') : t('dashboard.inviteUsersCsv')}
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
                        setCsvFile(e.target.files[0])
                    }}
                />
                <Button preset='text' hidden={!csvFile} className='text-cs-warning' onClick={() => setCsvFile(null)}>
                    {t('cancel')}
                </Button>
            </div>
        </div>
    )
}

interface ITeamTableRow {
    email: string
    fullName: string
    openUserBtn: JSX.Element
    deleteUserBtn: JSX.Element
}

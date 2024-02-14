import { useAllStudentsWithInfo, useCurrentUser } from '~/hooks'
import { ITableHeader, Loading, Table, toast } from '~/components'
import { useTranslation } from 'react-i18next'
import { routes } from '~/pages'
import { Link, useNavigate } from 'react-router-dom'

export function HodStudents() {
    const { t } = useTranslation()
    const { allowedStageIds } = useCurrentUser()
    const navigate = useNavigate()
    const { data, isInitialLoading } = useAllStudentsWithInfo()

    if (isInitialLoading) return <Loading />
    if (!data) return <h2 className='text-2xl text-cs-text-dark'>{t('dashboard.noUsers')}</h2>

    const tableCols: ITableHeader[] = [
        { key: 'studentFullName', label: t('dashboard.student') },
        { key: 'currentStage', label: t('projectInfo.stage') },
        { key: 'workStatus', label: t('workStatus') },
        { key: 'openLastWorkBtn', label: '', style: 'w-8' },
        { key: 'openHistoryBtn', label: '', style: 'w-8' },
    ]

    const tableRows: ITableRow[] = data.map((s) => ({
        studentFullName: `${s.userDTO.lastName}, ${s.userDTO.firstName}`,
        currentStage: s.documentDTO.stageDTO.name,
        workStatus:
            s.documentDTO.approved === 'false'
                ? !!s.documentDTO.approvedDate
                    ? t('workStatuses.rejected')
                    : t('workStatuses.toReview')
                : t('workStatuses.accepted'),
        openLastWorkBtn: (
            <button
                className='w-fit px-0.5 py-0 text-cs-primary'
                onClick={() => {
                    if (allowedStageIds?.includes(s.documentDTO.stageDTO.stageId))
                        navigate(routes.common.aWorkReview(s.studentDTO.studentId, s.documentDTO.documentId))
                    else toast(t('feed.cantViewStage'))
                }}
                title={t('feed.viewLastDocument')}
            >
                <i className='ri-pencil-fill' />
            </button>
        ),
        openHistoryBtn: (
            <Link to={routes.common.aStudentFeed(s.studentDTO.studentId)} title={t('feed.checkHistory')}>
                <i className='ri-history-line' />
            </Link>
        ),
    }))

    return (
        <div className='mx-auto flex w-7/12 flex-col gap-4'>
            <Table<ITableRow>
                cols={tableCols}
                rows={tableRows}
                options={{
                    sortFn: (a, b) => a.studentFullName.localeCompare(b.studentFullName),
                }}
            />
        </div>
    )
}

interface ITableRow {
    studentFullName: string
    currentStage: string
    workStatus: string
    openLastWorkBtn: JSX.Element
    openHistoryBtn: JSX.Element
}

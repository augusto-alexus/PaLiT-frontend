import { useAllStudentsWithInfo, useCurrentUser } from '~/hooks'
import { ITableHeader, Loading, Table, toast } from '~/components'
import { useTranslation } from 'react-i18next'
import { routes } from '~/pages'
import { Link, useNavigate } from 'react-router-dom'
import { IHodStudentInfo } from '~/backend'

export function HodProjects() {
    const { t } = useTranslation()
    const { allowedStageIds } = useCurrentUser()
    const navigate = useNavigate()
    const { data, isInitialLoading } = useAllStudentsWithInfo()

    if (isInitialLoading) return <Loading />
    if (!data?.length)
        return <h2 className='w-full text-center text-2xl text-cs-text-dark'>{t('dashboard.noProjects')}</h2>

    const tableCols: ITableHeader[] = [
        { key: 'studentFullName', label: t('dashboard.student') },
        { key: 'currentStage', label: t('projectInfo.stage') },
        { key: 'workStatus', label: t('workStatus') },
        { key: 'openLastWorkBtn', label: '', style: 'w-8' },
        { key: 'openHistoryBtn', label: '', style: 'w-8' },
    ]

    // const tmp = [3, 4, 5, 6, 7, 8].map(
    //     (i) =>
    //         ({
    //             studentDTO: {
    //                 studentId: (Math.random() * 1000).toString(),
    //                 cluster: 'ІКНІ',
    //                 degree: 'BACHELOR',
    //                 faculty: 'КН',
    //                 graduateDate: new Date().toString(),
    //             },
    //             documentDTO: {
    //                 documentId: (Math.random() * 1000).toString(),
    //                 approvedDate: Math.random() > 0.5 ? 'oink' : null,
    //                 approved: Math.random() > 0.5 ? 'false' : 'true',
    //                 createdDate: new Date().toString(),
    //                 originalName: 'blah blah',
    //                 stageDTO: {
    //                     stageId: ((i ** 2 + 47) % 4) + 1,
    //                     name: `s${((i ** 2 + 47) % 4) + 1}`,
    //                     serialOrder: ((i ** 2 + 47) % 4) + 1,
    //                 },
    //             },
    //             userDTO: {
    //                 userId: (Math.random() * 1000).toString(),
    //                 firstName: `Test ${i}`,
    //                 lastName: 'Student',
    //                 email: `st${i}@gmail.com`,
    //             },
    //         } as IHodStudentInfo)
    // )

    const tableRows: ITableRow[] = data.map((s) => {
        const workStatus: 'rejected' | 'toReview' | 'accepted' =
            s.documentDTO.approved === 'false' ? (s.documentDTO.approvedDate ? 'rejected' : 'toReview') : 'accepted'
        const workStatusBadgeStyles: string =
            workStatus === 'rejected'
                ? 'bg-red-500/20 text-red-900'
                : workStatus === 'toReview'
                ? 'bg-amber-500/20 text-amber-900'
                : 'bg-green-500/20 text-green-900'
        return {
            studentFullName: `${s.userDTO.lastName}, ${s.userDTO.firstName}`,
            currentStage: t(`stages.${s.documentDTO.stageDTO.name}`),
            workStatus: (
                <div
                    className={`relative grid w-fit select-none items-center whitespace-nowrap rounded-md px-2 py-1 font-sans text-xs font-bold uppercase ${workStatusBadgeStyles}`}
                >
                    <span>{t(`workStatuses.${workStatus}`)}</span>
                </div>
            ),
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
        }
    })

    return (
        <div className='mx-auto flex w-7/12 flex-col gap-4'>
            <Table<ITableRow>
                cols={tableCols}
                rows={tableRows}
                options={{
                    searchFn: (a, q) => a.studentFullName.replace(',', '').toLowerCase().includes(q.toLowerCase()),
                    sortFn: (a, b) => a.studentFullName.localeCompare(b.studentFullName),
                }}
            />
        </div>
    )
}

interface ITableRow {
    studentFullName: string
    currentStage: string
    workStatus: JSX.Element
    openLastWorkBtn: JSX.Element
    openHistoryBtn: JSX.Element
}

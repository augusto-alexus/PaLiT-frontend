import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button, MainContentLoading, toast } from '~/components'
import { useAcceptInvitation, useCurrentUser, useGetAllTeams, useInvitations, useRejectInvitation } from '~/hooks'
import { routes } from '~/pages/index.ts'
import { IRequest } from '~/backend'
import { getHumanReadableDuration } from '~/lib'

export function Invitations() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { role } = useCurrentUser()
    const { mutate: rejectInvitation } = useRejectInvitation(() => toast('Запрошення відхилено!'))
    const { mutate: mutateApprove } = useAcceptInvitation(() => {
        toast(`${t('request.approved')}!`)
        navigate(routes.aAuthRedirect)
    })
    const { data: invitations, isInitialLoading: invitationsLoading } = useInvitations()
    const { teams, teamsLoading } = useGetAllTeams()

    if (invitationsLoading || teamsLoading) return <MainContentLoading />

    const relevantInvitations = invitations?.filter(
        (inv) =>
            !teams?.some(
                (t) =>
                    (role === 'student' && inv.user.id == t.teacher.teacherId) ||
                    (role !== 'student' && inv.user.id == t.student.studentId)
            )
    )

    if (!relevantInvitations?.filter((r) => !r.approved)?.length)
        return <h2 className='text-center text-2xl font-semibold'>{t('request.empty')}</h2>

    const othersRequests = relevantInvitations
        .filter(
            (request) =>
                (request.direction == 'STUDENT' && role == 'student') ||
                (request.direction == 'TEACHER' && role != 'student')
        )
        .filter((r) => !r.approved)

    const myRequests = relevantInvitations
        .filter(
            (request) =>
                !(
                    (request.direction == 'STUDENT' && role == 'student') ||
                    (request.direction == 'TEACHER' && role != 'student')
                )
        )
        .filter((r) => !r.approved)

    return (
        <div className='mx-auto flex w-fit flex-col gap-20'>
            <div className='flex flex-col gap-16 md:flex-row lg:gap-40'>
                {!!othersRequests.length && (
                    <div className='max-w-lg'>
                        <div className='mb-8 text-center text-2xl font-semibold'>{t('request.forMe')}</div>
                        {othersRequests.map((request) => (
                            <Request
                                key={request.requestId}
                                request={request}
                                onReject={(requestId) => rejectInvitation({ requestId })}
                                onApprove={(requestId) => mutateApprove({ requestId })}
                            />
                        ))}
                    </div>
                )}
                {!!myRequests.length && (
                    <div className='max-w-lg'>
                        <div className='mb-8 text-center text-2xl font-semibold'>{t('request.my')}</div>
                        {myRequests.map((request) => (
                            <Request
                                key={request.requestId}
                                request={request}
                                onReject={(requestId) => rejectInvitation({ requestId })}
                                onApprove={(requestId) => mutateApprove({ requestId })}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function Request({
    request,
    onReject,
    onApprove,
}: {
    request: IRequest
    onReject: (requestId: number) => void
    onApprove: (requestId: number) => void
}) {
    const { t } = useTranslation()
    const { role } = useCurrentUser()
    const canAccept =
        (request.direction == 'STUDENT' && role == 'student') || (request.direction == 'TEACHER' && role != 'student')
    return (
        <div
            className={`grid grid-cols-3 gap-4 rounded-xl border-b p-2 px-6 pb-4 ${
                request.approved ? 'bg-green-300' : ''
            }`}
        >
            <div className='col-span-2 text-xl font-bold'>
                {request.user.lastName} {request.user.firstName}
            </div>
            <div className='place-self-end font-mono text-sm'>
                {getHumanReadableDuration(new Date(request.createdDate))}
            </div>
            {request.user.degree && (
                <div className='col-span-2 font-semibold'>{t(`degrees.${request.user.degree}`)}</div>
            )}
            {request.user.faculty && <div className='place-self-end font-mono text-sm'>{request.user.faculty}</div>}
            <div className='col-span-2'>
                Запропонована тема: <span className='font-bold'>{request.theme}</span>
            </div>
            {request.user.cluster && <div className='place-self-end font-mono text-sm'>{request.user.cluster}</div>}
            <div className='col-span-3 flex flex-row justify-between'>
                <Button preset='text' className='text-cs-warning' onClick={() => onReject(request.requestId)}>
                    Відхилити запит
                </Button>
                <Button preset='text' hidden={!canAccept} onClick={() => onApprove(request.requestId)}>
                    Прийняти запит
                </Button>
            </div>
        </div>
    )
}

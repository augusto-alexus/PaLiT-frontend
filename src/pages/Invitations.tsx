import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
    approveRequest,
    rejectRequest,
    useGetRequestsStudent,
    useGetRequestsTeacher,
} from '~/backend'
import { toast } from '~/components'
import { useAccessToken, useCurrentUser } from '~/hooks'
import { routes } from '~/pages/routes.ts'
import { Request } from './page-components'

export function Invitations() {
    const navigate = useNavigate()
    const currentUser = useCurrentUser()
    const accessToken = useAccessToken()
    const getRequestsStudent = useGetRequestsStudent(accessToken)
    const getRequestsTeacher = useGetRequestsTeacher(accessToken)
    const queryClient = useQueryClient()
    const { mutate: mutateReject } = useMutation({
        mutationFn: async ({ requestId }: { requestId: number }) => {
            return rejectRequest({ accessToken, requestId })
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(['requests'])
            toast('Запрошення відхилено!')
        },
    })
    const { mutate: mutateApprove } = useMutation({
        mutationFn: async ({ requestId }: { requestId: number }) => {
            return approveRequest({ accessToken, requestId })
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(['requests'])
            await queryClient.invalidateQueries(['myProject'])
            toast('Запрошення прийнято!')
            navigate(`/${routes.authRedirect}`)
        },
    })
    const { data } = useQuery(['requests'], () => {
        if (currentUser.role === 'teacher') return getRequestsTeacher()
        else return getRequestsStudent()
    })

    if (!data?.length)
        return (
            <div className='text-center text-2xl font-semibold'>
                Запрошення відсутні
            </div>
        )

    const othersRequests = data.filter(
        (request) =>
            (request.direction == 'STUDENT' && currentUser.role == 'student') ||
            (request.direction == 'TEACHER' && currentUser.role == 'teacher')
    )

    const myRequests = data.filter(
        (request) =>
            !(
                (request.direction == 'STUDENT' &&
                    currentUser.role == 'student') ||
                (request.direction == 'TEACHER' &&
                    currentUser.role == 'teacher')
            )
    )

    return (
        <div className='mx-auto flex w-fit flex-col gap-20'>
            <div className='flex flex-col gap-16 md:flex-row lg:gap-40'>
                {!!othersRequests.length && (
                    <div className='max-w-lg'>
                        <div className='mb-8 text-center text-2xl font-semibold'>
                            Запрошення для мене
                        </div>
                        {othersRequests.map((request) => (
                            <Request
                                key={request.requestId}
                                request={request}
                                onReject={(requestId) =>
                                    mutateReject({ requestId })
                                }
                                onApprove={(requestId) =>
                                    mutateApprove({ requestId })
                                }
                            />
                        ))}
                    </div>
                )}
                {!!myRequests.length && (
                    <div className='max-w-lg'>
                        <div className='mb-8 text-center text-2xl font-semibold'>
                            Мої запрошення
                        </div>
                        {myRequests.map((request) => (
                            <Request
                                key={request.requestId}
                                request={request}
                                onReject={(requestId) =>
                                    mutateReject({ requestId })
                                }
                                onApprove={(requestId) =>
                                    mutateApprove({ requestId })
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

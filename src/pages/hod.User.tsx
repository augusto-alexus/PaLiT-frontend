import { Link, Navigate, useParams } from 'react-router-dom'
import { routes } from '~/pages/index.ts'
import { useCurrentUser, useUserById } from '~/hooks'
import { DisplayError, MainContentLoading } from '~/components'
import { useTranslation } from 'react-i18next'

export function User() {
    const { role } = useCurrentUser()
    const { t } = useTranslation()
    const { userId } = useParams()
    const { user, isLoading, error } = useUserById(userId)

    if (role !== 'HoD') return <Navigate to={routes.aAuthRedirect} />
    if (!userId) return <Navigate to={routes.aUsers} />
    if (isLoading) return <MainContentLoading />
    if (!user) return <DisplayError error={error} />

    return (
        <div className='mx-auto flex flex-col gap-4'>
            <Link to={routes.aUsers} className='mb-10 font-normal'>
                {t('dashboard.backToUsersTable')}
            </Link>
            <h2 className='text-2xl font-bold text-cs-text-dark'>
                {user.lastName}, {user.firstName}
            </h2>
            <hr className='border-cs-text-dark' />
            <div className='grid grid-cols-2 gap-x-16 gap-y-3'>
                <span className='font-semibold'>{t('email')}:</span>
                <span>{user.email}</span>

                <span className='font-semibold'>{t('role')}:</span>
                <span>{user.roleDTO?.name ? t(`roles.${user.roleDTO.name}`) : t('roles.unknown')}</span>

                <hr className='col-span-2 my-3' />

                {user.studentDTO && (
                    <>
                        <span className='font-semibold'>{t('degree')}:</span>
                        <span>{t(`degrees.${user.studentDTO.degree.toLowerCase()}`)}</span>

                        <span className='font-semibold'>{t('faculty')}:</span>
                        <span>{user.studentDTO.faculty}</span>

                        <span className='font-semibold'>{t('studentGroup')}:</span>
                        <span>{user.studentDTO.cluster}</span>

                        <span className='font-semibold'>{t('graduationYear')}:</span>
                        <span>{user.studentDTO.graduateDate}</span>
                    </>
                )}

                {user.teacherDTO && (
                    <>
                        <span className='font-semibold'>{t('bachelorStudentLimit')}:</span>
                        <span>{user.teacherDTO.generalBachelor ?? 0}</span>

                        <span className='font-semibold'>{t('masterStudentLimit')}:</span>
                        <span>{user.teacherDTO.generalMaster ?? 0}</span>
                    </>
                )}
            </div>
            <Link to={routes.aUserEdit + `?user=${userId}`} className='mt-10 font-normal'>
                {t('dashboard.editUser')}
            </Link>
        </div>
    )
}

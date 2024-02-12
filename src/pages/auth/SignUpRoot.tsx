import { Link, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ProjectLogo, WithNulpBg } from '~/components'
import { routes } from '~/pages'

export function SignUpRoot() {
    const { t } = useTranslation()
    return (
        <div className='flex h-full place-content-center items-center'>
            <WithNulpBg />
            <main className='flex flex-col gap-4 rounded-2xl bg-white px-8 py-12 drop-shadow-2xl sm:px-20 sm:py-16 md:px-[25vw] md:py-24 lg:px-64'>
                <div className='mb-8 place-self-center'>
                    <ProjectLogo />
                </div>
                <h1 className='text-center font-[Montserrat] text-2xl font-bold text-cs-text-dark'>
                    {t('signUpTitle')}
                </h1>
                <Outlet />
                <div className='self-start'>
                    {t('registeredAlready')}?
                    <Link to={`/${routes.signIn}`} className='ml-4'>
                        {t('signIn')}
                    </Link>
                </div>
            </main>
        </div>
    )
}

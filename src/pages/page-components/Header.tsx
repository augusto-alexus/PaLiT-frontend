import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { Avatar, Button, ProjectLogo } from '~/components'
import { useCurrentUser } from '~/hooks/useCurrentUser.ts'
import { useMyProject } from '~/hooks/useMyProject.ts'
import { routes } from '~/pages'
import { useAuthStore } from '~/store/authStore.ts'

export function Header() {
    return (
        <header className='sticky left-0 top-0 z-10 mx-auto mb-16 mt-6 flex h-fit w-10/12 flex-row place-content-around place-items-center border-b border-cs-additional-gray bg-cs-bg-white p-4 pb-8'>
            <ProjectLogo />
            <HeaderNav />
            <HeaderTools />
        </header>
    )
}

function HeaderNav() {
    const { t } = useTranslation()
    const { role } = useCurrentUser()
    const { myProjectStarted } = useMyProject()
    const showInvitations =
        role === 'teacher' || (role === 'student' && !myProjectStarted)
    return (
        <nav className='flex flex-row place-items-center justify-center gap-8'>
            {role === 'student' && (
                <NavLink
                    className={({ isActive }) =>
                        isActive
                            ? 'cursor-default select-none border-0 text-cs-secondary underline underline-offset-8 outline-none hover:text-cs-secondary'
                            : ''
                    }
                    to={routes.myProject}
                >
                    {t('navigation.myProject')}
                </NavLink>
            )}
            {role === 'teacher' && (
                <NavLink
                    className={({ isActive }) =>
                        isActive
                            ? 'cursor-default select-none border-0 text-cs-secondary underline underline-offset-8 outline-none hover:text-cs-secondary'
                            : ''
                    }
                    to={routes.myStudents}
                >
                    {t('navigation.myStudents')}
                </NavLink>
            )}
            {role === 'student' && (
                <NavLink
                    className={({ isActive }) =>
                        isActive
                            ? 'cursor-default select-none border-0 text-cs-secondary underline underline-offset-8 outline-none hover:text-cs-secondary'
                            : ''
                    }
                    to={routes.teacherList}
                >
                    {t('navigation.teachers')}
                </NavLink>
            )}
            {role === 'teacher' && (
                <NavLink
                    className={({ isActive }) =>
                        isActive
                            ? 'cursor-default select-none border-0 text-cs-secondary underline underline-offset-8 outline-none hover:text-cs-secondary'
                            : ''
                    }
                    to={routes.studentList}
                >
                    {t('navigation.students')}
                </NavLink>
            )}
            {showInvitations && (
                <NavLink
                    className={({ isActive }) =>
                        'relative' +
                        (isActive
                            ? 'cursor-default select-none border-0 text-cs-secondary underline underline-offset-8 outline-none hover:text-cs-secondary'
                            : '')
                    }
                    to={routes.invitations}
                >
                    {t('navigation.invites')}
                </NavLink>
            )}
        </nav>
    )
}

function HeaderTools() {
    const { t, i18n } = useTranslation()
    const authStore = useAuthStore()
    return (
        <div className='flex flex-row place-items-center gap-4'>
            <Avatar />
            <Button
                preset='icon'
                title={t('changeLanguage')}
                onClick={() => {
                    if (i18n.language === 'en') void i18n.changeLanguage('ua')
                    else void i18n.changeLanguage('en')
                }}
                className='-mr-8 text-cs-text-dark focus:text-cs-primary focus:outline-none'
                icon={<i className='ri-global-line hover:text-cs-primary'></i>}
            />
            <Button
                preset='icon'
                title={t('logout')}
                onClick={() => {
                    authStore.reset()
                }}
                className='text-cs-text-dark focus:text-cs-warning focus:outline-none'
                icon={
                    <i className='ri-logout-box-line hover:text-cs-warning' />
                }
            />
        </div>
    )
}

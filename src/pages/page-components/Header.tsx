import { NavLink } from 'react-router-dom'
import { Avatar, Button, ProjectLogo } from '~/components'
import { useCurrentUser } from '~/hooks/useCurrentUser.ts'
import { routes } from '~/pages'
import { useAuthStore } from '~/store/authStore.ts'

export function Header() {
    return (
        <header className='sticky left-0 top-0 mx-auto mb-16 mt-6 flex h-fit w-10/12 flex-row place-content-around place-items-center border-b border-cs-additional-gray bg-cs-bg-white p-4 pb-8'>
            <ProjectLogo />
            <HeaderNav />
            <HeaderTools />
        </header>
    )
}

function HeaderNav() {
    const { role } = useCurrentUser()
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
                    Моя робота
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
                    Мої студенти
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
                    Куратори
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
                    Студенти
                </NavLink>
            )}
            <NavLink
                className={({ isActive }) =>
                    'relative' +
                    (isActive
                        ? 'cursor-default select-none border-0 text-cs-secondary underline underline-offset-8 outline-none hover:text-cs-secondary'
                        : '')
                }
                to={routes.invitations}
            >
                Запрошення
            </NavLink>
        </nav>
    )
}

function HeaderTools() {
    const authStore = useAuthStore()
    return (
        <div className='flex flex-row place-items-center gap-4'>
            <Avatar />
            <Button
                preset='icon'
                title='Вийти з системи'
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

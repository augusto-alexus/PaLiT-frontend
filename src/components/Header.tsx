import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { Avatar, Button, ProjectLogo } from '~/components'
import { useCurrentUser, useMyProject } from '~/hooks'
import { Role } from '~/models'
import { routes } from '~/pages'
import { useAuthStore } from '~/store'
import { logOut } from '~/backend'

export function Header() {
    const { role } = useCurrentUser()
    const { myProjectStarted } = useMyProject()
    const navItems = getHeaderNavs(role, myProjectStarted)
    return (
        <header className='sticky left-0 top-0 z-10 mx-auto mb-8 flex h-fit w-10/12 flex-row place-content-around place-items-center border-b border-cs-additional-gray bg-cs-bg-white p-4 pb-8 pt-6'>
            <ProjectLogo />
            <HeaderNav navItems={navItems} />
            <HeaderTools />
        </header>
    )
}

interface INavItem {
    to: string
    tLabel: string
}

function getHeaderNavs(role: Role, myProjectStarted: boolean): INavItem[] {
    if (role === 'student') return getStudentHeaderNavs(myProjectStarted)
    if (role === 'teacher') return getTeacherHeaderNavs()
    if (role === 'HoD') return getHodHeaderNavs()
    if (role === 'PS') return getPsHeaderNavs()
    throw new Error(`Unexpected role ${role as string} in 'getHeaderNavs'`)
}

function getStudentHeaderNavs(myProjectStarted: boolean): INavItem[] {
    const navs: INavItem[] = [{ to: routes.student.aMyProject, tLabel: 'navigation.myProject' }]
    if (!myProjectStarted) {
        navs.push({ to: routes.student.aTeachers, tLabel: 'navigation.teachers' })
        navs.push({ to: routes.common.aInvitations, tLabel: 'navigation.invites' })
    }
    return navs
}

function getTeacherHeaderNavs(): INavItem[] {
    return [
        { to: routes.common.aMyStudents, tLabel: 'navigation.myStudents' },
        { to: routes.common.aInviteStudents, tLabel: 'navigation.students' },
        { to: routes.common.aInvitations, tLabel: 'navigation.invites' },
    ]
}

function getHodHeaderNavs(): INavItem[] {
    return [
        ...getTeacherHeaderNavs(),
        { to: routes.hod.aProjects, tLabel: 'navigation.projects' },
        { to: routes.hod.aStageApproval, tLabel: 'navigation.stageApproval' },
        { to: routes.hod.aTeams, tLabel: 'navigation.teams' },
        { to: routes.hod.users.aRoot, tLabel: 'navigation.usersControl' },
    ]
}

function getPsHeaderNavs(): INavItem[] {
    return [...getTeacherHeaderNavs(), { to: routes.ps.aStudents, tLabel: 'navigation.students' }]
}

function HeaderNav({ navItems }: { navItems: INavItem[] }) {
    const { t } = useTranslation()
    return (
        <nav className='flex flex-row place-items-center justify-center gap-8'>
            {navItems.map((navItem, idx) => (
                <NavLink
                    key={idx}
                    to={navItem.to}
                    className={({ isActive }) =>
                        isActive
                            ? 'cursor-default select-none border-0 text-cs-secondary underline underline-offset-8 outline-none hover:text-cs-secondary'
                            : ''
                    }
                >
                    {t(navItem.tLabel)}
                </NavLink>
            ))}
        </nav>
    )
}

function HeaderTools() {
    const { t, i18n } = useTranslation()
    const authStore = useAuthStore()
    const currentUser = useCurrentUser()
    return (
        <div className='flex flex-row place-items-center gap-4'>
            <Avatar firstName={currentUser.firstName} lastName={currentUser.lastName} bgColor={'bg-cs-primary'} />
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
                    logOut()
                    authStore.reset()
                }}
                className='text-cs-text-dark focus:text-cs-warning focus:outline-none'
                icon={<i className='ri-logout-box-line hover:text-cs-warning' />}
            />
        </div>
    )
}

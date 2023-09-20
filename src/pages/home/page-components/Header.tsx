import { Avatar, Button, Search, Logo } from '~/components'
import { useAuthStore } from '~/store/authStore.ts'
import { useNavigate } from 'react-router-dom'
import { routes } from '~/pages'

export function Header() {
    const navigate = useNavigate()
    const authStore = useAuthStore()
    const isTeacher = authStore.currentUser?.roleDTO?.name === 'teacher'
    return (
        <header className='sticky left-0 top-0 mt-6 flex h-fit w-full flex-row place-content-around place-items-center p-4'>
            <div className='mr-20'>
                <Logo />
            </div>
            <nav className='flex flex-row place-items-center justify-center gap-2'>
                <Button
                    preset='text'
                    onClick={() => navigate(routes.home.files)}
                >
                    Моя робота
                </Button>
                <Button
                    preset='text'
                    onClick={() => {
                        if (isTeacher) navigate(routes.home.studentList)
                        else navigate(routes.home.teacherList)
                    }}
                >
                    {isTeacher ? 'Студенти' : 'Куратори'}
                </Button>
                <Button preset='text'>Теми</Button>
                <Button preset='text'>Чат</Button>
            </nav>
            <div className='flex flex-row place-items-center gap-4'>
                <Search placeholder='Пошук...' />
                <Avatar />
                <Button
                    preset='text'
                    onClick={() => {
                        authStore.reset()
                    }}
                >
                    <i className='ri-logout-box-line text-cs-text-dark' />
                </Button>
            </div>
        </header>
    )
}

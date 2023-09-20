import { Avatar, Button, Search, Logo } from '~/components'
import { useAuthStore } from '~/store/authStore.ts'

export function Header() {
    const authStore = useAuthStore()
    return (
        <header className='sticky left-0 top-0 mt-6 flex h-fit w-full flex-row place-content-around place-items-center p-4'>
            <div className='mr-20'>
                <Logo />
            </div>
            <nav className='flex flex-row place-items-center justify-center gap-2'>
                <Button preset='text'>Моя робота</Button>
                <Button preset='text'>Куратори</Button>
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

import { Link } from 'react-router-dom'
import { ISignInForm, useSignIn } from '~/backend'
import { Button, Logo, WithNulpBg } from '~/components'
import { useForm } from '~/hooks'
import { routes } from '~/pages'

export function SignInPage() {
    const signIn = useSignIn()
    const [form, onFieldChange, onSubmit] = useForm<ISignInForm>(
        {
            email: '',
            password: '',
            rememberMe: false,
        },
        signIn
    )

    return (
        <>
            <WithNulpBg />
            <main className='center flex h-full flex-col items-center justify-center gap-12'>
                <form
                    onSubmit={onSubmit}
                    className='flex max-w-fit flex-col justify-center gap-4 rounded-2xl bg-white px-8 py-16 drop-shadow-2xl dark:bg-neutral-950 sm:px-20 sm:py-24 md:px-[25vw] md:py-32 lg:px-64'
                >
                    <div className='place-self-center'>
                        <Logo />
                    </div>
                    <div className='flex w-[19.5rem] flex-col sm:w-[24rem]'>
                        <label className='text-left'>Пошта</label>
                        <input
                            required
                            name='email'
                            type='email'
                            value={form.email}
                            onChange={onFieldChange}
                            placeholder='Введіть Вашу пошту'
                            className='rounded-md border-2 border-[#646cff77] bg-inherit px-4 py-2 focus:border-[#646cffbb]'
                        />
                    </div>
                    <div className='flex w-[19.5rem] flex-col sm:w-[24rem]'>
                        <label className='text-left'>Пароль</label>
                        <input
                            required
                            name='password'
                            type='password'
                            value={form.password}
                            onChange={onFieldChange}
                            placeholder='Введіть Ваш пароль'
                            className='rounded-md border-2 border-[#646cff77] bg-inherit px-4 py-2 focus:border-red-300'
                        />
                    </div>
                    <div className='flex w-[19.5rem] flex-row gap-2 sm:w-[24rem]'>
                        <input
                            name='rememberMe'
                            type='checkbox'
                            checked={form.rememberMe}
                            onChange={onFieldChange}
                            className='rounded-none'
                        />
                        <label className='text-left'>Запам'ятати мене</label>
                    </div>
                    <Button>Авторизація</Button>
                    <div className='self-start'>
                        Ще не зареєстровані?
                        <Link to={routes.signUp} className='ml-4'>
                            Реєстрація
                        </Link>
                    </div>
                </form>
            </main>
        </>
    )
}

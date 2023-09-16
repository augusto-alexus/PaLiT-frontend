import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ISignInForm, useSignIn } from '~/backend'
import {
    Button,
    Logo,
    Input,
    WithNulpBg,
    Password,
    Checkbox,
} from '~/components'
import { useForm } from '~/hooks'
import { routes } from '~/pages'

export function SignInPage() {
    const navigate = useNavigate()
    const { form, onFieldChange, onCheckboxFieldChange, onSubmit } =
        useForm<ISignInForm>(
            {
                email: '',
                password: '',
                rememberMe: false,
            },
            useSignIn(() => {
                setTimeout(() => {
                    toast.dismiss()
                    navigate(routes.home)
                }, 2500)
            })
        )

    return (
        <div className='flex h-full place-content-center items-center'>
            <WithNulpBg />
            <main className='flex flex-col gap-4 rounded-2xl bg-white px-8 py-12 drop-shadow-2xl sm:px-20 sm:py-16 md:px-[25vw] md:py-24 lg:px-64'>
                <div className='mb-8 place-self-center'>
                    <Logo />
                </div>
                <h1 className='mb-16 text-center font-[Montserrat] text-2xl font-bold text-cs-text-dark'>
                    Авторизація
                </h1>
                <form
                    onSubmit={onSubmit}
                    className='flex w-[19.5rem] flex-col gap-4 sm:w-[24rem] lg:w-[32rem]'
                >
                    <div className='flex flex-col'>
                        <label className='text-left'>Пошта</label>
                        <Input
                            required
                            name='email'
                            type='email'
                            value={form.email}
                            onChange={onFieldChange}
                            placeholder='Введіть Вашу пошту'
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label className='text-left'>Пароль</label>
                        <Password
                            required
                            name='password'
                            value={form.password}
                            onChange={onFieldChange}
                            placeholder='Введіть Ваш пароль'
                        />
                    </div>
                    <div className='flex-row-[24rem] flex'>
                        <Checkbox
                            label={"Запам'ятати мене"}
                            name='rememberMe'
                            checked={form.rememberMe}
                            onChange={onCheckboxFieldChange}
                        />
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
        </div>
    )
}

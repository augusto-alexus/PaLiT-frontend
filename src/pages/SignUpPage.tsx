import { Link } from 'react-router-dom'
import { ISignUpForm, useSignUp } from '~/backend'
import { Button, Logo, WithNulpBg } from '~/components'
import { routes } from '~/pages'
import { useForm } from '~/hooks'

export function SignUpPage() {
    const signUp = useSignUp()
    const [form, onFieldChange, onSubmit] = useForm<ISignUpForm>(
        {
            fullName: '',
            faculty: '',
            group: '',
            gradYear: '',
            gradLevel: '',
            password: '',
            confirmPassword: '',
        },
        signUp
    )

    return (
        <>
            <WithNulpBg />
            <main className='center flex h-full flex-col items-center justify-center gap-12'>
                <div className='place-self-center'>
                    <Logo />
                </div>
                <h1>Реєстрація</h1>
                <form
                    onSubmit={onSubmit}
                    className='flex max-w-fit flex-col justify-center gap-4 rounded-2xl bg-white px-8 py-16 drop-shadow-2xl dark:bg-neutral-950 sm:px-20 sm:py-24 md:px-[25vw] md:py-32 lg:px-64'
                >
                    <div className='flex w-[19.5rem] flex-col sm:w-[24rem]'>
                        <label className='text-left'>ПІП</label>
                        <input
                            required
                            name='fullName'
                            type='text'
                            value={form.fullName}
                            onChange={onFieldChange}
                            placeholder='Введіть Ваше ПІП'
                            className='rounded-md border-2 border-[#646cff77] bg-inherit px-4 py-2 focus:border-[#646cffbb]'
                        />
                    </div>
                    <div className='flex w-[19.5rem] flex-col sm:w-[24rem]'>
                        <label className='text-left'>Факультет</label>
                        <input
                            required
                            name={'faculty'}
                            type='text'
                            value={form.faculty}
                            onChange={onFieldChange}
                            placeholder='Назва факультету'
                            className='rounded-md border-2 border-[#646cff77] bg-inherit px-4 py-2 focus:border-[#646cffbb]'
                        />
                    </div>
                    <div className='flex w-[19.5rem] flex-col sm:w-[24rem]'>
                        <label className='text-left'>Група</label>
                        <input
                            required
                            name='group'
                            type='text'
                            value={form.group}
                            onChange={onFieldChange}
                            placeholder='Номер групи'
                            className='rounded-md border-2 border-[#646cff77] bg-inherit px-4 py-2 focus:border-[#646cffbb]'
                        />
                    </div>
                    <div className='flex w-[19.5rem] flex-col sm:w-[24rem]'>
                        <label className='text-left'>Рік випуску</label>
                        <input
                            required
                            name='gradYear'
                            type='text'
                            value={form.gradYear}
                            onChange={onFieldChange}
                            placeholder='Введіть Ваш рік випуску'
                            className='rounded-md border-2 border-[#646cff77] bg-inherit px-4 py-2 focus:border-[#646cffbb]'
                        />
                    </div>
                    <div className='flex w-[19.5rem] flex-col sm:w-[24rem]'>
                        <label className='text-left'>Освітній ступінь</label>
                        <select
                            required
                            name='gradLevel'
                            value={form.gradLevel}
                            onChange={onFieldChange}
                            className='rounded-md border-2 border-[#646cff77] bg-inherit px-4 py-2 focus:border-[#646cffbb]'
                        >
                            <option disabled hidden value=''>
                                Виберіть Ваш освітній ступінь
                            </option>
                            <option value='bachelor'>Бакалавр</option>
                            <option value='master'>Магістр</option>
                        </select>
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
                    <div className='flex w-[19.5rem] flex-col sm:w-[24rem]'>
                        <label className='text-left'>
                            Підтвердження паролю
                        </label>
                        <input
                            required
                            name='confirmPassword'
                            type='password'
                            value={form.confirmPassword}
                            onChange={onFieldChange}
                            placeholder='Підтвердіть Ваш пароль'
                            className='rounded-md border-2 border-[#646cff77] bg-inherit px-4 py-2 focus:border-[#646cffbb]'
                        />
                    </div>
                    <Button>Реєстрація</Button>
                    <div className='self-start'>
                        Уже зареєстровані?
                        <Link to={routes.signIn} className='ml-4'>
                            Увійти
                        </Link>
                    </div>
                </form>
            </main>
        </>
    )
}

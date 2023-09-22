import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ISignUpForm, useSignUp } from '~/backend'
import {
    Button,
    Input,
    Logo,
    Password,
    Select,
    Toggle,
    WithNulpBg,
} from '~/components'
import { useForm } from '~/hooks'
import { routes } from '~/pages'

export function SignUp() {
    const navigate = useNavigate()
    const { form, onFieldChange, onCheckboxFieldChange, onSubmit } =
        useForm<ISignUpForm>(
            {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                isStudent: false,
                faculty: '',
                group: '',
                gradYear: '',
                gradLevel: '',
            },
            useSignUp(() => {
                setTimeout(() => {
                    toast.dismiss()
                    navigate(routes.signIn)
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
                <h1 className='text-center font-[Montserrat] text-2xl font-bold text-cs-text-dark'>
                    Реєстрація
                </h1>
                <form
                    onSubmit={onSubmit}
                    className='flex w-[19.5rem] flex-col gap-4 sm:w-[24rem] lg:w-[32rem]'
                >
                    <div className='flex flex-col'>
                        <label className='text-left'>Прізвище</label>
                        <Input
                            required
                            name='lastName'
                            type='text'
                            value={form.lastName}
                            onChange={onFieldChange}
                            placeholder='Введіть Ваше призвіще'
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label className='text-left'>Ім'я</label>
                        <Input
                            required
                            name='firstName'
                            type='text'
                            value={form.firstName}
                            onChange={onFieldChange}
                            placeholder="Введіть Ваше ім'я"
                        />
                    </div>
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
                            type='password'
                            value={form.password}
                            onChange={onFieldChange}
                            placeholder='Введіть Ваш пароль'
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label className='text-left'>
                            Підтвердження паролю
                        </label>
                        <Password
                            required
                            name='confirmPassword'
                            type='password'
                            value={form.confirmPassword}
                            onChange={onFieldChange}
                            placeholder='Підтвердіть Ваш пароль'
                        />
                    </div>
                    <div className='flex flex-col'>
                        <Toggle
                            name='isStudent'
                            checked={form.isStudent}
                            onChange={onCheckboxFieldChange}
                            label='Зареєструватися як студент'
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label hidden={!form.isStudent} className='text-left'>
                            Факультет
                        </label>
                        <Input
                            hidden={!form.isStudent}
                            required={form.isStudent}
                            name={'faculty'}
                            type='text'
                            value={form.faculty}
                            onChange={onFieldChange}
                            placeholder='Назва факультету'
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label hidden={!form.isStudent} className='text-left'>
                            Група
                        </label>
                        <Input
                            hidden={!form.isStudent}
                            required={form.isStudent}
                            name='group'
                            type='text'
                            value={form.group}
                            onChange={onFieldChange}
                            placeholder='Номер групи'
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label hidden={!form.isStudent} className='text-left'>
                            Рік випуску
                        </label>
                        <Input
                            hidden={!form.isStudent}
                            required={form.isStudent}
                            name='gradYear'
                            type='date'
                            value={form.gradYear}
                            onChange={onFieldChange}
                            placeholder='Введіть Ваш рік випуску'
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label hidden={!form.isStudent} className='text-left'>
                            Освітній ступінь
                        </label>
                        <Select
                            hidden={!form.isStudent}
                            required={form.isStudent}
                            name='gradLevel'
                            value={form.gradLevel}
                            onChange={onFieldChange}
                        >
                            <option disabled hidden value=''>
                                Виберіть Ваш освітній ступінь
                            </option>
                            <option value='bachelor'>Бакалавр</option>
                            <option value='master'>Магістр</option>
                        </Select>
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
        </div>
    )
}

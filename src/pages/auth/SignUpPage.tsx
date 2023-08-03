import { Link } from 'react-router-dom'
import { pageRoutes } from '../index.tsx'
import { useState } from 'react'

interface ISignUpForm {
  fullName: string
  faculty: string
  group: string
  gradYear: string
  gradLevel: string
  password: string
  confirmPassword: string
}

function handleSignUp(form: ISignUpForm) {
  alert(JSON.stringify(form, undefined, 2))
}

function SignUpPage() {
  const [form, setForm] = useState<ISignUpForm>({
    fullName: '',
    faculty: '',
    group: '',
    gradYear: '',
    gradLevel: '',
    password: '',
    confirmPassword: '',
  })

  return (
    <main className='center flex h-full flex-col items-center justify-center gap-12'>
      <span className='text-center'>TODO "Thesis Tracker" logo</span>
      <form
        onSubmit={(e) => {
          handleSignUp(form)
          e.preventDefault()
        }}
        className='flex max-w-fit flex-col justify-center gap-4 rounded-2xl bg-white px-8 py-16 drop-shadow-2xl dark:bg-neutral-950 sm:px-20 sm:py-24 md:px-[25vw] md:py-32 lg:px-64'
      >
        <div className='flex w-[19.5rem] flex-col sm:w-[24rem]'>
          <label className='text-left'>ПІП</label>
          <input
            required
            type='text'
            value={form.fullName}
            onChange={(e) =>
              setForm((v) => ({ ...v, fullName: e.target.value }))
            }
            placeholder='Введіть Ваше ПІП'
            className='rounded-md border-2 border-[#646cff77] bg-inherit px-4 py-2 focus:border-[#646cffbb]'
          />
        </div>
        <div className='flex w-[19.5rem] flex-col sm:w-[24rem]'>
          <label className='text-left'>Факультет</label>
          <input
            required
            type='text'
            value={form.faculty}
            onChange={(e) =>
              setForm((v) => ({ ...v, faculty: e.target.value }))
            }
            placeholder='Назва факультету'
            className='rounded-md border-2 border-[#646cff77] bg-inherit px-4 py-2 focus:border-[#646cffbb]'
          />
        </div>
        <div className='flex w-[19.5rem] flex-col sm:w-[24rem]'>
          <label className='text-left'>Група</label>
          <input
            required
            type='text'
            value={form.group}
            onChange={(e) => setForm((v) => ({ ...v, group: e.target.value }))}
            placeholder='Номер групи'
            className='rounded-md border-2 border-[#646cff77] bg-inherit px-4 py-2 focus:border-[#646cffbb]'
          />
        </div>
        <div className='flex w-[19.5rem] flex-col sm:w-[24rem]'>
          <label className='text-left'>Рік випуску</label>
          <input
            required
            type='text'
            value={form.gradYear}
            onChange={(e) =>
              setForm((v) => ({ ...v, gradYear: e.target.value }))
            }
            placeholder='Введіть Ваш рік випуску'
            className='rounded-md border-2 border-[#646cff77] bg-inherit px-4 py-2 focus:border-[#646cffbb]'
          />
        </div>
        <div className='flex w-[19.5rem] flex-col sm:w-[24rem]'>
          <label className='text-left'>Освітній ступінь</label>
          <select
            required
            value={form.gradLevel}
            onChange={(e) =>
              setForm((v) => ({ ...v, gradLevel: e.target.value }))
            }
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
            type='password'
            value={form.password}
            onChange={(e) =>
              setForm((v) => ({ ...v, password: e.target.value }))
            }
            placeholder='Введіть Ваш пароль'
            className='rounded-md border-2 border-[#646cff77] bg-inherit px-4 py-2 focus:border-red-300'
          />
        </div>
        <div className='flex w-[19.5rem] flex-col sm:w-[24rem]'>
          <label className='text-left'>Підтвердження паролю</label>
          <input
            required
            type='password'
            value={form.confirmPassword}
            onChange={(e) =>
              setForm((v) => ({ ...v, confirmPassword: e.target.value }))
            }
            placeholder='Підтвердіть Ваш пароль'
            className='rounded-md border-2 border-[#646cff77] bg-inherit px-4 py-2 focus:border-[#646cffbb]'
          />
        </div>
        <button
          type='submit'
          className='mt-4 bg-[#646cff] text-white dark:text-inherit'
        >
          Реєстрація
        </button>
        <div className='self-start'>
          Уже зареєстровані?
          <Link to={pageRoutes.auth.login} className='ml-4'>
            Увійти
          </Link>
        </div>
      </form>
    </main>
  )
}

export default SignUpPage

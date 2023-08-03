import { useState } from 'react'
import { Link } from 'react-router-dom'
import { pageRoutes } from '../index.tsx'

interface ISignInForm {
  fullName: string
  password: string
  rememberMe: boolean
}

function handleSignIn(form: ISignInForm) {
  alert(JSON.stringify(form, undefined, 2))
}

function SignInPage() {
  const [form, setForm] = useState<ISignInForm>({
    fullName: '',
    password: '',
    rememberMe: false,
  })

  return (
    <main className='center flex h-full flex-col items-center justify-center gap-12'>
      <span className='text-center'>TODO "Thesis Tracker" logo</span>
      <form
        onSubmit={(e) => {
          handleSignIn(form)
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
        <div className='flex w-[19.5rem] flex-row gap-2 sm:w-[24rem]'>
          <input
            type='checkbox'
            checked={form.rememberMe}
            onChange={(e) =>
              setForm((v) => ({ ...v, rememberMe: e.target.checked }))
            }
            className='rounded-none'
          />
          <label className='text-left'>Запам'ятати мене</label>
        </div>
        <button
          type='submit'
          className='mt-16 bg-[#646cff] text-white dark:text-inherit sm:w-[24rem]'
        >
          Авторизація
        </button>
        <div className='self-start'>
          Ще не зареєстровані?
          <Link to={pageRoutes.auth.register} className='ml-4'>
            Реєстрація
          </Link>
        </div>
      </form>
    </main>
  )
}

export default SignInPage

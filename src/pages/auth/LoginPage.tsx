import { Link } from 'react-router-dom'
import { pageRoutes } from '../index.tsx'

function LoginPage() {
  return (
    <div className='flex flex-col gap-12'>
      <span>TODO "Thesis Tracker" logo</span>
      <form className='flex flex-col justify-center gap-4 rounded-2xl bg-white px-8 py-32 drop-shadow-2xl dark:bg-neutral-950 sm:px-20 md:px-[25vw] lg:px-64'>
        <div className='flex min-w-[40rem] flex-col'>
          <label className='text-left'>ПІП</label>
          <input
            required
            className='rounded-md border-2 border-[#646cff77] bg-inherit px-4 py-2 focus:border-[#646cffbb]'
            type='text'
            placeholder='Введіть Ваше ПІП'
          />
        </div>
        <div className='flex min-w-[40rem] flex-col'>
          <label className='text-left'>Пароль</label>
          <input
            required
            className='rounded-md border-2 border-[#646cff77] bg-inherit px-4 py-2 focus:border-red-300'
            type='password'
            placeholder='Введіть Ваш пароль'
          />
        </div>
        <div className='flex min-w-[40rem] flex-row gap-2'>
          <input className='rounded-none' required type='checkbox' />
          <label className='text-left'>Запам'ятати мене</label>
        </div>
        <button
          className='mt-16 bg-[#646cff] text-white dark:text-inherit'
          type='submit'
          onClick={() => alert('TODO submit')}
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
    </div>
  )
}

export default LoginPage

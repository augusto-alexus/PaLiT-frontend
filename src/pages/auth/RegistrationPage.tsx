import { Link } from 'react-router-dom'
import { pageRoutes } from '../index.tsx'

function RegistrationPage() {
  return (
    <div className='flex flex-col gap-12'>
      <span>TODO "Thesis Tracker" logo</span>
      <form className='flex flex-col justify-center gap-4 rounded-2xl bg-white px-8 py-20 drop-shadow-2xl dark:bg-neutral-950 sm:px-20 md:px-[25vw] lg:px-64'>
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
          <label className='text-left'>Факультет</label>
          <input
            required
            className='rounded-md border-2 border-[#646cff77] bg-inherit px-4 py-2 focus:border-[#646cffbb]'
            type='text'
            placeholder='Назва факультету'
          />
        </div>
        <div className='flex min-w-[40rem] flex-col'>
          <label className='text-left'>Група</label>
          <input
            required
            className='rounded-md border-2 border-[#646cff77] bg-inherit px-4 py-2 focus:border-[#646cffbb]'
            type='text'
            placeholder='Номер групи'
          />
        </div>
        <div className='flex min-w-[40rem] flex-col'>
          <label className='text-left'>Рік випуску</label>
          <input
            required
            className='rounded-md border-2 border-[#646cff77] bg-inherit px-4 py-2 focus:border-[#646cffbb]'
            type='text'
            placeholder='Введіть Ваш рік випуску'
          />
        </div>
        <div className='flex min-w-[40rem] flex-col'>
          <label className='text-left'>Освітній ступінь</label>
          <select
            required
            className='rounded-md border-2 border-[#646cff77] bg-inherit px-4 py-2 focus:border-[#646cffbb]'
            defaultValue=''
          >
            <option disabled hidden value=''>
              Виберіть Ваш освітній ступінь
            </option>
            <option>Бакалавр</option>
            <option>Магістр</option>
          </select>
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
        <div className='flex min-w-[40rem] flex-col'>
          <label className='text-left'>Підтвердження паролю</label>
          <input
            required
            className='rounded-md border-2 border-[#646cff77] bg-inherit px-4 py-2 focus:border-[#646cffbb]'
            type='password'
            placeholder='Підтвердіть Ваш пароль'
          />
        </div>
        <button
          className='mt-4 bg-[#646cff] text-white dark:text-inherit'
          type='submit'
          onClick={() => alert('TODO submit')}
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
    </div>
  )
}

export default RegistrationPage

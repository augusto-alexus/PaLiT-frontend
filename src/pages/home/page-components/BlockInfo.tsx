import { InfoRow } from './InfoRow'
import { useAuthStore } from '~/store/authStore.ts'

export function BlockInfo() {
    const authStore = useAuthStore()
    return (
        <div className='flex flex-col gap-2 border-l-2 px-6'>
            <InfoRow
                infoKey='Студент'
                value={
                    authStore.currentUser?.lastName +
                    ' ' +
                    authStore.currentUser?.firstName
                }
            />
            <InfoRow
                infoKey='Куратор'
                value='Мочурад Г. Г.'
                editable
                createPrompt='Вибрати куратора'
                iconR={
                    <a
                        onClick={() => alert('Змінити куратора')}
                        className='ri-edit-line cursor-pointer text-cs-text-dark'
                    />
                }
            />
            <InfoRow
                infoKey='Мова'
                value='Українська'
                editable
                createPrompt='Вибрати мову'
                iconR={
                    <a
                        onClick={() => alert('Змінити мову')}
                        className='ri-edit-line cursor-pointer text-cs-text-dark'
                    />
                }
            />
            <InfoRow
                infoKey='Тема'
                value='“Програмний модуль системи управління подіями кібербезпеки”'
                editable
                createPrompt='Вибрати тему'
                iconR={
                    <a
                        onClick={() => alert('Вибрати тему')}
                        className='ri-edit-line cursor-pointer text-cs-text-dark'
                    />
                }
            />
            <InfoRow
                infoKey='Статус'
                value='Етап 1'
                iconL={
                    <div className='mr-1 h-6 w-6 rounded-[5px] bg-cs-additional-green text-center text-cs-text-light'>
                        <i className='ri-check-fill'></i>
                    </div>
                }
            />
        </div>
    )
}

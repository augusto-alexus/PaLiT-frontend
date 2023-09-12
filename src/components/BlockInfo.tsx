import { InfoRow } from './InfoRow.tsx'
import { useAuthStore } from '~/store/authStore.ts'

export function BlockInfo() {
    const authStore = useAuthStore()
    return (
        <div className='flex flex-col gap-2 border-l-2 px-6'>
            <InfoRow
                infoKey='ПІ'
                value={
                    authStore.currentUser?.lastName +
                    ' ' +
                    authStore.currentUser?.firstName
                }
            />
            <InfoRow
                infoKey='Куратор'
                editable
                createPrompt='Вибрати куратора'
                iconR={
                    <a
                        onClick={() => alert('Змінити куратора')}
                        className='ri-more-2-fill cursor-pointer text-cs-text-dark'
                    />
                }
            />
            <InfoRow infoKey='Мова' editable createPrompt='Вибрати мову' />
            <InfoRow
                infoKey='Тема'
                value='“Програмний модуль системи управління подіями кібербезпеки”'
                editable
                createPrompt='Вибрати тему'
            />
            <InfoRow
                infoKey='Статус'
                value='Етап 3'
                iconL={
                    <div className='mr-1 h-6 w-6 rounded-[5px] bg-cs-additional-green text-center text-cs-text-light'>
                        <i className='ri-check-fill'></i>
                    </div>
                }
            />
        </div>
    )
}

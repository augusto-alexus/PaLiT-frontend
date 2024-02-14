import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useCurrentUser, useMakeComment } from '~/hooks'
import { Avatar, Button, TextArea } from '~/components'

export function CommentInput({
    documentId,
    userId,
    options,
}: {
    documentId: string
    userId: string
    options?: {
        useVerticalLayout?: boolean
        hideAvatar?: boolean
    }
}) {
    const { t } = useTranslation()
    const currentUser = useCurrentUser()
    const [comment, setComment] = useState<string>('')
    const { mutate: makeComment } = useMakeComment()

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                makeComment({ documentId, userId, comment })
                setComment('')
            }}
            className={`flex ${options?.useVerticalLayout ? 'flex-col' : 'flex-row'} place-items-start gap-4`}
        >
            {!options?.hideAvatar && (
                <Avatar firstName={currentUser.firstName} lastName={currentUser.lastName} bgColor={'bg-cs-primary'} />
            )}
            <TextArea
                required
                name='comment'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t('yourComment') + '...'}
            />
            <Button preset='filled' type='submit'>
                {t('send')}
            </Button>
        </form>
    )
}

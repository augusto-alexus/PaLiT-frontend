import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Avatar, Button, DisplayError, Loading, TextArea } from '~/components'
import { useMakeComment, useTeamInfo } from '~/hooks'

export function CommentInput({ documentId }: { documentId: number }) {
    const { t } = useTranslation()
    const [comment, setComment] = useState<string>('')
    const { mutate: makeComment } = useMakeComment()
    const { isLoading, teacher, student } = useTeamInfo()
    if (isLoading) return <Loading />
    const studentId = student.studentId
    const teacherId = teacher.teacherId
    if (!studentId || !teacherId)
        return (
            <DisplayError
                error={new Error('studentId or teacherId is undefined')}
            />
        )

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                makeComment({ documentId, studentId, teacherId, comment })
                setComment('')
            }}
            className='flex flex-row place-items-start gap-4'
        >
            <Avatar />
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

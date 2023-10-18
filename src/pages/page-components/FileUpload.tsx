import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { uploadDocument } from '~/backend/file.ts'
import { toast } from '~/components/toast.ts'
import { useAccessToken } from '~/hooks'
import { useCurrentUser } from '~/hooks/useCurrentUser.ts'
import { getReadableFileSize } from '~/lib/files.ts'

export function FileUpload() {
    const { t } = useTranslation()
    const accessToken = useAccessToken()
    const currentUser = useCurrentUser()
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async ({
            studentId,
            file,
        }: {
            studentId: number
            file: File
        }) => uploadDocument(accessToken, studentId, file),
        onSuccess: async (data) => {
            if ('status' in data) {
                if (data.status === 409)
                    toast(`${t('error.previousFileNotReviewed')}!`)
                else toast(`${t('error.unknownError')}!`)
                return
            }
            await queryClient.invalidateQueries([
                'studentDocuments',
                currentUser.id,
            ])
            setFile(null)
            toast(`${t('fileUploadedSuccessfully')}!`)
        },
    })
    const [file, setFile] = useState<File | null>(null)

    return (
        <div className='flex flex-col place-items-center gap-16'>
            <div>
                <label
                    htmlFor='upload-document'
                    className={`block w-fit cursor-pointer rounded-md bg-cs-primary px-6 py-2 text-lg font-semibold text-cs-text-light`}
                    onClick={(e) => {
                        if (file) {
                            e.preventDefault()
                            if (!currentUser.studentId)
                                throw new Error(
                                    "Couldn't upload file: studentId not found."
                                )
                            mutation.mutate({
                                studentId: currentUser.studentId,
                                file,
                            })
                        }
                    }}
                >
                    {file ? t('confirmUploadWork') : t('uploadWork')}
                </label>
                <input
                    id='upload-document'
                    type='file'
                    className='hidden'
                    disabled={!!file}
                    onChange={(e) => {
                        if (e.target.files === null) return
                        setFile(e.target.files[0])
                    }}
                />
            </div>
            {!!file && (
                <div className='max-w-lg text-cs-text-dark'>
                    <i className='font-mono'>{file.name}</i>
                    <b> ({getReadableFileSize(file.size)})</b>
                </div>
            )}
        </div>
    )
}

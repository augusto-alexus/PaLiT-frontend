import { useState } from 'react'
import { useUploadDocument } from '~/backend/file'
import { useAuthStore } from '~/store/authStore.ts'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type sizeUnit = 'Bi' | 'KBi' | 'MBi' | 'GBi'

function getNextSizeUnit(unit: sizeUnit) {
    if (unit === 'Bi') return 'KBi'
    if (unit === 'KBi') return 'MBi'
    if (unit === 'MBi') return 'GBi'
    throw new Error(`No size unit larger then '${unit}' is defined.`)
}

function getReadableFileSize(size: number, unit: sizeUnit = 'Bi') {
    if (size < 1024 && unit != 'GBi') return `${size.toFixed(2)} ${unit}`
    return getReadableFileSize(size / 1024, getNextSizeUnit(unit))
}

export function FileInput() {
    const authStore = useAuthStore()
    const uploadDocument = useUploadDocument()
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async ({
            studentId,
            file,
        }: {
            studentId: string
            file: File
        }) => uploadDocument(studentId, file),
        onSuccess: () => {
            queryClient
                .invalidateQueries([
                    'studentDocuments',
                    authStore.currentUser?.studentDTO?.studentId || '???',
                ])
                .then((_) => _)
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
                        if (!!file) {
                            e.preventDefault()
                            if (!authStore.currentUser?.studentDTO?.studentId)
                                throw new Error(
                                    "Couldn't upload file: studentId not found."
                                )
                            mutation.mutate({
                                studentId:
                                    authStore.currentUser.studentDTO.studentId,
                                file,
                            })
                        }
                    }}
                >
                    {!!file ? 'Підтвердити завантаження' : 'Завантажити роботу'}
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

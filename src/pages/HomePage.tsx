import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileList, Header, BodyInfo } from '~/components'
import { routes } from '~/pages/routes.ts'
import { useAuthStore } from '~/store/authStore.ts'
import { useCurrentUser } from '~/backend/useCurrentUser.ts'
import { useUploadDocument } from '~/backend/file'

export function HomePage() {
    const uploadDocument = useUploadDocument()
    const [file, setFile] = useState<File | null>(null)
    const navigate = useNavigate()
    const authStore = useAuthStore()
    const currentUser = useCurrentUser((userData) =>
        authStore.setCurrentUser(userData)
    )

    useEffect(() => {
        if (authStore.accessToken === null) {
            navigate(routes.signIn)
        } else {
            currentUser(authStore.accessToken)
        }
    }, [authStore.accessToken])

    return (
        <>
            <Header />
            <BodyInfo>
                <h1>User info</h1>
                <h2>Access token: {authStore.accessToken}</h2>
                <ul>
                    <li>
                        firstName: {authStore.currentUser?.firstName ?? '???'}
                    </li>
                    <li>
                        lastName: {authStore.currentUser?.lastName ?? '???'}
                    </li>
                    <li>email: {authStore.currentUser?.email ?? '???'}</li>
                    <li>userId: {authStore.currentUser?.userId ?? '???'}</li>
                    <li>
                        studentId:{' '}
                        {authStore.currentUser?.studentDTO?.studentId ?? '???'}
                    </li>
                    <li>
                        degree:{' '}
                        {authStore.currentUser?.studentDTO?.degree ?? '???'}
                    </li>
                    <li>
                        role.name:{' '}
                        {authStore.currentUser?.roleDTO?.name ?? '???'}
                    </li>
                </ul>
                <button onClick={authStore.reset}>Reset token (log out)</button>

                <input
                    type='file'
                    onChange={(e) => {
                        if (e.target.files === null) return
                        setFile(e.target.files[0])
                    }}
                />
                {!!file && (
                    <>
                        <div className='text-4xl uppercase text-red-500'>
                            File present
                        </div>
                        <button
                            onClick={() => {
                                if (authStore.currentUser !== null) {
                                    uploadDocument(
                                        authStore.currentUser.studentDTO
                                            .studentId,
                                        file
                                    )
                                }
                            }}
                        >
                            Upload
                        </button>
                    </>
                )}
                <FileList />
            </BodyInfo>
        </>
    )
}

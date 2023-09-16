import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    FileList,
    Header,
    BodyInfo,
    FileInput,
    DocumentPreview,
} from '~/components'
import { routes } from '~/pages/routes.ts'
import { useAuthStore } from '~/store/authStore.ts'
import { useCurrentUser } from '~/backend/useCurrentUser.ts'

export function HomePage() {
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
                <div className='my-24 w-full'>
                    <FileList />
                </div>
                <div className='flex w-full place-content-center'>
                    <FileInput />
                </div>
                <DocumentPreview />
            </BodyInfo>
        </>
    )
}

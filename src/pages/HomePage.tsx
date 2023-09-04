import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
        <main>
            <h1>User info</h1>
            <h2>Access token: {authStore.accessToken}</h2>
            <ul>
                <li>firstName: {authStore.currentUser?.firstName ?? '???'}</li>
                <li>lastName: {authStore.currentUser?.lastName ?? '???'}</li>
                <li>email: {authStore.currentUser?.email ?? '???'}</li>
                <li>password: {authStore.currentUser?.password ?? '???'}</li>
                <li>id: {authStore.currentUser?.id ?? '???'}</li>
                <li>userId: {authStore.currentUser?.userId ?? '???'}</li>
                <li>role.id: {authStore.currentUser?.role?.id ?? '???'}</li>
                <li>role.name: {authStore.currentUser?.role?.name ?? '???'}</li>
                <li>
                    role.roleId: {authStore.currentUser?.role?.roleId ?? '???'}
                </li>
            </ul>
            <button onClick={authStore.reset}>Reset token (log out)</button>
        </main>
    )
}

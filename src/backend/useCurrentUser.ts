import axios from 'axios'
import { toast } from '~/components'
import { endpoints } from './endpoints'

export function useCurrentUser(onSuccess?: () => void) {
    return (accessToken: string) => {
        axios
            .get(endpoints.currentUser, {
                data: {
                    user: accessToken,
                },
                headers: {
                    Authorization: `bearer ${accessToken}`,
                },
            })
            .then(({ data }) => {
                console.log(data)
                onSuccess?.()
            })
            .catch((err) => {
                toast(`Error! ${err}`)
            })
    }
}

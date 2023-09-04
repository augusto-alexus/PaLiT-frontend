import { toast as toastify_toast } from 'react-toastify'

export function toast(label: string) {
    toastify_toast(label, {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
    })
}

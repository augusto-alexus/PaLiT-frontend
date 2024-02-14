import { toast as toastify_toast } from 'react-toastify'

export function toast(label: string, autoClose: number = 1500) {
    toastify_toast(label, {
        position: 'top-right',
        autoClose,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
    })
}

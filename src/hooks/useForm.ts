import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from 'react'

export function useForm<T extends object>(
    defaultState: T,
    query: (form: T) => void,
): {
    form: T
    setForm: Dispatch<SetStateAction<T>>,
    onFieldChange: (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => void
    onCheckboxFieldChange: (e: ChangeEvent<HTMLInputElement>) => void
    onSubmit: (e: FormEvent<HTMLFormElement>) => void
} {
    const [form, setForm] = useState<T>(defaultState)

    const onFieldChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        setForm((v) => ({
            ...v,
            [e.target.name]: e.target.value,
        }))
    }

    const onCheckboxFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm((v) => ({
            ...v,
            [e.target.name]: e.target.checked,
        }))
    }

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        query(form)
    }

    return { form, setForm, onFieldChange, onCheckboxFieldChange, onSubmit }
}

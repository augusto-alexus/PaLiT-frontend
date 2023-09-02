import { ChangeEvent, FormEvent, useState } from 'react'

export function useForm<T extends Object>(
    defaultState: T,
    query: (form: T) => any
): [
    T,
    (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => void,
    (e: FormEvent<HTMLFormElement>) => void
] {
    const [formState, setFormState] = useState<T>(defaultState)

    const onFieldChange = (
        e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
    ) => {
        setFormState((v) => ({
            ...v,
            [e.target.name]: e.target.value,
        }))
    }

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        query(formState)
    }

    return [formState, onFieldChange, onSubmit]
}

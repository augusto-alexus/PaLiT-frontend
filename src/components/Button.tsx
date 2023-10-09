import { ButtonHTMLAttributes, ReactElement } from 'react'

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    preset?: 'filled' | 'outlined' | 'text' | 'icon'
    icon?: ReactElement
}

export function Button({
    preset = 'filled',
    icon,
    className,
    ...props
}: IButtonProps) {
    const stylesRaw: string[] = []
    if (props.disabled)
        stylesRaw.push(
            `${
                preset === 'filled'
                    ? 'bg-cs-disabled hover:bg-cs-disabled focus:bg-cs-disabled'
                    : 'bg-transparent'
            } ${preset === 'filled' ? 'text-white' : 'text-cs-disabled'} ${
                preset === 'outlined'
                    ? 'border-1 border-cs-disabled hover:border-cs-disabled focus:border-cs-disabled'
                    : ''
            }`
        )
    else if (preset === 'filled')
        stylesRaw.push(
            'bg-cs-primary text-white hover:bg-cs-accent-blue focus:bg-cs-accent-blue'
        )
    else if (preset === 'outlined')
        stylesRaw.push(
            'bg-transparent text-cs-primary border-cs-primary border-2 hover:text-cs-accent-blue hover:border-cs-accent-blue focus:text-cs-accent-blue focus:border-cs-accent-blue'
        )
    else if (preset === 'text')
        stylesRaw.push(
            'bg-transparent border-0 text-cs-primary hover:text-cs-secondary focus:text-cs-secondary hover:underline focus:underline'
        )
    else if (preset === 'icon') stylesRaw.push('bg-transparent border-0')

    if (className) stylesRaw.push(className)

    return (
        <button className={stylesRaw.join(' ')} {...props}>
            {preset === 'icon' ? icon : props.children}
        </button>
    )
}

interface IIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isActive?: boolean
}

export function IconButton({
    className,
    isActive,
    ...props
}: IIconButtonProps) {
    return (
        <button
            className={`${
                isActive ? 'text-cs-secondary' : 'text-cs-text-dark'
            } rounded-full border-none bg-transparent bg-opacity-50 px-2 py-1 outline-none hover:bg-cs-bg-neutral hover:text-cs-secondary focus:bg-cs-bg-neutral focus:text-cs-secondary ${
                className ?? ''
            }`}
            {...props}
        />
    )
}

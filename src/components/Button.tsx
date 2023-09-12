import { ButtonHTMLAttributes } from 'react'

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    preset?: 'filled' | 'outlined' | 'text'
    text?: string
    iconUrl?: string
    onClick?: () => void
}

export function Button({ preset = 'filled', ...props }: IButtonProps) {
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
            } dark:text-inherit dark:brightness-75 `
        )
    else if (preset === 'filled')
        stylesRaw.push(
            'bg-cs-primary text-white dark:text-inherit hover:bg-cs-accent-blue focus:bg-cs-accent-blue'
        )
    else if (preset === 'outlined')
        stylesRaw.push(
            'bg-transparent text-cs-primary border-cs-primary border-2 hover:text-cs-accent-blue hover:border-cs-accent-blue focus:text-cs-accent-blue focus:border-cs-accent-blue'
        )
    else if (preset === 'text')
        stylesRaw.push(
            'bg-transparent border-0 text-cs-primary hover:text-cs-secondary focus:text-cs-secondary hover:underline focus:underline'
        )

    return <button className={`${stylesRaw.join(' ')}`} {...props} />
}

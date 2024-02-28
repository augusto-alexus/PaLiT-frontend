import { InputHTMLAttributes, TextareaHTMLAttributes, useState } from 'react'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={`w-full rounded-md border border-cs-additional-gray bg-inherit px-4 py-2 text-cs-text-dark shadow hover:border-cs-secondary focus:border-cs-secondary focus:outline-none ${className}`}
            {...props}
        />
    )
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            className='scrollbar w-full rounded-md border border-cs-additional-gray bg-inherit px-4 py-2 text-cs-text-dark shadow hover:border-cs-secondary focus:border-cs-secondary focus:outline-none'
            {...props}
        />
    )
}

export function Password(props: InputHTMLAttributes<HTMLInputElement>) {
    const [isHidden, setIsHidden] = useState<boolean>(true)
    return (
        <div className='relative focus-within:border-cs-secondary focus-within:text-cs-text-dark focus-within:outline-none'>
            <Input type={isHidden ? 'password' : 'text'} {...props} />
            <button
                type='button'
                onClick={() => setIsHidden((v) => !v)}
                className='absolute right-4 top-1/2 -translate-y-1/2 border-0 bg-transparent p-0 text-xl text-cs-additional-gray hover:border hover:border-cs-secondary focus:border active:text-cs-text-dark'
            >
                {isHidden ? <i className='ri-eye-line'></i> : <i className='ri-eye-off-line'></i>}
            </button>
        </div>
    )
}

interface ICheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
}

export function Checkbox({ label, ...props }: ICheckboxProps) {
    return (
        <label className='text-left'>
            <input
                type='checkbox'
                className='mr-2 rounded-none border-2 border-[#646cff77] bg-inherit px-4 py-2 align-baseline focus:border-[#646cffbb]'
                {...props}
            />
            {label}
        </label>
    )
}

interface IToggleProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
}

export function Toggle({ label, ...props }: IToggleProps) {
    return (
        <div className='flex'>
            <input
                role='switch'
                type='checkbox'
                id='flexSwitchCheckDefault'
                className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-cs-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-cs-neutral checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-cs-primary checked:focus:bg-cs-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s]"
                {...props}
            />
            <label htmlFor='flexSwitchCheckDefault' className='inline-block pl-[0.15rem] hover:cursor-pointer'>
                {label}
            </label>
        </div>
    )
}

export function Select(props: InputHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            className='w-full rounded-md border border-cs-additional-gray bg-inherit px-4 py-2 text-cs-text-dark shadow hover:border-cs-secondary focus:border-cs-secondary focus:outline-none'
            {...props}
        />
    )
}

import { ReactElement } from 'react'

interface IInfoRowProps {
    infoKey: string
    value?: string
    editable?: boolean
    onEdit?: () => void
    iconL?: ReactElement
    iconR?: ReactElement
    createPrompt?: string
}

export function InfoRow({
    infoKey,
    value,
    editable,
    onEdit,
    createPrompt,
    iconL,
    iconR,
}: IInfoRowProps) {
    return (
        <div className='place- flex flex-row  content-center gap-4 bg-white py-2 text-cs-text-dark'>
            <div className='basis-4/12 font-mono'>{infoKey}</div>
            <div className='flex basis-7/12 flex-row'>
                {iconL}
                {value || '—'}
                {editable && !value && (
                    <a
                        onClick={onEdit}
                        className='ml-2 cursor-pointer text-cs-primary hover:text-cs-secondary'
                    >
                        ({createPrompt})
                    </a>
                )}
            </div>
            <div className='basis-1/12'>{iconR}</div>
        </div>
    )
}

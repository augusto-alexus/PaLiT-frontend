import { useState } from 'react'
import { Combobox as HuiCombobox, Label, Transition } from '@headlessui/react'
import { useTranslation } from 'react-i18next'

export function Combobox({
    options,
    label,
    placeholder,
    value,
    setValue,
    disabled,
}: {
    options?: IComboboxOption[]
    label?: string
    placeholder?: string
    value: string
    setValue: (v: string) => void
    disabled?: boolean
}) {
    const { t } = useTranslation()

    const [query, setQuery] = useState<string>('')
    const [uiValue, setUiValue] = useState<IComboboxOption>({
        id: value,
        label: options?.find((o) => o.id === value)?.label || '',
    })

    const filteredOptions =
        query === ''
            ? options
            : options?.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()) || o.id === value)

    return (
        <HuiCombobox
            immediate
            value={uiValue}
            onChange={(o) => {
                setValue(o.id)
                setUiValue(o)
            }}
            disabled={disabled}
        >
            <div className='grid grid-cols-3 place-content-center justify-between gap-2'>
                {label && <Label className='inline-flex place-items-center font-semibold'>{label}</Label>}
                <HuiCombobox.Input<IComboboxOption>
                    required
                    placeholder={placeholder}
                    onChange={(event) => setQuery(event.target.value)}
                    displayValue={(o) => o.label}
                    className='col-span-2 w-full rounded-md border border-cs-additional-gray bg-inherit px-4 py-2 text-cs-text-dark shadow hover:border-cs-secondary focus:border-cs-secondary focus:outline-none'
                />
                <Transition
                    enter='transition duration-200 ease-out'
                    enterFrom='transform scale-95 opacity-0'
                    enterTo='transform scale-100 opacity-100'
                    leave='transition duration-300 ease-out'
                    leaveFrom='transform scale-100 opacity-100'
                    leaveTo='transform scale-95 opacity-0'
                    className='col-span-2 col-start-2 w-full'
                >
                    <HuiCombobox.Options className='max-h-40 w-full overflow-y-auto rounded border-2 border-cs-primary'>
                        {!filteredOptions?.length && query !== '' && (
                            <HuiCombobox.Option disabled key={'not found'} value={null}>
                                {t('error.nothingFound')}
                            </HuiCombobox.Option>
                        )}
                        {filteredOptions?.map((o) => (
                            <HuiCombobox.Option
                                key={o.id}
                                value={o}
                                className='w-full border-b border-cs-disabled px-4 last:border-none hover:cursor-pointer hover:bg-cs-secondary'
                            >
                                {o.label}
                            </HuiCombobox.Option>
                        ))}
                    </HuiCombobox.Options>
                </Transition>
            </div>
        </HuiCombobox>
    )
}

export interface IComboboxOption {
    id: string
    label: string
}

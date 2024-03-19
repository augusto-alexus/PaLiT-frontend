export interface ITab {
    isActive: boolean
    label: string
    id: number
}

export function Tabs({ items, setItem }: { items: ITab[]; setItem: (id: number) => void }) {
    return (
        <div className='flex w-full flex-row justify-center gap-6'>
            {items.map((tab) => (
                <a
                    key={tab.id}
                    onClick={() => setItem(tab.id)}
                    className={
                        tab.isActive
                            ? 'cursor-default select-none text-cs-secondary underline underline-offset-8 outline-none hover:text-cs-secondary'
                            : 'cursor-pointer'
                    }
                >
                    {tab.label}
                </a>
            ))}
        </div>
    )
}

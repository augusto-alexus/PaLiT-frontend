import { ReactElement } from 'react'
import { Link } from 'react-router-dom'

export function Breadcrumbs({ items }: { items: IBreadcrumbsItem[] }) {
    if (!items) return <></>
    return (
        <ul className='las flex w-fit flex-row flex-nowrap overflow-x-clip '>
            {items.map((item, idx) => (
                <li key={idx} className='flex items-center border-e-2 border-cs-disabled px-2 last:border-0'>
                    <Link to={item.linkedTo}>{item.component}</Link>
                </li>
            ))}
        </ul>
    )
}

export interface IBreadcrumbsItem {
    component: ReactElement | string
    linkedTo: string
}

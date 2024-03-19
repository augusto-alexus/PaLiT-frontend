// idc and IDK how to deal with any here
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function Table<T extends Record<string, any>>({
    cols,
    rows,
    tooltipExtensions,
    options,
}: {
    cols: ITableHeader[]
    rows: T[]
    tooltipExtensions?: JSX.Element[]
    options?: {
        searchFn?: (a: T, query: string) => boolean
        sortFn?: (a: T, b: T) => number
    }
}) {
    const { t } = useTranslation()
    const [search, setSearch] = useState<string>('')
    if (cols.length === 0) return <></>

    const displayedRows = rows.filter((r) => options?.searchFn?.(r, search) ?? true)

    if (options?.sortFn) {
        displayedRows.sort(options.sortFn)
    }

    return (
        <div className='relative flex h-full w-full flex-col overflow-auto rounded-xl bg-white bg-clip-border text-gray-700 shadow-md'>
            {(!!tooltipExtensions?.length || !!options?.searchFn) && (
                <div className='grid grid-cols-3 p-4'>
                    {!!options?.searchFn && (
                        <div className='relative h-10 w-full min-w-[200px]'>
                            <div className='text-blue-gray-500 absolute right-3 grid h-5 w-5 translate-y-1/3 place-items-center'>
                                <i className='ri-search-line' />
                            </div>
                            <input
                                className='peer h-full w-full rounded-[7px] border border-gray-200 border-t-transparent bg-transparent px-3 py-2.5 !pr-9 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-gray-200 placeholder-shown:border-t-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-gray-50'
                                placeholder=' '
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <label className="before:content[' '] after:content[' '] pointer-events-none absolute -top-1.5 left-0 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mr-1 before:mt-[6.5px] before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-l before:border-t before:border-gray-200 before:transition-all after:pointer-events-none after:ml-1 after:mt-[6.5px] after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-r after:border-t after:border-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-l-2 peer-focus:before:border-t-2 peer-focus:before:!border-gray-900 peer-focus:after:border-r-2 peer-focus:after:border-t-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-gray-500">
                                {t('search')}
                            </label>
                        </div>
                    )}
                    {!!tooltipExtensions?.length && (
                        <div className='col-span-2 flex flex-row gap-4 place-self-center justify-self-end'>
                            {...tooltipExtensions}
                        </div>
                    )}
                </div>
            )}
            <table className='w-full min-w-max table-auto text-left'>
                <thead>
                    <tr className='border-b border-gray-100 bg-gray-100 p-4'>
                        {cols.map((h, idx) => (
                            <th key={idx} className={`border-b border-gray-100 bg-gray-50 p-4 ${h?.style ?? ''}`}>
                                <p className='block font-sans text-sm font-semibold leading-none text-gray-900 antialiased opacity-80'>
                                    {h.label}
                                </p>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {displayedRows.map((r, idx) => (
                        <tr key={idx}>
                            {cols.reduce((res, h, idx) => {
                                if (h.key in r) {
                                    res.push(
                                        <td key={idx} className='border-b border-gray-50 p-4'>
                                            <div className='block font-sans text-sm font-normal leading-normal text-gray-900 antialiased'>
                                                {r[h.key]}
                                            </div>
                                        </td>
                                    )
                                }
                                return res
                            }, [] as JSX.Element[])}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export interface ITableHeader {
    key: string
    label: string
    style?: string
}

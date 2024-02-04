// I have no idea how to avoid any here, and I don't care
export function Table<T extends Record<string, any>>({ cols, rows, options }: {
    cols: ITableHeader[],
    rows: T[],
    options?: {
        sortFn: (a: T, b: T) => number
    }
}) {
    if (cols.length === 0) return <></>

    const displayedRows = rows

    // const searchOption = options?.search
    // if (searchOption) {
    //     const col = headers.findIndex(h => h.label === searchOption.by)
    //     if (col !== -1) {
    //         displayedRows = displayedRows.filter(r => r.values?.[col]?.toLowerCase()?.includes(searchOption.query))
    //     }
    // }

    if (options?.sortFn) {
        displayedRows.sort(options.sortFn)
    }

    return <table className="table-fixed border-collapse">
        <thead>
        <tr>
            {cols.map((h, idx) => <th key={idx}
                                      className="border border-slate-600 text-lg text-left px-5 py-2">{h.label}</th>)}
        </tr>
        </thead>
        <tbody>
        {
            displayedRows.map((r, idx) => <tr key={idx}>
                {
                    cols.reduce((res, h, idx) => {
                        if (h.key in r) {
                            res.push(<td key={idx} className="border border-slate-500 px-5 py-2">
                                {r[h.key]}
                            </td>)
                        }
                        return res
                    }, [] as JSX.Element[])
                }
            </tr>)
        }
        </tbody>
    </table>
}

export interface ITableHeader {
    key: string
    label: string
}

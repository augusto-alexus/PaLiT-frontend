import { JSX } from 'react'

export function Accordion({ header, body, cls }: { header: JSX.Element; body: JSX.Element; cls?: string }) {
    return (
        <details className={`group${cls ? ' ' + cls : ''}`}>
            <summary className='items-centercursor-pointer flex list-none place-items-center justify-between'>
                {header}
                <span className='select-none transition group-open:rotate-180'>
                    <svg
                        fill='none'
                        height='24'
                        shapeRendering='geometricPrecision'
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='1.5'
                        viewBox='0 0 24 24'
                        width='24'
                    >
                        <path d='M6 9l6 6 6-6'></path>
                    </svg>
                </span>
            </summary>
            {body}
        </details>
    )
}

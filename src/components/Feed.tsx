import { ReactElement } from 'react'
import { getHumanReadableDuration } from '~/lib/date.ts'

interface IFeedElement {
    content: string | ReactElement
    iconL?: ReactElement
    date: Date
}

const feedSample: IFeedElement[] = [
    {
        content: 'Test feed #1',
        date: new Date('8/15/2023'),
    },
    {
        content: 'Test feed #2',
        date: new Date('9/10/2023'),
    },
    {
        content: (
            <div>
                <b>Augusto-alexus</b> approved this document.
            </div>
        ),
        date: new Date('9/13/2023'),
    },
    {
        content: 'Test feed #4',
        date: new Date('9/15/2023'),
    },
    {
        content: 'Test feed #5',
        date: new Date('9/17/2023'),
    },
    {
        content: 'Test feed #6',
        date: new Date('9/18/2023'),
    },
    {
        content: 'Test feed #6',
        date: new Date('9/18/2023'),
    },
    {
        content: 'Test feed #6',
        date: new Date('9/18/2023'),
    },
    {
        content: 'Test feed #6',
        date: new Date('9/18/2023'),
    },
    {
        content: 'Test feed #6',
        date: new Date('9/18/2023'),
    },
    {
        content: 'Test feed #6',
        date: new Date('9/18/2023'),
    },
    {
        content: 'Test feed #6',
        date: new Date('9/18/2023'),
    },
]

export function Feed() {
    return (
        <div className='border-l border-cs-additional-gray'>
            <div className='scrollbar -m-1 flex h-[350px] w-[640px] flex-col gap-4 overflow-y-scroll'>
                {feedSample.map((f, idx) => (
                    <div
                        key={`feed-${idx}`}
                        className='flex flex-row place-items-center gap-6 py-2'
                    >
                        <div className='bg-cs-bg-white py-4'>
                            {f.iconL || (
                                <div className='h-2 w-2 rounded-full border border-cs-secondary bg-cs-primary' />
                            )}
                        </div>
                        <div className='grow'>{f.content}</div>
                        <div className='text-xs text-cs-text-neutral'>
                            {getHumanReadableDuration(f.date)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

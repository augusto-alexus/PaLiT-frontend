import { ReactElement } from 'react'
import { getHumanReadableDuration } from '~/lib/date.ts'

export interface IFeedElement {
    content: string | ReactElement
    iconL: ReactElement
    date: Date
}

export function Feed({ data }: { data?: IFeedElement[] }) {
    if (!data) return <></>
    return (
        <div className='border-l border-cs-additional-gray'>
            <div className='-m-1 flex flex-col gap-4'>
                {data.map((f, idx) => (
                    <div
                        key={`feed-${idx}`}
                        className='flex flex-row gap-6 py-2'
                    >
                        <div className='relative h-fit bg-cs-bg-white py-4'>
                            <div className='h-2 w-2 rounded-full border border-transparent bg-transparent' />
                            <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
                                {f.iconL}
                            </div>
                        </div>
                        <div className='grow place-self-center'>
                            {f.content}
                        </div>
                        <div className='text-xs text-cs-text-neutral'>
                            {getHumanReadableDuration(f.date)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export function FeedIconApprove() {
    return (
        <div className='h-fit bg-cs-bg-white py-4'>
            <div className='h-3 w-3 rounded-full border border-cs-secondary bg-cs-primary' />
        </div>
    )
}

export function FeedIconReject() {
    return (
        <div className='h-fit bg-cs-bg-white py-4'>
            <div className='h-3 w-3 rounded-full border border-cs-additional-gray bg-cs-warning' />
        </div>
    )
}

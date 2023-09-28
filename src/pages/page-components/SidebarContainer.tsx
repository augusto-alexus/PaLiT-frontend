import { Transition } from '@headlessui/react'
import { Fragment, PropsWithChildren, useState } from 'react'
import { IMyStudent } from '~/backend'
import { ProjectInfo } from './ProjectInfo.tsx'

export function SidebarContainer(
    props: PropsWithChildren<{ myStudent?: IMyStudent }>
) {
    const [infoCollapsed, setInfoCollapsed] = useState<boolean>(false)
    const [showExtendButton, setShowExtendButton] = useState<boolean>(false)
    return (
        <div className='mx-24 flex flex-row justify-between'>
            <main className='w-10/12'>{props.children}</main>
            <div>
                {showExtendButton && (
                    <button
                        onClick={() => setInfoCollapsed(false)}
                        className='h-8 w-8 rounded-full border-0 bg-transparent p-0 text-cs-additional-gray hover:border-0 hover:bg-[#C3C3C366]'
                    >
                        <i className='ri-arrow-left-s-line text-2xl'></i>
                    </button>
                )}
                <Transition.Root
                    show={!infoCollapsed}
                    as={Fragment}
                    afterLeave={() => setShowExtendButton(true)}
                    beforeEnter={() => setShowExtendButton(false)}
                >
                    <Transition.Child as={Fragment}>
                        <div className='w-fit max-w-md overflow-hidden'>
                            <button
                                onClick={() => setInfoCollapsed(true)}
                                className='h-8 w-8 rounded-full border-0 bg-transparent p-0 text-cs-additional-gray hover:border-0 hover:bg-[#C3C3C366]'
                            >
                                <i className='ri-arrow-right-s-line text-2xl'></i>
                            </button>
                            <ProjectInfo myStudent={props.myStudent} />
                        </div>
                    </Transition.Child>
                </Transition.Root>
            </div>
        </div>
    )
}

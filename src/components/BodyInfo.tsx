import { Fragment, PropsWithChildren, useState } from 'react'
import { Transition } from '@headlessui/react'
import { BlockInfo } from './BlockInfo.tsx'

export function BodyInfo(props: PropsWithChildren<{}>) {
    const [infoCollapsed, setInfoCollapsed] = useState<boolean>(false)
    return (
        <div className='mx-24 mt-6 flex flex-row justify-between border-t-2 pt-4'>
            <main>{props.children}</main>
            <div>
                <Transition.Root show={!infoCollapsed} as={Fragment}>
                    <Transition.Child
                        as={Fragment}
                        enter='transform transition ease-in-out duration-500 sm:duration-700'
                        enterFrom='translate-x-full'
                        enterTo='translate-x-0'
                        leave='transform transition ease-in-out duration-500 sm:duration-700'
                        leaveFrom='translate-x-0'
                        leaveTo='translate-x-full'
                    >
                        <div className='w-fit max-w-md overflow-hidden'>
                            <button
                                onClick={() => setInfoCollapsed((v) => !v)}
                                className='h-8 w-8 rounded-full border-0 bg-transparent p-0 text-cs-additional-gray hover:border-0 hover:bg-[#C3C3C366]'
                            >
                                {infoCollapsed ? (
                                    <i className='ri-arrow-left-s-line text-2xl'></i>
                                ) : (
                                    <i className='ri-arrow-right-s-line text-2xl'></i>
                                )}
                            </button>
                            <BlockInfo />
                        </div>
                    </Transition.Child>
                </Transition.Root>
            </div>
        </div>
    )
}

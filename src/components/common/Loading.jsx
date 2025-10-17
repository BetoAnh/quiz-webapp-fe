import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function Loading({ open = true, message = "Đang tải..." }) {
    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => { }}>
                {/* Overlay */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
                </Transition.Child>

                {/* Centered content */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="flex flex-col items-center gap-3 rounded-2xl bg-white px-6 py-8 shadow-xl">
                            <ArrowPathIcon className="h-8 w-8 text-indigo-600 animate-spin" />
                            <Dialog.Title className="text-base font-medium text-gray-700">
                                {message}
                            </Dialog.Title>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}

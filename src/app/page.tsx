import Image from "next/image";

export default function Home() {
    return (<>
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <div className="flex flex-col gap-8 row-start-2 items-center">
                <h1 className="sr-only">NarraLeaf - A new definition of Visual Novel</h1>
                <Image
                    className="dark:hidden drag-none select-none"
                    src="/static/images/logo-text-blue.png"
                    alt="NarraLeaf logo"
                    width={280}
                    height={38}
                    priority
                />
                <Image
                    className="hidden dark:block drag-none select-none"
                    src="/static/images/logo-text-white.png"
                    alt="NarraLeaf logo"
                    width={280}
                    height={38}
                    priority
                />
            </div>
            <div
                className="row-start-3 flex flex-col items-center">
                <div
                    className={"flex gap-6 flex-wrap items-center justify-center text-primary dark:text-foreground"}
                >
                    <a
                        className="flex items-center gap-2 hover:underline hover:underline-offset-4 decoration-primary select-none"
                        href="https://github.com/NarraLeaf"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub
                    </a>
                    <a
                        className="flex items-center gap-2 hover:underline hover:underline-offset-4 decoration-primary select-none"
                        href="https://react.narraleaf.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Documentation
                    </a>
                </div>
                <svg className="w-6 h-6 text-gray-200 dark:text-neutral-500 mt-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </div>
        </div>
    </>);
}

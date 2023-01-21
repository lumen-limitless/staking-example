import { ReactNode, useState } from 'react'

export default function Banner({ children }: { children?: ReactNode }) {
  return (
    <div
      id="banner"
      className="flex w-full flex-col items-center justify-center gap-1 bg-blue-500 text-center text-sm transition-all md:flex-row md:text-base"
    >
      {children || ''}
    </div>
  )
}

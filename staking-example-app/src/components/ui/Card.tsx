import React from 'react'

export default function Card({
  children,
  className = '',
}: {
  children: React.ReactNode
  className: string
}) {
  return (
    <div className={[className, ' flex-1 flex-grow'].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}

const Header = ({ children }: { children: React.ReactNode }) => (
  <div className="relative w-full rounded-t bg-gray-800">{children}</div>
)
Card.Header = Header

const Body = ({ children }: { children: React.ReactNode }) => (
  <div className="relative h-full rounded bg-gray-900 p-3 sm:p-9">
    {children}
  </div>
)
Card.Body = Body

const Footer = ({ children }: { children: React.ReactNode }) => (
  <div className="relative">{children}</div>
)
Card.Footer = Footer

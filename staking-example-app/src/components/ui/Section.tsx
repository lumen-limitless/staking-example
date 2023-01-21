interface SectionProps
  extends React.DetailedHTMLProps<React.HTMLProps<HTMLElement>, HTMLElement> {
  fullscreen?: boolean
  centered?: boolean
}

export default function Section({
  children,
  className,
  fullscreen,
  centered,
  ...props
}: SectionProps) {
  return (
    <section
      className={[
        'relative flex h-full w-full flex-col',
        fullscreen && 'min-h-screen',
        centered ? 'items-center justify-center' : 'justify-start',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </section>
  )
}

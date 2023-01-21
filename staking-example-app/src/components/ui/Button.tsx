const SIZE = {
  xs: 'p-1 text-xs ',
  sm: 'p-2 text-sm ',
  md: 'p-3 text-base ',
  lg: 'p-5 text-lg',
  none: '',
}

const COLORS = {
  none: '',
  blue: 'bg-blue-500 ',
  green: 'bg-green-500 ',
  red: 'bg-red-500 ',
  yellow: 'bg-yellow-500 ',
  pink: 'bg-pink-500',
  gray: 'bg-gray-500 ',
}

interface ButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'className' | 'children'
  > {
  children?: React.ReactNode
  className?: string
  color?: 'none' | 'blue' | 'green' | 'red' | 'yellow' | 'pink' | 'gray'
  size?: 'xs' | 'sm' | 'lg' | 'md' | 'none'
  full?: boolean
}
export default function Button({
  children,
  className = '',
  color = 'none',
  size = 'md',
  full = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        COLORS[color],
        SIZE[size],
        full && 'w-full',
        'inline-flex min-w-max items-center justify-center gap-1 rounded text-white transition focus:outline-none enabled:drop-shadow-md hover:enabled:brightness-125 disabled:cursor-not-allowed disabled:bg-opacity-20 disabled:text-opacity-60  ',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}

import * as React from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = {
  default: 'bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500',
  destructive: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500',
  outline: 'border border-slate-700 bg-slate-900 hover:bg-slate-800 dark:border-slate-600 dark:hover:bg-slate-700 text-slate-100',
  secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600',
  ghost: 'hover:bg-slate-800 dark:hover:bg-slate-800 text-slate-100',
  link: 'text-teal-400 underline hover:text-teal-300 dark:text-teal-400 dark:hover:text-teal-300',
}

const sizeVariants = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3 text-sm',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
}

const Button = React.forwardRef(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        buttonVariants[variant],
        sizeVariants[size],
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Button.displayName = 'Button'

export { Button, buttonVariants }

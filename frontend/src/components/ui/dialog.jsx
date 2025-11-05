import * as React from 'react'
import { X } from 'lucide-react'

const Dialog = ({ open, onOpenChange, children }) => {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => onOpenChange(false)} />
      )}
      {open && (
        <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-slate-900 p-6 rounded-lg shadow-lg border border-slate-800">
          {children}
        </div>
      )}
    </>
  )
}

const DialogContent = ({ children, onClose }) => (
  <>
    <button
      onClick={onClose}
      className="absolute right-4 top-4 p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
    >
      <X className="h-4 w-4" />
    </button>
    {children}
  </>
)

const DialogHeader = ({ className = '', children, ...props }) => (
  <div className={`mb-4 flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props}>
    {children}
  </div>
)
DialogHeader.displayName = 'DialogHeader'

const DialogTitle = ({ className = '', children, ...props }) => (
  <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h2>
)
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = ({ className = '', children, ...props }) => (
  <p className={`text-sm text-slate-400 ${className}`} {...props}>
    {children}
  </p>
)
DialogDescription.displayName = 'DialogDescription'

const DialogFooter = ({ className = '', children, ...props }) => (
  <div
    className={`mt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}
    {...props}
  >
    {children}
  </div>
)
DialogFooter.displayName = 'DialogFooter'

const DialogTrigger = React.forwardRef(({ children, ...props }, ref) => (
  <button
    ref={ref}
    {...props}
  >
    {children}
  </button>
))
DialogTrigger.displayName = 'DialogTrigger'

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
}

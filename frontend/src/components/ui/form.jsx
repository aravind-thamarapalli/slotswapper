import * as React from 'react'
import { Controller, FormProvider, useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

const Form = FormProvider

const FormFieldContext = React.createContext({})

const FormField = ({ ...props }) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const { getFieldState, formState } = useFormContext()
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  return {
    name: fieldContext.name,
    ...fieldState,
  }
}

const FormItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-2', className)} {...props} />
))
FormItem.displayName = 'FormItem'

const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  const { error } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && 'text-red-600', className)}
      {...props}
    />
  )
})
FormLabel.displayName = 'FormLabel'

const FormControl = React.forwardRef(({ ...props }, ref) => {
  const { error } = useFormField()

  return (
    <div
      ref={ref}
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = 'FormControl'

const FormDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-slate-400', className)}
    {...props}
  />
))
FormDescription.displayName = 'FormDescription'

const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
  const { error } = useFormField()
  const body = error ? String(error?.message ?? '') : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      className={cn('text-sm font-medium text-red-600', className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = 'FormMessage'

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}

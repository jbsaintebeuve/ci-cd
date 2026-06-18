import { cn } from '../../lib/utils'

function Field({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-2', className)} {...props} />
}

function FieldLabel({ className, children, ...props }: React.HTMLAttributes<HTMLLabelElement> & { htmlFor?: string }) {
  return (
    <label
      className={cn('text-sm font-medium leading-none', className)}
      {...props}
    >
      {children}
    </label>
  )
}

function FieldDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />
}

function FieldGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-4', className)} {...props} />
}

export { Field, FieldDescription, FieldGroup, FieldLabel }

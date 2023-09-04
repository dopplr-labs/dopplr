import { cloneElement, forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader } from 'lucide-react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[loading=true]:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        'destructive-outline': 'border border-destructive/30 text-destructive hover:bg-destructive/10',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const iconVariants = cva('flex-shrink-0', {
  variants: {
    type: {
      withChildren: 'mr-3 h-5 w-5',
      withoutChildren: 'h-4 w-4',
    },
  },
  defaultVariants: {
    type: 'withChildren',
  },
})

export interface BaseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const BaseButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        {children}
      </Comp>
    )
  },
)
BaseButton.displayName = 'BaseButton'

type ButtonProps = Omit<BaseButtonProps, 'asChild'> & {
  loading?: boolean
  icon?: React.ReactElement<{ className?: string }>
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ loading, icon, children, ...props }, ref) => {
  return (
    <BaseButton {...props} asChild={false} data-loading={loading} ref={ref}>
      {loading ? (
        <Loader className={cn(iconVariants({ type: children ? 'withChildren' : 'withoutChildren' }), 'animate-spin')} />
      ) : icon ? (
        cloneElement(icon, {
          className: cn(iconVariants({ type: children ? 'withChildren' : 'withoutChildren' }), icon.props.className),
        })
      ) : null}
      {children}
    </BaseButton>
  )
})

Button.displayName = 'Button'

export { BaseButton, Button, buttonVariants }

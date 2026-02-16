import * as React from 'react'
import { cn } from '../../lib/utils'

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('inline-flex rounded-md shadow-sm', className)}
        role="group"
        {...props}
      >
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child

          const isFirst = index === 0
          const isLast = index === React.Children.count(children) - 1

          return React.cloneElement(child, {
            ...child.props,
            className: cn(
              child.props.className,
              !isFirst && '-ml-px',
              isFirst && 'rounded-r-none',
              isLast && 'rounded-l-none',
              !isFirst && !isLast && 'rounded-none'
            ),
          } as any)
        })}
      </div>
    )
  }
)

ButtonGroup.displayName = 'ButtonGroup'

export { ButtonGroup }

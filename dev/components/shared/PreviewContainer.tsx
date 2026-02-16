import type { ReactNode } from 'react'

interface PreviewContainerProps {
  children: ReactNode
  /** If true, renders children without the dashed border container */
  bare?: boolean
}

export const PreviewContainer = ({
  children,
  bare = false,
}: PreviewContainerProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm">Preview</h3>
      {bare ? (
        children
      ) : (
        <div className="flex items-center justify-center min-h-[100px] rounded-md border border-dashed border-border">
          {children}
        </div>
      )}
    </div>
  )
}

import { ReactNode } from 'react'

interface PageWrapperProps {
  children: ReactNode
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-full">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  )
}

export default PageWrapper
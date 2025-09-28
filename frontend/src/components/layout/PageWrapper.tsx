import { ReactNode } from 'react'

interface PageWrapperProps {
  children: ReactNode
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  )
}

export default PageWrapper
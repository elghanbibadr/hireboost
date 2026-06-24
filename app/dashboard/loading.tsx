import { Loader2 } from 'lucide-react'
import React from 'react'

const loading = () => {
  return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: '#C8FF5E' }} />
      </div>
  )
}

export default loading

    
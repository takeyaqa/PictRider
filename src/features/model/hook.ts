import { use } from 'react'
import ModelContext from './context'

function useModel() {
  const context = use(ModelContext)
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }
  return context
}

export default useModel

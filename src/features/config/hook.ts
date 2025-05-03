import { use } from 'react'
import ConfigContext from './context'

function useConfig() {
  const context = use(ConfigContext)
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }
  return context
}

export default useConfig

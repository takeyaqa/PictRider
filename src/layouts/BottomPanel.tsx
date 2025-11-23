import { ResultSection } from '../features/result/components'
import type { Result } from '../types'

interface BottomPanelProps {
  result: Result | null
  resultSection: React.RefObject<HTMLDivElement | null>
}

function BottomPanel({ result, resultSection }: BottomPanelProps) {
  return (
    <div ref={resultSection}>
      <ResultSection result={result} />
    </div>
  )
}

export default BottomPanel

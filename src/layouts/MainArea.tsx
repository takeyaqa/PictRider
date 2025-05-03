import { PictRunner } from '@takeyaqa/pict-browser'
import { useEffect, useRef } from 'react'
import { Result } from '../types'
import TopPanel from './TopPanel'
import BottomPanel from './BottomPanel'

interface MainAreaProps {
  pictRunnerLoaded: boolean
  pictRunner: React.RefObject<PictRunner | null>
  result: Result | null
  setResult: (result: Result | null) => void
}

function MainArea({
  pictRunnerLoaded,
  pictRunner,
  result,
  setResult,
}: MainAreaProps) {
  const resultSection = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (
      result !== null &&
      resultSection.current &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(width < 96rem)').matches // tailwind: 2xl, two columns layout
    ) {
      resultSection.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [result])

  return (
    <main className="grid grid-cols-1 2xl:grid-cols-2">
      <TopPanel
        pictRunnerLoaded={pictRunnerLoaded}
        pictRunner={pictRunner}
        result={result}
        setResult={setResult}
      />
      <BottomPanel result={result} resultSection={resultSection} />
    </main>
  )
}

export default MainArea

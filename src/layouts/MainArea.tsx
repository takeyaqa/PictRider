import { PictRunner } from '@takeyaqa/pict-wasm'
import { useEffect, useRef, useState } from 'react'
import TopPanel from './TopPanel'
import BottomPanel from './BottomPanel'
import type { Result } from '../types'

interface MainAreaProps {
  pictRunnerInjection?: PictRunner // use for testing
}

function MainArea({ pictRunnerInjection }: MainAreaProps) {
  const [result, setResult] = useState<Result | null>(null)
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
        pictRunnerInjection={pictRunnerInjection}
        result={result}
        setResult={setResult}
      />
      <BottomPanel result={result} resultSection={resultSection} />
    </main>
  )
}

export default MainArea

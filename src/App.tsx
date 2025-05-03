import { useState, useEffect, useRef } from 'react'
import { PictRunner } from '@takeyaqa/pict-browser'
import { Analytics } from './components'
import {
  HeaderSection,
  NotificationMessageSection,
  ParametersSection,
  OptionsSection,
  SubModelsSection,
  ConstraintsSection,
  ResultSection,
  FooterSection,
  MenuSection,
} from './sections'
import { Result } from './types'
import { ConfigProvider } from './features/config'
import { ModelProvider } from './features/model'

interface AppProps {
  pictRunnerInjection?: PictRunner // use for testing
}

function App({ pictRunnerInjection }: AppProps) {
  const [result, setResult] = useState<Result | null>(null)
  const [pictRunnerLoaded, setPictRunnerLoaded] = useState(false)
  const pictRunner = useRef<PictRunner>(null)
  const resultSection = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Use the injected PictRunner for testing
    if (pictRunnerInjection) {
      pictRunner.current = pictRunnerInjection
      setPictRunnerLoaded(true)
      return
    }
    const loadPictRunner = async () => {
      pictRunner.current = new PictRunner()
      await pictRunner.current.init()
      setPictRunnerLoaded(true)
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadPictRunner()
  }, [pictRunnerInjection])

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
    <>
      <HeaderSection />
      <NotificationMessageSection
        message={import.meta.env.VITE_NOTIFICATION_MESSAGE}
      />
      <ConfigProvider>
        <ModelProvider>
          <main className="grid grid-cols-1 2xl:grid-cols-2">
            <div>
              <MenuSection
                pictRunnerLoaded={pictRunnerLoaded}
                canClearResult={result !== null}
                pictRunner={pictRunner}
                handleClearResult={() => {
                  setResult(null)
                }}
                setResult={setResult}
              />
              <ParametersSection />
              <ConstraintsSection />
              <SubModelsSection />
              <OptionsSection />
            </div>
            <div ref={resultSection}>
              <ResultSection result={result} />
            </div>
          </main>
        </ModelProvider>
      </ConfigProvider>
      <FooterSection />
      <Analytics />
    </>
  )
}

export default App

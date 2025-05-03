import { useState, useEffect, useRef } from 'react'
import { PictRunner } from '@takeyaqa/pict-browser'
import { Analytics } from './components'
import {
  HeaderSection,
  NotificationMessageSection,
  FooterSection,
} from './sections'
import { Result } from './types'
import { ConfigProvider } from './features/config'
import { ModelProvider } from './features/model'
import { MainArea } from './layouts'

interface AppProps {
  pictRunnerInjection?: PictRunner // use for testing
}

function App({ pictRunnerInjection }: AppProps) {
  const [result, setResult] = useState<Result | null>(null)
  const [pictRunnerLoaded, setPictRunnerLoaded] = useState(false)
  const pictRunner = useRef<PictRunner>(null)

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

  return (
    <>
      <HeaderSection />
      <NotificationMessageSection
        message={import.meta.env.VITE_NOTIFICATION_MESSAGE}
      />
      <ConfigProvider>
        <ModelProvider>
          <MainArea
            pictRunnerLoaded={pictRunnerLoaded}
            pictRunner={pictRunner}
            result={result}
            setResult={setResult}
          />
        </ModelProvider>
      </ConfigProvider>
      <FooterSection />
      <Analytics />
    </>
  )
}

export default App

import { PictRunner } from '@takeyaqa/pict-browser'
import { ConfigProvider } from './features/config'
import { ModelProvider } from './features/model'
import { MainArea } from './layouts'
import {
  Analytics,
  FooterSection,
  HeaderSection,
  NotificationMessageSection,
} from './shared/components'

interface AppProps {
  pictRunnerInjection?: PictRunner // use for testing
}

function App({ pictRunnerInjection }: AppProps) {
  return (
    <>
      <HeaderSection />
      <NotificationMessageSection
        message={import.meta.env.VITE_NOTIFICATION_MESSAGE}
      />
      <ConfigProvider>
        <ModelProvider>
          <MainArea pictRunnerInjection={pictRunnerInjection} />
        </ModelProvider>
      </ConfigProvider>
      <FooterSection />
      <Analytics />
    </>
  )
}

export default App

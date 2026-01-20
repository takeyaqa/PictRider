import { PictRunner } from '@takeyaqa/pict-wasm'
import { ConfigProvider } from './features/config'
import { MainArea } from './layouts'
import {
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
        <MainArea pictRunnerInjection={pictRunnerInjection} />
      </ConfigProvider>
      <FooterSection />
    </>
  )
}

export default App

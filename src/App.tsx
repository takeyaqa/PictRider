import { PictRunner } from '@takeyaqa/pict-wasm'
import { ConfigProvider } from './features/config'
import {
  FooterSection,
  HeaderSection,
  MainArea,
  NotificationMessageSection,
} from './layouts'

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

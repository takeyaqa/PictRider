import { ConfigProvider } from './features/config'
import {
  FooterSection,
  HeaderSection,
  MainArea,
  NotificationMessageSection,
} from './layouts'

function App() {
  return (
    <>
      <HeaderSection />
      <NotificationMessageSection
        message={import.meta.env.VITE_NOTIFICATION_MESSAGE}
      />
      <ConfigProvider>
        <MainArea />
      </ConfigProvider>
      <FooterSection />
    </>
  )
}

export default App

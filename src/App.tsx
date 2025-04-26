import { Analytics } from './components'
import {
  HeaderSection,
  NotificationMessageSection,
  FooterSection,
} from './sections'
import { AppMain } from './pages'

function App() {
  return (
    <>
      <HeaderSection />
      <NotificationMessageSection
        message={import.meta.env.VITE_NOTIFICATION_MESSAGE}
      />
      <AppMain />
      <FooterSection />
      <Analytics />
    </>
  )
}

export default App

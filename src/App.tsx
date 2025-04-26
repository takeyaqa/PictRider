import {
  HeaderArea,
  NotificationMessageArea,
  FooterArea,
  Analytics,
} from './components'
import { AppMain } from './pages'

function App() {
  return (
    <>
      <HeaderArea />
      <NotificationMessageArea
        message={import.meta.env.VITE_NOTIFICATION_MESSAGE}
      />
      <AppMain />
      <FooterArea />
      <Analytics />
    </>
  )
}

export default App

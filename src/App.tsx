import {
  HeaderArea,
  NotificationMessageArea,
  FooterArea,
  Analytics,
} from './components'
import { Outlet } from 'react-router'

function App() {
  return (
    <>
      <HeaderArea />
      <NotificationMessageArea
        message={import.meta.env.VITE_NOTIFICATION_MESSAGE}
      />
      <Outlet />
      <FooterArea />
      <Analytics />
    </>
  )
}

export default App

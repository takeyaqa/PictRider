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
      <NotificationMessageArea message={__NOTIFICATION_MESSAGE__} />
      <Outlet />
      <FooterArea />
      <Analytics />
    </>
  )
}

export default App

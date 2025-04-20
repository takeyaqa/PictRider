import { HeaderArea, NotificationMessageArea, FooterArea } from './components'
import { Outlet } from 'react-router'

function App() {
  return (
    <>
      <HeaderArea />
      <NotificationMessageArea message={__NOTIFICATION_MESSAGE__} />
      <Outlet />
      <FooterArea />
    </>
  )
}

export default App

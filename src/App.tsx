import { HeaderArea, FooterArea } from './components'
import { Outlet } from 'react-router'

function App() {
  return (
    <>
      <HeaderArea />
      <Outlet />
      <FooterArea />
    </>
  )
}

export default App

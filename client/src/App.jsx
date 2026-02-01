import { useState } from 'react'

// Componentes
import Header from './components/header.jsx'
import Sidebar from './components/sidebar.jsx'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  return (
    <>
      <Header setIsSidebarOpen={setIsSidebarOpen} />
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
    </>
  )
}

export default App

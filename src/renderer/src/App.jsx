import './styles/main.css'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import HUDLayout from './components/layout/HUDLayout'
import ActionConfirmModal from './components/ActionConfirmModal'
import ClapDetector from './components/ClapDetector'

export default function App() {
  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <Sidebar />
        <HUDLayout />
      </div>
      <ActionConfirmModal />
      <ClapDetector />
    </div>
  )
}
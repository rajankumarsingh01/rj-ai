import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'
import CenterStage from './CenterStage'
import '../../styles/hudLayout.css'

export default function HUDLayout() {
  return (
    <div className="hud-layout">
      <div className="hud-col hud-col-left">
        <LeftPanel />
      </div>

      <div className="hud-col hud-col-center">
        <CenterStage />
      </div>

      <div className="hud-col hud-col-right">
        <RightPanel />
      </div>
    </div>
  )
}
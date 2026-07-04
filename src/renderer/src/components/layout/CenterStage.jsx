import useNovaStore from '../../store/useNovaStore'
import NovaOrb from '../NovaOrb'
import ChatWindow from '../ChatWindow'
import ChatInput from '../ChatInput'
import '../../styles/centerStage.css'

export default function CenterStage() {
  const { messages, isLoading, isSpeaking, isListening } = useNovaStore()
  const hasMessages = messages.length > 0

  let orbState = 'idle'
  if (isListening) orbState = 'listening'
  else if (isSpeaking) orbState = 'speaking'
  else if (isLoading) orbState = 'thinking'

  return (
    <div className={`center-stage ${hasMessages ? 'stage-chat' : 'stage-empty'}`}>
      <div className="orb-dock">
        <NovaOrb state={orbState} size={hasMessages ? 84 : 220} />
        {!hasMessages && (
          <p className="orb-subtitle">Kuch bhi pucho — main hoon yahan</p>
        )}
      </div>

      <div className="chat-messages-area">
        <ChatWindow />
      </div>

      <ChatInput />
    </div>
  )
}
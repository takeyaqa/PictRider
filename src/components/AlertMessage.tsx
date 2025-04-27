import { Message } from '../types'

interface AlertMessageProps {
  messages: Message[]
}

function AlertMessage({ messages }: AlertMessageProps) {
  if (messages.length === 0) {
    return null
  }
  return (
    <div
      className="mt-5 rounded-md border-2 border-red-400 bg-red-100 p-7 text-red-700"
      role="alert"
    >
      {messages.map((message) => (
        <p key={message.id}>{message.text}</p>
      ))}
    </div>
  )
}

export default AlertMessage

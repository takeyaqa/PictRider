interface NotificationMessageAreaProps {
  message: string
}

function NotificationMessageArea({ message }: NotificationMessageAreaProps) {
  if (!message) {
    return null
  }
  return (
    <section className="shadow-md-6 mx-2 mb-10 rounded-md border-2 border-blue-400 bg-blue-100 p-7 text-black md:mx-10">
      <div>{message}</div>
    </section>
  )
}

export default NotificationMessageArea

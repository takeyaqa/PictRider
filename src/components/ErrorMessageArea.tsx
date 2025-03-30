interface ErrorMessageAreaProps {
  message: string
}

function ErrorMessageArea({ message }: ErrorMessageAreaProps) {
  if (!message) {
    return null
  }
  return (
    <section className="shadow-md-6 mx-10 mb-10 rounded-md border-2 border-red-400 bg-red-100 p-7 text-red-700">
      <div role="alert">{message}</div>
    </section>
  )
}

export default ErrorMessageArea

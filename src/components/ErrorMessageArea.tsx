interface ErrorMessageAreaProps {
  message: string
}

function ErrorMessageArea({ message }: ErrorMessageAreaProps) {
  if (!message) {
    return null
  }
  return (
    <div className="mt-6">
      <div className="w-full">
        <div
          className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
          role="alert"
        >
          {message}
        </div>
      </div>
    </div>
  )
}

export default ErrorMessageArea

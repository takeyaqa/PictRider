interface ErrorMessageAreaProps {
  message: string
}

function ErrorMessageArea({ message }: ErrorMessageAreaProps) {
  if (!message) {
    return null
  }
  return (
    <div className="row mt-3">
      <div className="col-12">
        <div className="alert alert-danger" role="alert">
          {message}
        </div>
      </div>
    </div>
  )
}

export default ErrorMessageArea

import { PictParameter } from '../types'

interface RunButtonAreaProps {
  parameters: PictParameter[]
  pictRunnerLoaded: boolean
  onClickRun: () => void
}

function RunButtonArea({
  parameters,
  pictRunnerLoaded,
  onClickRun,
}: RunButtonAreaProps) {
  const containsInvalidValues = parameters.some((p) => !p.isValid)
  return (
    <div className="row mt-3">
      <div className="col-3">
        <input
          type="submit"
          value="Run"
          className="btn btn-primary"
          disabled={containsInvalidValues || !pictRunnerLoaded}
          onClick={onClickRun}
        />
      </div>
    </div>
  )
}

export default RunButtonArea

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
    <div className="mt-6 flex">
      <div className="w-1/4">
        <input
          type="submit"
          value="Run"
          className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={containsInvalidValues || !pictRunnerLoaded}
          onClick={onClickRun}
        />
      </div>
    </div>
  )
}

export default RunButtonArea

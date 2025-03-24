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
    <div className="flex mt-6">
      <div className="w-1/4">
        <input
          type="submit"
          value="Run"
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={containsInvalidValues || !pictRunnerLoaded}
          onClick={onClickRun}
        />
      </div>
    </div>
  )
}

export default RunButtonArea

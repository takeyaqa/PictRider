import { PictConstraint, PictParameter } from '../types'

interface RunButtonAreaProps {
  parameters: PictParameter[]
  constraints: PictConstraint[]
  pictRunnerLoaded: boolean
  onClickRun: () => void
}

function RunButtonArea({
  parameters,
  constraints,
  pictRunnerLoaded,
  onClickRun,
}: RunButtonAreaProps) {
  const containsInvalidValues = parameters.some(
    (p) => !p.isValidName || !p.isValidValues,
  )
  const containsInvalidConstraints = constraints.some((c) =>
    c.conditions.some((cond) => !cond.isValid),
  )
  return (
    <section className="mx-10 my-10">
      <div>
        <input
          type="submit"
          value="Run"
          className="w-full cursor-pointer rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={
            containsInvalidValues ||
            containsInvalidConstraints ||
            !pictRunnerLoaded
          }
          onClick={onClickRun}
        />
      </div>
    </section>
  )
}

export default RunButtonArea

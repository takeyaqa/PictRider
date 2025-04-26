import { Constraint, Parameter } from '../types'

interface RunButtonSectionProps {
  parameters: Parameter[]
  constraints: Constraint[]
  pictRunnerLoaded: boolean
  onClickRun: () => void
}

function RunButtonSection({
  parameters,
  constraints,
  pictRunnerLoaded,
  onClickRun,
}: RunButtonSectionProps) {
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

export default RunButtonSection

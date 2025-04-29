import { Button } from '../components'
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
        <Button
          type="primary"
          size="full"
          disabled={
            containsInvalidValues ||
            containsInvalidConstraints ||
            !pictRunnerLoaded
          }
          onClick={onClickRun}
        >
          Run
        </Button>
      </div>
    </section>
  )
}

export default RunButtonSection

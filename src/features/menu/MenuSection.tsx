import { PictRunner } from '@takeyaqa/pict-wasm'
import { Button, Section } from '../../shared/components'
import { runPict } from '../../shared/helpers'
import { usePictRunner } from '../../shared/hooks'
import type { Constraints, Parameters, Result, SubModels } from '../../types'
import { useConfig } from '../config'

interface MenuSectionProps {
  pictRunnerInjection?: PictRunner // use for testing
  canClearResult: boolean
  parameters: Parameters
  constraints: Constraints
  subModels: SubModels
  onClearInput: () => void
  onClearResult: () => void
  setResult: (result: Result) => void
}

function MenuSection({
  pictRunnerInjection,
  canClearResult,
  parameters,
  constraints,
  subModels,
  onClearInput,
  onClearResult,
  setResult,
}: MenuSectionProps) {
  const { pictRunner, pictRunnerLoaded } = usePictRunner(pictRunnerInjection)
  const { config } = useConfig()

  const containsInvalidValues = parameters.parameters.some(
    (p) => !p.isValidName || !p.isValidValues,
  )
  const containsInvalidConstraints = constraints.constraints.some((c) =>
    c.conditions.some((cond) => !cond.isValid),
  )
  const hasSyntaxErrorsInDirectEditMode =
    constraints.constraintDirectEditMode &&
    constraints.constraintErrors.length > 0

  const canRunPict =
    !containsInvalidValues &&
    !containsInvalidConstraints &&
    !hasSyntaxErrorsInDirectEditMode &&
    pictRunnerLoaded &&
    pictRunner.current

  function handleClickRun() {
    if (
      containsInvalidValues ||
      containsInvalidConstraints ||
      hasSyntaxErrorsInDirectEditMode ||
      !pictRunnerLoaded ||
      !pictRunner.current
    ) {
      return
    }
    const result = runPict(
      pictRunner.current,
      parameters.parameters,
      constraints.constraintTexts,
      subModels.subModels,
      config,
    )
    setResult(result)
  }

  return (
    <Section>
      <menu className="flex list-none items-center justify-start gap-5">
        <li>
          <Button type="warning" size="sm" onClick={onClearInput}>
            Clear Input
          </Button>
        </li>
        <li>
          <Button
            type="warning"
            size="sm"
            disabled={!canClearResult}
            onClick={onClearResult}
          >
            Clear Result
          </Button>
        </li>
        <li className="border-l border-l-black pl-5">
          <Button
            type="primary"
            size="sm"
            disabled={!canRunPict}
            onClick={handleClickRun}
          >
            Run
          </Button>
        </li>
      </menu>
    </Section>
  )
}

export default MenuSection

import { PictRunner } from '@takeyaqa/pict-wasm'
import { Button, Section } from '../../../shared/components'
import { runPict } from '../../../shared/helpers'
import { usePictRunner } from '../../../shared/hooks'
import { useConfig } from '../../config'
import type {
  ConstraintsState,
  ParametersState,
  Result,
  SubModelsState,
} from '../../../types'

interface MenuSectionProps {
  pictRunnerInjection?: PictRunner // use for testing
  canClearResult: boolean
  handleClearResult: () => void
  setResult: (result: Result) => void
  parameters: ParametersState
  constraints: ConstraintsState
  subModels: SubModelsState
  handleClickClear: () => void
}

function MenuSection({
  pictRunnerInjection,
  canClearResult,
  handleClearResult,
  setResult,
  parameters,
  constraints,
  subModels,
  handleClickClear,
}: MenuSectionProps) {
  const { pictRunner, pictRunnerLoaded } = usePictRunner(pictRunnerInjection)
  const { config } = useConfig()

  function handleClickRun() {
    if (
      containsInvalidValues ||
      containsInvalidConstraints ||
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

  const containsInvalidValues = parameters.parameters.some(
    (p) => !p.isValidName || !p.isValidValues,
  )
  const containsInvalidConstraints = constraints.constraints.some((c) =>
    c.conditions.some((cond) => !cond.isValid),
  )

  const canRunPict =
    !containsInvalidValues &&
    !containsInvalidConstraints &&
    pictRunnerLoaded &&
    pictRunner.current

  return (
    <Section>
      <menu className="flex list-none items-center justify-start gap-5">
        <li>
          <Button type="warning" size="sm" onClick={handleClickClear}>
            Clear Input
          </Button>
        </li>
        <li>
          <Button
            type="warning"
            size="sm"
            disabled={!canClearResult}
            onClick={handleClearResult}
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

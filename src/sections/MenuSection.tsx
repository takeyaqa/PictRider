import { PictRunner } from '@takeyaqa/pict-browser'
import { Button, Section } from '../components'
import { useConfig } from '../features/config'
import { useModel } from '../features/model'
import { runPict } from '../shared/helpers'
import { usePictRunner } from '../shared/hooks'
import { Result } from '../types'

interface MenuSectionProps {
  pictRunnerInjection?: PictRunner // use for testing
  canClearResult: boolean
  handleClearResult: () => void
  setResult: (result: Result) => void
}

function MenuSection({
  pictRunnerInjection,
  canClearResult,
  handleClearResult,
  setResult,
}: MenuSectionProps) {
  const { pictRunner, pictRunnerLoaded } = usePictRunner(pictRunnerInjection)
  const { config } = useConfig()
  const { model, handlers: modelHandlers } = useModel()

  function handleClickRun() {
    if (
      containsInvalidValues ||
      containsInvalidConstraints ||
      !pictRunnerLoaded ||
      !pictRunner.current
    ) {
      return
    }
    const result = runPict(pictRunner.current, model, config)
    setResult(result)
  }

  const containsInvalidValues = model.parameters.some(
    (p) => !p.isValidName || !p.isValidValues,
  )
  const containsInvalidConstraints = model.constraints.some((c) =>
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
          <Button
            type="warning"
            size="sm"
            onClick={modelHandlers.handleClickClear}
          >
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

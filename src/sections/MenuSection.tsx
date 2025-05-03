import { PictRunner } from '@takeyaqa/pict-browser'
import { Button, Section } from '../components'
import { useConfig } from '../features/config'
import { Result } from '../types'
import { uuidv4 } from '../helpers'
import { useModel } from '../features/model'

interface MenuSectionProps {
  pictRunnerLoaded: boolean
  pictRunner: React.RefObject<PictRunner | null>
  canClearResult: boolean
  handleClearResult: () => void
  setResult: (result: Result) => void
}

function MenuSection({
  pictRunnerLoaded,
  pictRunner,
  canClearResult,
  handleClearResult,
  setResult,
}: MenuSectionProps) {
  const { config } = useConfig()
  const { model, handlers } = useModel()

  function runPict() {
    if (!pictRunnerLoaded || !pictRunner.current) {
      return
    }
    const fixedParameters = model.parameters
      .filter((p) => p.name !== '' && p.values !== '')
      .map((p) => ({ name: p.name, values: p.values }))
    const fixedSubModels = config.enableSubModels
      ? model.subModels
          .filter((sm) => sm.parameterIds.length > 0)
          .map((s) => ({
            parameterNames: s.parameterIds.map((id) => {
              const parameter = model.parameters.find((p) => p.id === id)
              if (!parameter) {
                throw new Error(`Parameter not found: ${id}`)
              }
              return parameter.name
            }),
            order: s.order,
          }))
      : []
    const pictOptions = {
      orderOfCombinations:
        config.orderOfCombinations !== '' ? config.orderOfCombinations : 2,
      randomizeGeneration: config.randomizeGeneration,
      randomizeSeed:
        config.randomizeGeneration && config.randomizeSeed !== ''
          ? config.randomizeSeed
          : undefined,
    }
    const output = config.enableConstraints
      ? pictRunner.current.run(fixedParameters, {
          subModels: fixedSubModels,
          constraintsText: model.constraintTexts.map((c) => c.text).join('\n'),
          options: pictOptions,
        })
      : pictRunner.current.run(fixedParameters, {
          subModels: fixedSubModels,
          options: pictOptions,
        })
    const header = output.header.map((h, i) => {
      return { id: i, name: h }
    })
    const body = output.body.map((row, i) => {
      return {
        id: i,
        values: row.map((col, j) => {
          return { id: j, value: col }
        }),
      }
    })
    const messages = output.message
      ? output.message.split('\n').map((m) => ({
          id: uuidv4(),
          text: m,
        }))
      : []
    setResult({
      header,
      body,
      modelFile: output.modelFile,
      messages: messages,
    })
  }

  const containsInvalidValues = model.parameters.some(
    (p) => !p.isValidName || !p.isValidValues,
  )
  const containsInvalidConstraints = model.constraints.some((c) =>
    c.conditions.some((cond) => !cond.isValid),
  )

  return (
    <Section>
      <menu className="flex list-none items-center justify-start gap-5">
        <li>
          <Button type="warning" size="sm" onClick={handlers.handleClickClear}>
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
            disabled={
              containsInvalidValues ||
              containsInvalidConstraints ||
              !pictRunnerLoaded
            }
            onClick={runPict}
          >
            Run
          </Button>
        </li>
      </menu>
    </Section>
  )
}

export default MenuSection

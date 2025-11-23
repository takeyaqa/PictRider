import { PictRunner } from '@takeyaqa/pict-wasm'
import { uuidv4 } from './util'
import type {
  PictOptions,
  PictOutput,
  PictParameter,
  PictSubModel,
} from '@takeyaqa/pict-wasm/dist/types'
import type {
  Config,
  ConstraintText,
  Model,
  Parameter,
  Result,
  SubModel,
} from '../../types'

export function runPict(pictRunner: PictRunner, model: Model, config: Config) {
  const pictParameters = processParameters(model.parameters)
  const pictSubModels = config.enableSubModels
    ? processSubModels(model.subModels, model.parameters)
    : undefined
  const pictConstraintTexts = config.enableConstraints
    ? processConstraintTexts(model.constraintTexts)
    : undefined
  const pictOptions = processOptions(config)
  const output = pictRunner.run(pictParameters, {
    subModels: pictSubModels,
    constraintsText: pictConstraintTexts,
    options: pictOptions,
  })
  return processOutput(output)
}

function processParameters(parameters: Parameter[]): PictParameter[] {
  return parameters
    .filter((p) => p.name !== '' && p.values !== '')
    .map((p) => ({ name: p.name, values: p.values }))
}

function processSubModels(
  subModels: SubModel[],
  parameters: Parameter[],
): PictSubModel[] {
  return subModels
    .filter((sm) => sm.parameterIds.length > 0)
    .map((sm) => ({
      parameterNames: sm.parameterIds.map((id) => {
        const parameter = parameters.find((p) => p.id === id)
        if (!parameter) {
          throw new Error(`Parameter not found: ${id}`)
        }
        return parameter.name
      }),
      order: sm.order,
    }))
}

function processConstraintTexts(constraintTexts: ConstraintText[]): string {
  return constraintTexts.map((ct) => ct.text).join('\n')
}

function processOptions(config: Config): PictOptions {
  return {
    orderOfCombinations:
      config.orderOfCombinations !== '' ? config.orderOfCombinations : 2,
    randomizeGeneration: config.randomizeGeneration,
    randomizeSeed:
      config.randomizeGeneration && config.randomizeSeed !== ''
        ? config.randomizeSeed
        : undefined,
  }
}

function processOutput(output: PictOutput): Result {
  const header = output.header.map((h) => {
    return { id: uuidv4(), name: h }
  })
  const body = output.body.map((row) => {
    return {
      id: uuidv4(),
      values: row.map((col) => {
        return { id: uuidv4(), value: col }
      }),
    }
  })
  const messages = output.message
    ? output.message.split('\n').map((m) => ({
        id: uuidv4(),
        text: m,
      }))
    : []
  return {
    header,
    body,
    modelFile: output.modelFile,
    messages: messages,
  }
}

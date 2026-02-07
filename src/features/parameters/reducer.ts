import { uuidv4 } from '../../shared/helpers'
import type { Message, Parameter, Parameters } from '../../types'

export type ParametersAction =
  | {
      type: 'changeParameter'
      payload: {
        id: string
        field: 'name' | 'values'
        value: string
      }
    }
  | {
      type: 'addRow'
      payload: {
        id: string
        target: 'above' | 'below'
        newParameterId: string
      }
    }
  | {
      type: 'removeRow'
      payload: {
        id: string
      }
    }
  | {
      type: 'clear'
      payload: {
        newParameterIds: string[]
      }
    }

const invalidParameterNameCharacters = [
  '#', // comments identifier, constraints operator
  ':', // parameter and values separator
  '<', // values reference identifier, constraints operator
  '>', // values reference identifier, constraints operator
  '(', // values weight identifier
  ')', // values weight identifier
  '|', // values alias identifier
  ',', // values separator
  '~', // values negation identifier
  '{', // sub-models identifier
  '}', // sub-models identifier
  '@', // sub-models identifier
  '[', // constraints parameter identifier
  ']', // constraints parameter identifier
  ';', // constraints terminator
  '=', // constraints operator
  '!', // constraints operator
  '+', // constraints operator
  '&', // constraints operator
  '*', // pattern string wildcard
  '?', // pattern string wildcard
]

const invalidParameterValuesCharacters = [
  '#', // comments identifier, constraints operator
  ':', // parameter and values separator
  '{', // sub-models identifier
  '}', // sub-models identifier
  '@', // sub-models identifier
  '[', // constraints parameter identifier
  ']', // constraints parameter identifier
  ';', // constraints terminator
  '=', // constraints operator
  '!', // constraints operator
  '+', // constraints operator
  '&', // constraints operator
  '*', // pattern string wildcard
  '?', // pattern string wildcard
]

export function parametersReducer(
  state: Parameters,
  action: ParametersAction,
): Parameters {
  switch (action.type) {
    case 'changeParameter': {
      const { id, field, value } = action.payload
      const newParameters = structuredClone<Parameter[]>(state.parameters)
      // Reset validation flags
      for (const parameter of newParameters) {
        parameter.isValidName = true
        parameter.isValidValues = true
      }
      const newParameter = newParameters.find((p) => p.id === id)
      if (!newParameter) {
        // may not be reached
        return structuredClone(state)
      }
      newParameter[field] = value
      const errors: Message[] = []

      // Check for duplicate parameter
      if (field === 'name') {
        const parameterNames = newParameters.map((p) => p.name)
        const duplicates = parameterNames.filter(
          (item, index) => item && parameterNames.indexOf(item) !== index,
        )
        if (duplicates.length > 0) {
          for (const parameter of newParameters) {
            if (duplicates.includes(parameter.name)) {
              parameter.isValidName = false
            }
          }
          errors.push({ id: uuidv4(), text: 'Parameter names must be unique.' })
        }
      }

      // Check for invalid characters
      let invalidParameterName = false
      let invalidParameterValues = false
      for (const parameter of newParameters) {
        if (
          invalidParameterNameCharacters.some((char) =>
            parameter.name.includes(char),
          )
        ) {
          parameter.isValidName = false
          invalidParameterName = true
        }
        if (
          invalidParameterValuesCharacters.some((char) =>
            parameter.values.includes(char),
          )
        ) {
          parameter.isValidValues = false
          invalidParameterValues = true
        }
      }
      if (invalidParameterName) {
        errors.push({
          id: uuidv4(),
          text: `Parameter name cannot contain special characters: ${invalidParameterNameCharacters.map((s) => `"${s}"`).join(', ')}`,
        })
      }
      if (invalidParameterValues) {
        errors.push({
          id: uuidv4(),
          text: `Parameter values cannot contain special characters: ${invalidParameterValuesCharacters.map((s) => `"${s}"`).join(', ')}`,
        })
      }

      return {
        parameters: newParameters,
        parameterErrors: errors,
      }
    }

    case 'addRow': {
      const { id, target, newParameterId } = action.payload
      if (state.parameters.length >= 25) {
        // may not be reached
        return structuredClone(state)
      }

      const oldParameters = structuredClone<Parameter[]>(state.parameters)
      const newParameters: Parameter[] = []
      for (const p of oldParameters) {
        if (p.id === id) {
          const newParameter: Parameter = {
            id: newParameterId,
            name: '',
            values: '',
            isValidName: true,
            isValidValues: true,
          }
          switch (target) {
            case 'above':
              newParameters.push(newParameter)
              newParameters.push(p)
              break
            case 'below':
              newParameters.push(p)
              newParameters.push(newParameter)
              break
          }
        } else {
          newParameters.push(p)
        }
      }

      return {
        parameters: newParameters,
        parameterErrors: structuredClone(state.parameterErrors),
      }
    }

    case 'removeRow': {
      const { id } = action.payload
      if (state.parameters.length <= 1) {
        // may not be reached
        return structuredClone(state)
      }
      const newParameters = state.parameters.filter((p) => p.id !== id)
      return {
        parameters: newParameters,
        parameterErrors: structuredClone(state.parameterErrors),
      }
    }

    case 'clear': {
      const { newParameterIds } = action.payload
      const emptyParameters: Parameter[] = state.parameters.map((_, index) => ({
        id: newParameterIds[index],
        name: '',
        values: '',
        isValidName: true,
        isValidValues: true,
      }))
      return {
        parameters: emptyParameters,
        parameterErrors: [],
      }
    }
  }
}

export function getInitialParameters(): Parameters {
  return {
    parameters: [
      {
        id: uuidv4(),
        name: 'Type',
        values: 'Single, Span, Stripe, Mirror, RAID-5',
        isValidName: true,
        isValidValues: true,
      },
      {
        id: uuidv4(),
        name: 'Size',
        values: '10, 100, 500, 1000, 5000, 10000, 40000',
        isValidName: true,
        isValidValues: true,
      },
      {
        id: uuidv4(),
        name: 'Format method',
        values: 'Quick, Slow',
        isValidName: true,
        isValidValues: true,
      },
      {
        id: uuidv4(),
        name: 'File system',
        values: 'FAT, FAT32, NTFS',
        isValidName: true,
        isValidValues: true,
      },
      {
        id: uuidv4(),
        name: 'Cluster size',
        values: '512, 1024, 2048, 4096, 8192, 16384, 32768, 65536',
        isValidName: true,
        isValidValues: true,
      },
      {
        id: uuidv4(),
        name: 'Compression',
        values: 'ON, OFF',
        isValidName: true,
        isValidValues: true,
      },
    ],
    parameterErrors: [],
  }
}

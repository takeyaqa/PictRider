import { PictConstraint, PictParameter, PictCondition } from '../types'
import { uuidv4 } from '../helpers'

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

const invalidConstraintCharacters = [
  ':', // parameter and values separator
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
]

interface PictModel {
  parameters: PictParameter[]
  constraints: PictConstraint[]
  parameterErrors: string[]
  constraintErrors: string[]
}

type ModelAction =
  | {
      type: 'changeParameter'
      payload: {
        id: string
        field: 'name' | 'values'
        e: React.ChangeEvent<HTMLInputElement>
      }
    }
  | {
      type: 'toggleCondition'
      payload: {
        constraintId: string
        parameterId: string
      }
    }
  | {
      type: 'changeCondition'
      payload: {
        constraintId: string
        parameterId: string
        e: React.ChangeEvent<HTMLInputElement>
      }
    }
  | {
      type:
        | 'clickAddRow'
        | 'clickRemoveRow'
        | 'clickClear'
        | 'clickAddConstraint'
        | 'clickRemoveConstraint'
    }

export function modelReducer(state: PictModel, action: ModelAction): PictModel {
  // Copy the state to avoid mutating it directly
  const newParameters = state.parameters.map((parameter) => ({
    ...parameter,
  }))
  const newConstraints = state.constraints.map((constraint) => ({
    ...constraint,
    conditions: constraint.conditions.map((condition) => ({
      ...condition,
    })),
  }))
  const newParameterErrors = [...state.parameterErrors]
  const newConstraintErrors = [...state.constraintErrors]

  switch (action.type) {
    case 'changeParameter': {
      const { id, field, e } = action.payload
      // Reset validation flags
      for (const parameter of newParameters) {
        parameter.isValidName = true
        parameter.isValidValues = true
      }
      const newParameter = newParameters.find((p) => p.id === id)
      if (!newParameter) {
        return {
          parameters: newParameters,
          constraints: newConstraints,
          parameterErrors: newParameterErrors,
          constraintErrors: newConstraintErrors,
        }
      }
      newParameter[field] = e.target.value
      const errors: string[] = []

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
          errors.push('Parameter names must be unique.')
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
        errors.push(
          `Parameter name cannot contain special characters: ${invalidParameterNameCharacters.map((s) => `"${s}"`).join(', ')}`,
        )
      }
      if (invalidParameterValues) {
        errors.push(
          `Parameter values cannot contain special characters: ${invalidParameterValuesCharacters.map((s) => `"${s}"`).join(', ')}`,
        )
      }

      return {
        parameters: newParameters,
        constraints: newConstraints,
        parameterErrors: errors,
        constraintErrors: newConstraintErrors,
      }
    }

    case 'clickAddRow': {
      // Limit to maximum 50 rows
      if (state.parameters.length >= 50) {
        return {
          parameters: newParameters,
          constraints: newConstraints,
          parameterErrors: newParameterErrors,
          constraintErrors: newConstraintErrors,
        }
      }

      const newParameter = {
        id: uuidv4(),
        name: '',
        values: '',
        isValidName: true,
        isValidValues: true,
      }
      for (const newConstraint of newConstraints) {
        newConstraint.conditions.push({
          ifOrThen: 'if',
          predicate: '',
          parameterId: newParameter.id,
          isValid: true,
        })
      }
      return {
        parameters: [...newParameters, newParameter],
        constraints: newConstraints,
        parameterErrors: newParameterErrors,
        constraintErrors: newConstraintErrors,
      }
    }

    case 'clickRemoveRow': {
      if (state.parameters.length <= 1) {
        return {
          parameters: newParameters,
          constraints: newConstraints,
          parameterErrors: newParameterErrors,
          constraintErrors: newConstraintErrors,
        }
      }

      newParameters.pop()
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < newConstraints.length; i++) {
        newConstraints[i].conditions.pop()
      }
      return {
        parameters: newParameters,
        constraints: newConstraints,
        parameterErrors: newParameterErrors,
        constraintErrors: newConstraintErrors,
      }
    }

    case 'clickClear': {
      const emptyParameters = state.parameters.map(() => ({
        id: uuidv4(),
        name: '',
        values: '',
        isValidName: true,
        isValidValues: true,
      }))
      return {
        parameters: emptyParameters,
        constraints: [createConstraintFromParameters(emptyParameters)],
        parameterErrors: [],
        constraintErrors: [],
      }
    }

    case 'toggleCondition': {
      const { constraintId, parameterId } = action.payload
      const newCondition = searchCondition(
        newConstraints,
        constraintId,
        parameterId,
      )
      newCondition.ifOrThen = newCondition.ifOrThen === 'if' ? 'then' : 'if'

      return {
        parameters: newParameters,
        constraints: newConstraints,
        parameterErrors: newParameterErrors,
        constraintErrors: newConstraintErrors,
      }
    }

    case 'changeCondition': {
      const { constraintId, parameterId, e } = action.payload
      const newCondition = searchCondition(
        newConstraints,
        constraintId,
        parameterId,
      )
      newCondition.predicate = e.target.value
      // Reset validation flags
      for (const condition of newConstraints) {
        for (const c of condition.conditions) {
          c.isValid = true
        }
      }
      // Check for invalid characters
      const errors: string[] = []
      let invalidConstraint = false
      for (const constraint of newConstraints) {
        for (const condition of constraint.conditions) {
          if (
            invalidConstraintCharacters.some((char) =>
              condition.predicate.includes(char),
            )
          ) {
            condition.isValid = false
            invalidConstraint = true
          }
        }
      }
      if (invalidConstraint) {
        errors.push(
          `Constraints cannot contain special characters: ${invalidConstraintCharacters.map((s) => `"${s}"`).join(', ')}`,
        )
      }
      return {
        parameters: newParameters,
        constraints: newConstraints,
        parameterErrors: newParameterErrors,
        constraintErrors: errors,
      }
    }

    case 'clickAddConstraint': {
      // Limit to maximum 50 constraints
      if (state.constraints.length >= 50) {
        return {
          parameters: newParameters,
          constraints: newConstraints,
          parameterErrors: newParameterErrors,
          constraintErrors: newConstraintErrors,
        }
      }
      return {
        parameters: newParameters,
        constraints: [
          ...newConstraints,
          createConstraintFromParameters(state.parameters),
        ],
        parameterErrors: newParameterErrors,
        constraintErrors: newConstraintErrors,
      }
    }

    case 'clickRemoveConstraint': {
      if (state.constraints.length <= 1) {
        return {
          parameters: newParameters,
          constraints: newConstraints,
          parameterErrors: newParameterErrors,
          constraintErrors: newConstraintErrors,
        }
      }
      newConstraints.pop()
      return {
        parameters: newParameters,
        constraints: newConstraints,
        parameterErrors: newParameterErrors,
        constraintErrors: newConstraintErrors,
      }
    }
  }
}

export function getInitialModel(): PictModel {
  const initialParameters = [
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
  ]
  return {
    parameters: initialParameters,
    parameterErrors: [],
    constraints: [createConstraintFromParameters(initialParameters)],
    constraintErrors: [],
  }
}

function createConstraintFromParameters(
  parameters: PictParameter[],
): PictConstraint {
  const conditions: PictCondition[] = parameters.map((p) => {
    return {
      ifOrThen: 'if',
      predicate: '',
      parameterId: p.id,
      isValid: true,
    }
  })
  return { id: uuidv4(), conditions: conditions }
}

function searchCondition(
  constraints: PictConstraint[],
  constraintId: string,
  parameterId: string,
): PictCondition {
  const constraint = constraints.find((c) => c.id === constraintId)
  if (!constraint) {
    throw new Error('Constraint not found')
  }
  const condition = constraint.conditions.find(
    (p) => p.parameterId === parameterId,
  )
  if (!condition) {
    throw new Error('Condition not found')
  }
  return condition
}

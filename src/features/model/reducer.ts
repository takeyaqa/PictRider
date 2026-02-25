import type { Draft } from 'immer'
import { parseConstraints } from '../../pict-constraints-parser'
import { fixConstraint, printConstraints, uuidv4 } from '../../shared/helpers'
import type {
  Message,
  Parameter,
  Model,
  Condition,
  Constraint,
} from '../../types'

export type ModelAction =
  // Parameter actions
  | {
      type: 'changeParameter'
      payload: {
        id: string
        field: 'name' | 'values'
        value: string
      }
    }
  | {
      type: 'addParameterRow'
      payload: {
        id: string
        target: 'above' | 'below'
      }
    }
  | {
      type: 'removeParameterRow'
      payload: {
        id: string
      }
    }
  // Constraint actions
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
        value: string
      }
    }
  | {
      type: 'changeConstraintFormula'
      payload: {
        value: string
      }
    }
  | {
      type: 'validateConstraintFormula'
      payload: {
        value: string
      }
    }
  | {
      type: 'addConstraint'
    }
  | {
      type: 'removeConstraint'
    }
  | {
      type: 'toggleConstraintDirectEditMode'
    }
  | {
      type: 'resetConstraints'
    }
  // Sub-Model actions
  | {
      type: 'clickSubModelParameters'
      payload: {
        subModelId: string
        parameterId: string
        checked: boolean
      }
    }
  | {
      type: 'changeSubModelOrder'
      payload: {
        id: string
        order: number
      }
    }
  | {
      type: 'addSubModel'
    }
  | {
      type: 'removeSubModel'
    }
  // global actions
  | {
      type: 'clear'
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

const invalidConstraintCharacters = [
  ':', // parameter and values separator
  '(', // values weight identifier
  ')', // values weight identifier
  '|', // values alias identifier
  '~', // values negation identifier
  '{', // sub-models identifier
  '}', // sub-models identifier
  '@', // sub-models identifier
  '[', // constraints parameter identifier
  ']', // constraints parameter identifier
  ';', // constraints terminator
]

export function modelReducer(draft: Draft<Model>, action: ModelAction): void {
  switch (action.type) {
    case 'changeParameter': {
      const { id, field, value } = action.payload
      // Reset validation flags
      for (const parameter of draft.parameters) {
        parameter.isValidName = true
        parameter.isValidValues = true
      }
      const newParameter = draft.parameters.find((p) => p.id === id)
      if (!newParameter) {
        // may not be reached
        break
      }
      newParameter[field] = value
      const errors: Message[] = []

      // Check for duplicate parameter
      if (field === 'name') {
        const parameterNames = draft.parameters.map((p) => p.name)
        const duplicates = parameterNames.filter(
          (item, index) => item && parameterNames.indexOf(item) !== index,
        )
        if (duplicates.length > 0) {
          for (const parameter of draft.parameters) {
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
      for (const parameter of draft.parameters) {
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
      draft.parameterErrors = errors
      if (field === 'name') {
        syncConstraintTextsFromTable(draft)
      }

      break
    }

    case 'addParameterRow': {
      const { id, target } = action.payload
      if (draft.parameters.length >= 25) {
        // may not be reached
        break
      }

      // first, add parameter row
      const newParameterId = uuidv4()
      const newParameter: Parameter = {
        id: newParameterId,
        name: '',
        values: '',
        isValidName: true,
        isValidValues: true,
      }
      const parameterIndex = draft.parameters.findIndex((p) => p.id === id)
      if (parameterIndex >= 0) {
        const insertParameterIndex =
          target === 'above' ? parameterIndex : parameterIndex + 1
        draft.parameters.splice(insertParameterIndex, 0, newParameter)
      }

      // second, add condition row in constraints
      for (const constraint of draft.constraints) {
        const conditionIndex = constraint.conditions.findIndex(
          (condition) => condition.parameterId === id,
        )
        if (conditionIndex < 0) {
          continue
        }
        const newCondition: Condition = {
          ifOrThen: 'if',
          predicate: '',
          parameterId: newParameterId,
          isValid: true,
        }
        const insertConditionIndex =
          target === 'above' ? conditionIndex : conditionIndex + 1
        constraint.conditions.splice(insertConditionIndex, 0, newCondition)
      }
      syncConstraintTextsFromTable(draft)
      break
    }

    case 'removeParameterRow': {
      const { id } = action.payload
      if (draft.parameters.length <= 1) {
        // may not be reached
        break
      }

      // First, remove parameter from sub-models
      for (const subModel of draft.subModels) {
        let parameterIndex = subModel.parameterIds.findIndex(
          (parameterId) => parameterId === id,
        )
        while (parameterIndex >= 0) {
          subModel.parameterIds.splice(parameterIndex, 1)
          parameterIndex = subModel.parameterIds.findIndex(
            (parameterId) => parameterId === id,
          )
        }
      }

      // Second, remove condition row in constraints
      for (const constraint of draft.constraints) {
        let conditionIndex = constraint.conditions.findIndex(
          (condition) => condition.parameterId === id,
        )
        while (conditionIndex >= 0) {
          constraint.conditions.splice(conditionIndex, 1)
          conditionIndex = constraint.conditions.findIndex(
            (condition) => condition.parameterId === id,
          )
        }
      }

      // Third, remove parameter row
      let parameterIndex = draft.parameters.findIndex(
        (parameter) => parameter.id === id,
      )
      while (parameterIndex >= 0) {
        draft.parameters.splice(parameterIndex, 1)
        parameterIndex = draft.parameters.findIndex(
          (parameter) => parameter.id === id,
        )
      }
      syncConstraintTextsFromTable(draft)
      break
    }

    case 'toggleCondition': {
      const { constraintId, parameterId } = action.payload
      const newCondition = searchCondition(
        draft.constraints,
        constraintId,
        parameterId,
      )
      newCondition.ifOrThen = newCondition.ifOrThen === 'if' ? 'then' : 'if'

      draft.constraintTexts = printConstraints(
        fixConstraint(draft.constraints, draft.parameters),
      ).map((text) => ({
        id: uuidv4(),
        text,
      }))
      break
    }

    case 'changeCondition': {
      const { constraintId, parameterId, value } = action.payload
      const newCondition = searchCondition(
        draft.constraints,
        constraintId,
        parameterId,
      )
      newCondition.predicate = value
      // Reset validation flags
      for (const constraint of draft.constraints) {
        for (const condition of constraint.conditions) {
          condition.isValid = true
        }
      }
      // Check for invalid characters
      const errors: Message[] = []
      let invalidConstraint = false
      for (const constraint of draft.constraints) {
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
        errors.push({
          id: uuidv4(),
          text: `Constraints cannot contain special characters: ${invalidConstraintCharacters.map((s) => `"${s}"`).join(', ')}`,
        })
      }
      draft.constraintTexts = printConstraints(
        fixConstraint(draft.constraints, draft.parameters),
      ).map((text) => ({
        id: uuidv4(),
        text,
      }))
      draft.constraintErrors = errors
      draft.constraintSyntaxErrorLine = null
      break
    }

    case 'changeConstraintFormula': {
      const { value } = action.payload
      draft.constraintTexts = value.split('\n').map((text) => ({
        id: uuidv4(),
        text,
      }))
      break
    }

    case 'validateConstraintFormula': {
      if (!draft.constraintDirectEditMode) {
        break
      }
      const { value } = action.payload
      const parseResult = parseConstraints(value)
      if (parseResult.ok) {
        draft.constraintErrors = []
        draft.constraintSyntaxErrorLine = null
        break
      }
      const lineNumber = getLineNumberFromPosition(
        value,
        parseResult.error.position,
      )
      draft.constraintErrors = [
        {
          id: uuidv4(),
          text: `Constraint syntax error at line ${lineNumber.toString()}: ${parseResult.error.message}`,
        },
      ]
      draft.constraintSyntaxErrorLine = lineNumber
      break
    }

    case 'addConstraint': {
      if (draft.constraints.length >= 25) {
        // may not be reached
        break
      }
      draft.constraints.push(createConstraintFromParameters(draft.parameters))
      draft.constraintTexts.push({
        id: uuidv4(),
        text: '',
      })
      break
    }

    case 'removeConstraint': {
      if (draft.constraints.length <= 1) {
        // may not be reached
        break
      }
      draft.constraints.pop()
      draft.constraintTexts.pop()
      break
    }

    case 'toggleConstraintDirectEditMode': {
      draft.constraintDirectEditMode = !draft.constraintDirectEditMode
      break
    }

    case 'resetConstraints': {
      draft.constraints = [createConstraintFromParameters(draft.parameters)]
      draft.constraintTexts = []
      draft.constraintDirectEditMode = false
      draft.constraintErrors = []
      draft.constraintSyntaxErrorLine = null
      break
    }

    case 'clickSubModelParameters': {
      const { subModelId, parameterId, checked } = action.payload
      const target = draft.subModels.find((m) => m.id === subModelId)
      if (!target) {
        // may not be reached
        break
      }
      if (checked) {
        target.parameterIds.push(parameterId)
        break
      } else {
        let targetIndex = target.parameterIds.findIndex(
          (paramId) => paramId === parameterId,
        )
        while (targetIndex >= 0) {
          target.parameterIds.splice(targetIndex, 1)
          targetIndex = target.parameterIds.findIndex(
            (paramId) => paramId === parameterId,
          )
        }
        break
      }
    }

    case 'changeSubModelOrder': {
      const { id, order } = action.payload
      const target = draft.subModels.find((m) => m.id === id)
      if (!target) {
        // may not be reached
        break
      }
      target.order = order
      break
    }

    case 'addSubModel': {
      if (draft.subModels.length >= 2) {
        // may not be reached
        break
      }
      draft.subModels.push({
        id: uuidv4(),
        parameterIds: [],
        order: 2,
      })
      break
    }

    case 'removeSubModel': {
      if (draft.subModels.length <= 1) {
        // may not be reached
        break
      }
      draft.subModels.pop()
      break
    }

    case 'clear': {
      const newParameterIds = draft.parameters.map(() => uuidv4())
      draft.parameters = draft.parameters.map((_, index) => ({
        id: newParameterIds[index],
        name: '',
        values: '',
        isValidName: true,
        isValidValues: true,
      }))
      draft.parameterErrors = []
      draft.constraints = [createConstraintFromParameters(draft.parameters)]
      draft.constraintTexts = []
      draft.constraintDirectEditMode = false
      draft.constraintErrors = []
      draft.constraintSyntaxErrorLine = null
      draft.subModels = [
        {
          id: uuidv4(),
          parameterIds: [],
          order: 2,
        },
      ]
      break
    }
  }
}

export function getInitialModel(): Model {
  const parameters = [
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
    parameters: parameters,
    constraints: [createConstraintFromParameters(parameters)],
    constraintTexts: [],
    constraintDirectEditMode: false,
    constraintSyntaxErrorLine: null,
    subModels: [
      {
        id: uuidv4(),
        parameterIds: [],
        order: 2,
      },
    ],
    parameterErrors: [],
    constraintErrors: [],
  }
}

function createConstraintFromParameters(parameters: Parameter[]): Constraint {
  const conditions: Condition[] = parameters.map((p) => {
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
  constraints: Constraint[],
  constraintId: string,
  parameterId: string,
): Condition {
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

function syncConstraintTextsFromTable(draft: Draft<Model>): void {
  if (draft.constraintDirectEditMode) {
    return
  }
  draft.constraintTexts = printConstraints(
    fixConstraint(draft.constraints, draft.parameters),
  ).map((text) => ({
    id: uuidv4(),
    text,
  }))
}

function getLineNumberFromPosition(value: string, position: number): number {
  if (position <= 0) {
    return 1
  }
  return value.slice(0, position).split('\n').length
}

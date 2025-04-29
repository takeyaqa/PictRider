import {
  Constraint,
  Parameter,
  Condition,
  Model,
  SubModel,
  ConstraintText,
  Message,
} from '../types'
import { fixConstraint, printConstraints, uuidv4 } from '../helpers'

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
      type: 'changeConstraintFormula'
      payload: {
        e: React.ChangeEvent<HTMLTextAreaElement>
      }
    }
  | {
      type:
        | 'clickAddRow'
        | 'clickRemoveRow'
        | 'clickClear'
        | 'clickAddConstraint'
        | 'clickRemoveConstraint'
        | 'toggleConstraintDirectEditMode'
    }

export function modelReducer(state: Model, action: ModelAction): Model {
  switch (action.type) {
    case 'changeParameter': {
      const { id, field, e } = action.payload
      const newParameters = copyParameters(state.parameters)
      // Reset validation flags
      for (const parameter of newParameters) {
        parameter.isValidName = true
        parameter.isValidValues = true
      }
      const newParameter = newParameters.find((p) => p.id === id)
      if (!newParameter) {
        // may not be reached
        return copyModel(state)
      }
      newParameter[field] = e.target.value
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
        ...copyModel(state),
        parameters: newParameters,
        constraintTexts: state.constraintDirectEditMode
          ? copyConstraintTexts(state.constraintTexts)
          : printConstraints(
              fixConstraint(state.constraints, newParameters),
              newParameters.map((p) => p.name),
            ).map((text) => ({
              id: uuidv4(),
              text,
            })),
        parameterErrors: errors,
      }
    }

    case 'clickAddRow': {
      if (state.parameters.length >= 50) {
        // may not be reached
        return copyModel(state)
      }

      const newParameter = {
        id: uuidv4(),
        name: '',
        values: '',
        isValidName: true,
        isValidValues: true,
      }
      const newConstraints = copyConstraints(state.constraints)
      for (const newConstraint of newConstraints) {
        newConstraint.conditions.push({
          ifOrThen: 'if',
          predicate: '',
          parameterId: newParameter.id,
          isValid: true,
        })
      }
      return {
        ...copyModel(state),
        parameters: [...copyParameters(state.parameters), newParameter],
        constraints: newConstraints,
      }
    }

    case 'clickRemoveRow': {
      if (state.parameters.length <= 1) {
        // may not be reached
        return copyModel(state)
      }
      const newParameters = copyParameters(state.parameters)
      const removedParameter = newParameters.pop()
      const newConstraints = copyConstraints(state.constraints)
      newConstraints.forEach((c) => c.conditions.pop())
      const newSubModels = state.subModels.map((subModel) => {
        return {
          ...subModel,
          parameterIds: subModel.parameterIds.filter(
            (id) => id !== removedParameter?.id,
          ),
        }
      })
      return {
        ...copyModel(state),
        parameters: newParameters,
        subModels: newSubModels,
        constraints: newConstraints,
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
        subModels: [
          {
            id: uuidv4(),
            parameterIds: [],
            order: 2,
          },
        ],
        constraints: [createConstraintFromParameters(emptyParameters)],
        constraintTexts: [],
        constraintDirectEditMode: false,
        parameterErrors: [],
        constraintErrors: [],
      }
    }

    case 'clickSubModelParameters': {
      const { subModelId, parameterId, checked } = action.payload
      const newSubModels = copySubModels(state.subModels)
      const target = newSubModels.find((m) => m.id === subModelId)
      if (!target) {
        // may not be reached
        return copyModel(state)
      }
      if (checked) {
        const newParameterIds = [...target.parameterIds, parameterId]
        return {
          ...copyModel(state),
          subModels: newSubModels.map((m) =>
            m.id === subModelId ? { ...m, parameterIds: newParameterIds } : m,
          ),
        }
      } else {
        const newParameterIds = target.parameterIds.filter(
          (paramId) => paramId !== parameterId,
        )
        return {
          ...copyModel(state),
          subModels: newSubModels.map((m) =>
            m.id === subModelId ? { ...m, parameterIds: newParameterIds } : m,
          ),
        }
      }
    }

    case 'changeSubModelOrder': {
      const { id, e } = action.payload
      const newSubModels = copySubModels(state.subModels)
      const target = newSubModels.find((m) => m.id === id)
      if (!target) {
        // may not be reached
        return copyModel(state)
      }
      const newOrder = Number(e.target.value)
      return {
        ...copyModel(state),
        subModels: newSubModels.map((m) =>
          m.id === id ? { ...m, order: newOrder } : m,
        ),
      }
    }

    case 'toggleCondition': {
      const { constraintId, parameterId } = action.payload
      const newConstraints = copyConstraints(state.constraints)
      const newCondition = searchCondition(
        newConstraints,
        constraintId,
        parameterId,
      )
      newCondition.ifOrThen = newCondition.ifOrThen === 'if' ? 'then' : 'if'

      return {
        ...copyModel(state),
        constraints: newConstraints,
        constraintTexts: printConstraints(
          fixConstraint(newConstraints, state.parameters),
          state.parameters.map((p) => p.name),
        ).map((text) => ({
          id: uuidv4(),
          text,
        })),
      }
    }

    case 'changeCondition': {
      const { constraintId, parameterId, e } = action.payload
      const newConstraints = copyConstraints(state.constraints)
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
      const errors: Message[] = []
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
        errors.push({
          id: uuidv4(),
          text: `Constraints cannot contain special characters: ${invalidConstraintCharacters.map((s) => `"${s}"`).join(', ')}`,
        })
      }
      return {
        ...copyModel(state),
        constraints: newConstraints,
        constraintTexts: printConstraints(
          fixConstraint(newConstraints, state.parameters),
          state.parameters.map((p) => p.name),
        ).map((text) => ({
          id: uuidv4(),
          text,
        })),
        constraintErrors: errors,
      }
    }

    case 'changeConstraintFormula': {
      const { e } = action.payload
      return {
        ...copyModel(state),
        constraintTexts: e.target.value.split('\n').map((text) => ({
          id: uuidv4(),
          text,
        })),
      }
    }

    case 'clickAddConstraint': {
      if (state.constraints.length >= 50) {
        // may not be reached
        return copyModel(state)
      }
      return {
        ...copyModel(state),
        constraints: [
          ...copyConstraints(state.constraints),
          createConstraintFromParameters(state.parameters),
        ],
        constraintTexts: [
          ...copyConstraintTexts(state.constraintTexts),
          {
            id: uuidv4(),
            text: '',
          },
        ],
      }
    }

    case 'clickRemoveConstraint': {
      if (state.constraints.length <= 1) {
        // may not be reached
        return copyModel(state)
      }
      const newConstraints = copyConstraints(state.constraints)
      const newConstraintsText = copyConstraintTexts(state.constraintTexts)
      newConstraints.pop()
      newConstraintsText.pop()
      return {
        ...copyModel(state),
        constraints: newConstraints,
        constraintTexts: newConstraintsText,
      }
    }

    case 'toggleConstraintDirectEditMode': {
      return {
        ...copyModel(state),
        constraintDirectEditMode: !state.constraintDirectEditMode,
      }
    }
  }
}

function deepCopyArray<T>(array: T[]): T[] {
  return array.map((item) => ({ ...item }))
}

function copyParameters(parameters: Parameter[]): Parameter[] {
  return deepCopyArray(parameters)
}

function copySubModels(subModels: SubModel[]): SubModel[] {
  return subModels.map((m) => ({
    ...m,
    parameterIds: [...m.parameterIds],
  }))
}

function copyConstraints(constraints: Constraint[]): Constraint[] {
  return constraints.map((c) => ({
    ...c,
    conditions: c.conditions.map((cc) => ({ ...cc })),
  }))
}

function copyConstraintTexts(
  constraintTexts: ConstraintText[],
): ConstraintText[] {
  return deepCopyArray(constraintTexts)
}

function copyMessage(messages: Message[]): Message[] {
  return deepCopyArray(messages)
}

function copyModel(state: Model): Model {
  return {
    parameters: copyParameters(state.parameters),
    subModels: copySubModels(state.subModels),
    constraints: copyConstraints(state.constraints),
    constraintTexts: copyConstraintTexts(state.constraintTexts),
    constraintDirectEditMode: state.constraintDirectEditMode,
    parameterErrors: copyMessage(state.parameterErrors),
    constraintErrors: copyMessage(state.constraintErrors),
  }
}

export function getInitialModel(): Model {
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
    subModels: [
      {
        id: uuidv4(),
        parameterIds: [],
        order: 2,
      },
    ],
    constraints: [createConstraintFromParameters(initialParameters)],
    constraintTexts: [],
    constraintDirectEditMode: false,
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

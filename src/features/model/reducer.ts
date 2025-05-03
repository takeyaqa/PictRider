import { Constraint, Parameter, Condition, Model, Message } from '../../types'
import { fixConstraint, printConstraints, uuidv4 } from '../../helpers'

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
      type: 'clickAddRow'
      payload: {
        id: string
        target: 'above' | 'below'
      }
    }
  | {
      type: 'clickRemoveRow'
      payload: {
        id: string
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
        | 'clickClear'
        | 'clickAddConstraint'
        | 'clickRemoveConstraint'
        | 'toggleConstraintDirectEditMode'
        | 'clickResetConstraints'
        | 'clickAddSubModel'
        | 'clickRemoveSubModel'
    }

export function modelReducer(state: Model, action: ModelAction): Model {
  switch (action.type) {
    case 'changeParameter': {
      const { id, field, e } = action.payload
      const newParameters = structuredClone(state.parameters)
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
        ...structuredClone(state),
        parameters: newParameters,
        constraintTexts: state.constraintDirectEditMode
          ? structuredClone(state.constraintTexts)
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
      const { id, target } = action.payload
      if (state.parameters.length >= 50) {
        // may not be reached
        return structuredClone(state)
      }

      const newParameters: Parameter[] = []
      const newParameterId = uuidv4()
      for (const p of structuredClone(state.parameters)) {
        if (p.id === id) {
          const newParameter = {
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
      const newConstraints: Constraint[] = []
      for (const c of structuredClone(state.constraints)) {
        const newConditions: Condition[] = []
        for (const cc of c.conditions) {
          if (cc.parameterId === id) {
            const newCondition: Condition = {
              ifOrThen: 'if',
              predicate: '',
              parameterId: newParameterId,
              isValid: true,
            }
            switch (target) {
              case 'above':
                newConditions.push(newCondition)
                newConditions.push(cc)
                break
              case 'below':
                newConditions.push(cc)
                newConditions.push(newCondition)
                break
            }
          } else {
            newConditions.push(cc)
          }
        }
        newConstraints.push({
          ...c,
          conditions: newConditions,
        })
      }

      return {
        ...structuredClone(state),
        parameters: newParameters,
        constraints: newConstraints,
      }
    }

    case 'clickRemoveRow': {
      const { id } = action.payload
      if (state.parameters.length <= 1) {
        // may not be reached
        return structuredClone(state)
      }
      const newParameters = state.parameters.filter((p) => p.id !== id)
      const newConstraints = state.constraints.map((c) => {
        return {
          ...c,
          conditions: c.conditions.filter((cc) => cc.parameterId !== id),
        }
      })
      const newSubModels = state.subModels.map((subModel) => {
        return {
          ...subModel,
          parameterIds: subModel.parameterIds.filter((i) => i !== id),
        }
      })
      return {
        ...structuredClone(state),
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
      const newSubModels = structuredClone(state.subModels)
      const target = newSubModels.find((m) => m.id === subModelId)
      if (!target) {
        // may not be reached
        return structuredClone(state)
      }
      if (checked) {
        const newParameterIds = [...target.parameterIds, parameterId]
        return {
          ...structuredClone(state),
          subModels: newSubModels.map((m) =>
            m.id === subModelId ? { ...m, parameterIds: newParameterIds } : m,
          ),
        }
      } else {
        const newParameterIds = target.parameterIds.filter(
          (paramId) => paramId !== parameterId,
        )
        return {
          ...structuredClone(state),
          subModels: newSubModels.map((m) =>
            m.id === subModelId ? { ...m, parameterIds: newParameterIds } : m,
          ),
        }
      }
    }

    case 'changeSubModelOrder': {
      const { id, e } = action.payload
      const newSubModels = structuredClone(state.subModels)
      const target = newSubModels.find((m) => m.id === id)
      if (!target) {
        // may not be reached
        return structuredClone(state)
      }
      const newOrder = Number(e.target.value)
      return {
        ...structuredClone(state),
        subModels: newSubModels.map((m) =>
          m.id === id ? { ...m, order: newOrder } : m,
        ),
      }
    }

    case 'toggleCondition': {
      const { constraintId, parameterId } = action.payload
      const newConstraints = structuredClone(state.constraints)
      const newCondition = searchCondition(
        newConstraints,
        constraintId,
        parameterId,
      )
      newCondition.ifOrThen = newCondition.ifOrThen === 'if' ? 'then' : 'if'

      return {
        ...structuredClone(state),
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
      const newConstraints = structuredClone(state.constraints)
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
        ...structuredClone(state),
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
        ...structuredClone(state),
        constraintTexts: e.target.value.split('\n').map((text) => ({
          id: uuidv4(),
          text,
        })),
      }
    }

    case 'clickAddConstraint': {
      if (state.constraints.length >= 50) {
        // may not be reached
        return structuredClone(state)
      }
      return {
        ...structuredClone(state),
        constraints: [
          ...structuredClone(state.constraints),
          createConstraintFromParameters(state.parameters),
        ],
        constraintTexts: [
          ...structuredClone(state.constraintTexts),
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
        return structuredClone(state)
      }
      const newConstraints = structuredClone(state.constraints)
      const newConstraintsText = structuredClone(state.constraintTexts)
      newConstraints.pop()
      newConstraintsText.pop()
      return {
        ...structuredClone(state),
        constraints: newConstraints,
        constraintTexts: newConstraintsText,
      }
    }

    case 'toggleConstraintDirectEditMode': {
      return {
        ...structuredClone(state),
        constraintDirectEditMode: !state.constraintDirectEditMode,
      }
    }

    case 'clickResetConstraints': {
      return {
        ...structuredClone(state),
        constraints: [createConstraintFromParameters(state.parameters)],
        constraintTexts: [],
        constraintDirectEditMode: false,
        constraintErrors: [],
      }
    }

    case 'clickAddSubModel': {
      if (state.subModels.length >= 2) {
        // may not be reached
        return structuredClone(state)
      }
      return {
        ...structuredClone(state),
        subModels: [
          ...structuredClone(state.subModels),
          {
            id: uuidv4(),
            parameterIds: [],
            order: 2,
          },
        ],
      }
    }

    case 'clickRemoveSubModel': {
      if (state.subModels.length <= 1) {
        // may not be reached
        return structuredClone(state)
      }
      const newSubModels = structuredClone(state.subModels)
      newSubModels.pop()
      return {
        ...structuredClone(state),
        subModels: newSubModels,
      }
    }
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

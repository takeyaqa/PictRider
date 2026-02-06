import { fixConstraint, printConstraints, uuidv4 } from '../../shared/helpers'
import type {
  Condition,
  Constraint,
  ConstraintsState,
  Message,
  Parameter,
} from '../../types'

export type ConstraintsAction =
  | {
      type: 'toggleCondition'
      payload: {
        constraintId: string
        parameterId: string
        parameters: Parameter[]
      }
    }
  | {
      type: 'changeCondition'
      payload: {
        constraintId: string
        parameterId: string
        value: string
        parameters: Parameter[]
      }
    }
  | {
      type: 'changeConstraintFormula'
      payload: {
        value: string
      }
    }
  | {
      type: 'addConstraint'
      payload: {
        parameters: Parameter[]
      }
    }
  | {
      type: 'removeConstraint'
    }
  | {
      type: 'toggleConstraintDirectEditMode'
    }
  | {
      type: 'resetConstraints'
      payload: {
        parameters: Parameter[]
      }
    }
  | {
      type: 'addCondition'
      payload: {
        id: string
        target: 'above' | 'below'
        newParameterId: string
      }
    }
  | {
      type: 'removeCondition'
      payload: {
        parameterId: string
      }
    }
  | {
      type: 'updateConstraintTexts'
      payload: {
        parameters: Parameter[]
      }
    }
  | {
      type: 'clear'
      payload: {
        parameters: Parameter[]
      }
    }

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

export function constraintsReducer(
  state: ConstraintsState,
  action: ConstraintsAction,
): ConstraintsState {
  switch (action.type) {
    case 'toggleCondition': {
      const { constraintId, parameterId, parameters } = action.payload
      const newConstraints = structuredClone<Constraint[]>(state.constraints)
      const newCondition = searchCondition(
        newConstraints,
        constraintId,
        parameterId,
      )
      newCondition.ifOrThen = newCondition.ifOrThen === 'if' ? 'then' : 'if'

      return {
        constraints: newConstraints,
        constraintTexts: printConstraints(
          fixConstraint(newConstraints, parameters),
        ).map((text) => ({
          id: uuidv4(),
          text,
        })),
        constraintDirectEditMode: state.constraintDirectEditMode,
        constraintErrors: structuredClone(state.constraintErrors),
      }
    }

    case 'changeCondition': {
      const { constraintId, parameterId, value, parameters } = action.payload
      const newConstraints = structuredClone<Constraint[]>(state.constraints)
      const newCondition = searchCondition(
        newConstraints,
        constraintId,
        parameterId,
      )
      newCondition.predicate = value
      // Reset validation flags
      for (const constraint of newConstraints) {
        for (const condition of constraint.conditions) {
          condition.isValid = true
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
        constraints: newConstraints,
        constraintTexts: printConstraints(
          fixConstraint(newConstraints, parameters),
        ).map((text) => ({
          id: uuidv4(),
          text,
        })),
        constraintDirectEditMode: state.constraintDirectEditMode,
        constraintErrors: errors,
      }
    }

    case 'changeConstraintFormula': {
      const { value } = action.payload
      return {
        constraints: structuredClone(state.constraints),
        constraintTexts: value.split('\n').map((text) => ({
          id: uuidv4(),
          text,
        })),
        constraintDirectEditMode: state.constraintDirectEditMode,
        constraintErrors: structuredClone(state.constraintErrors),
      }
    }

    case 'addConstraint': {
      const { parameters } = action.payload
      if (state.constraints.length >= 25) {
        // may not be reached
        return structuredClone(state)
      }
      return {
        constraints: [
          ...structuredClone(state.constraints),
          createConstraintFromParameters(parameters),
        ],
        constraintTexts: [
          ...structuredClone(state.constraintTexts),
          {
            id: uuidv4(),
            text: '',
          },
        ],
        constraintDirectEditMode: state.constraintDirectEditMode,
        constraintErrors: structuredClone(state.constraintErrors),
      }
    }

    case 'removeConstraint': {
      if (state.constraints.length <= 1) {
        // may not be reached
        return structuredClone(state)
      }
      const newConstraints = structuredClone<Constraint[]>(state.constraints)
      const newConstraintsText = structuredClone(state.constraintTexts)
      newConstraints.pop()
      newConstraintsText.pop()
      return {
        constraints: newConstraints,
        constraintTexts: newConstraintsText,
        constraintDirectEditMode: state.constraintDirectEditMode,
        constraintErrors: structuredClone(state.constraintErrors),
      }
    }

    case 'toggleConstraintDirectEditMode': {
      return {
        constraints: structuredClone(state.constraints),
        constraintTexts: structuredClone(state.constraintTexts),
        constraintDirectEditMode: !state.constraintDirectEditMode,
        constraintErrors: structuredClone(state.constraintErrors),
      }
    }

    case 'resetConstraints': {
      const { parameters } = action.payload
      return {
        constraints: [createConstraintFromParameters(parameters)],
        constraintTexts: [],
        constraintDirectEditMode: false,
        constraintErrors: [],
      }
    }

    case 'addCondition': {
      const { id, target, newParameterId } = action.payload
      const oldConstraints = structuredClone<Constraint[]>(state.constraints)
      const newConstraints: Constraint[] = []
      for (const c of oldConstraints) {
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
        constraints: newConstraints,
        constraintTexts: structuredClone(state.constraintTexts),
        constraintDirectEditMode: state.constraintDirectEditMode,
        constraintErrors: structuredClone(state.constraintErrors),
      }
    }

    case 'removeCondition': {
      const { parameterId } = action.payload
      const newConstraints = state.constraints.map((c) => {
        return {
          ...c,
          conditions: c.conditions.filter(
            (cc) => cc.parameterId !== parameterId,
          ),
        }
      })
      return {
        constraints: newConstraints,
        constraintTexts: structuredClone(state.constraintTexts),
        constraintDirectEditMode: state.constraintDirectEditMode,
        constraintErrors: structuredClone(state.constraintErrors),
      }
    }

    case 'updateConstraintTexts': {
      const { parameters } = action.payload
      if (state.constraintDirectEditMode) {
        return structuredClone(state)
      }
      return {
        constraints: structuredClone(state.constraints),
        constraintTexts: printConstraints(
          fixConstraint(state.constraints, parameters),
        ).map((text) => ({
          id: uuidv4(),
          text,
        })),
        constraintDirectEditMode: state.constraintDirectEditMode,
        constraintErrors: structuredClone(state.constraintErrors),
      }
    }

    case 'clear': {
      const { parameters } = action.payload
      return {
        constraints: [createConstraintFromParameters(parameters)],
        constraintTexts: [],
        constraintDirectEditMode: false,
        constraintErrors: [],
      }
    }
  }
}

export function getInitialConstraints(
  parameters: Parameter[],
): ConstraintsState {
  return {
    constraints: [createConstraintFromParameters(parameters)],
    constraintTexts: [],
    constraintDirectEditMode: false,
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

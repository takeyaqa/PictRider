import type { Draft } from 'immer'
import { fixConstraint, printConstraints, uuidv4 } from '../../shared/helpers'
import type {
  Condition,
  Constraint,
  Constraints,
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
  draft: Draft<Constraints>,
  action: ConstraintsAction,
): void {
  switch (action.type) {
    case 'toggleCondition': {
      const { constraintId, parameterId, parameters } = action.payload
      const newCondition = searchCondition(
        draft.constraints,
        constraintId,
        parameterId,
      )
      newCondition.ifOrThen = newCondition.ifOrThen === 'if' ? 'then' : 'if'

      draft.constraintTexts = printConstraints(
        fixConstraint(draft.constraints, parameters),
      ).map((text) => ({
        id: uuidv4(),
        text,
      }))
      break
    }

    case 'changeCondition': {
      const { constraintId, parameterId, value, parameters } = action.payload
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
        fixConstraint(draft.constraints, parameters),
      ).map((text) => ({
        id: uuidv4(),
        text,
      }))
      draft.constraintErrors = errors
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

    case 'addConstraint': {
      const { parameters } = action.payload
      if (draft.constraints.length >= 25) {
        // may not be reached
        break
      }
      draft.constraints.push(createConstraintFromParameters(parameters))
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
      const { parameters } = action.payload
      draft.constraints = [createConstraintFromParameters(parameters)]
      draft.constraintTexts = []
      draft.constraintDirectEditMode = false
      draft.constraintErrors = []
      break
    }

    case 'addCondition': {
      const { id, target, newParameterId } = action.payload
      const newConstraints: Constraint[] = []
      for (const c of draft.constraints) {
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
      draft.constraints = newConstraints
      break
    }

    case 'removeCondition': {
      const { parameterId } = action.payload
      const newConstraints = draft.constraints.map((c) => {
        return {
          ...c,
          conditions: c.conditions.filter(
            (cc) => cc.parameterId !== parameterId,
          ),
        }
      })
      draft.constraints = newConstraints
      break
    }

    case 'updateConstraintTexts': {
      const { parameters } = action.payload
      if (draft.constraintDirectEditMode) {
        break
      }
      draft.constraintTexts = printConstraints(
        fixConstraint(draft.constraints, parameters),
      ).map((text) => ({
        id: uuidv4(),
        text,
      }))
      break
    }

    case 'clear': {
      const { parameters } = action.payload
      draft.constraints = [createConstraintFromParameters(parameters)]
      draft.constraintTexts = []
      draft.constraintDirectEditMode = false
      draft.constraintErrors = []
      break
    }
  }
}

export function getInitialConstraints(parameters: Parameter[]): Constraints {
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

import { produce } from 'immer'
import { describe, expect, it } from 'vitest'
import type { Model } from '../../types'
import { getInitialModel, modelReducer, type ModelAction } from './reducer'

const TABLE_CONSTRAINT_TEXT = 'IF [Type] = "RAID-5" THEN [Size] > 1000;'

function reduceModel(state: Model, action: ModelAction): Model {
  return produce(state, (draft) => {
    modelReducer(draft, action)
  })
}

function createModelWithConstraintText(): Model {
  let model = getInitialModel()
  const constraintId = model.constraints[0].id
  const typeParameterId = model.parameters[0].id
  const sizeParameterId = model.parameters[1].id

  model = reduceModel(model, {
    type: 'toggleCondition',
    payload: { constraintId, parameterId: sizeParameterId },
  })
  model = reduceModel(model, {
    type: 'changeCondition',
    payload: {
      constraintId,
      parameterId: typeParameterId,
      value: 'RAID-5',
    },
  })
  model = reduceModel(model, {
    type: 'changeCondition',
    payload: {
      constraintId,
      parameterId: sizeParameterId,
      value: '>1000',
    },
  })

  return model
}

describe('modelReducer', () => {
  it('syncs constraintTexts when parameter name changes', () => {
    const model = createModelWithConstraintText()
    const next = reduceModel(model, {
      type: 'changeParameter',
      payload: {
        id: model.parameters[0].id,
        field: 'name',
        value: 'Drive Type',
      },
    })

    expect(next.constraintTexts[0]?.text).toBe(
      'IF [Drive Type] = "RAID-5" THEN [Size] > 1000;',
    )
  })

  it('does not regenerate constraintTexts when parameter values change', () => {
    const model = createModelWithConstraintText()
    const next = reduceModel(model, {
      type: 'changeParameter',
      payload: {
        id: model.parameters[0].id,
        field: 'values',
        value: 'Single, Span',
      },
    })

    expect(next.constraintTexts).toEqual(model.constraintTexts)
    expect(next.constraintTexts[0]?.id).toBe(model.constraintTexts[0]?.id)
  })

  it('syncs constraintTexts when adding a parameter row in table mode', () => {
    const model = createModelWithConstraintText()
    const staleModel = produce(model, (draft) => {
      draft.constraintTexts = [{ id: 'stale', text: 'STALE' }]
    })
    const next = reduceModel(staleModel, {
      type: 'addParameterRow',
      payload: {
        id: staleModel.parameters[0].id,
        target: 'below',
      },
    })

    expect(
      next.constraintTexts.map((constraintText) => constraintText.text),
    ).toEqual([TABLE_CONSTRAINT_TEXT])
    expect(next.constraintTexts[0]?.id).not.toBe('stale')
  })

  it('syncs constraintTexts when removing a parameter row in table mode', () => {
    const model = createModelWithConstraintText()
    const staleModel = produce(model, (draft) => {
      draft.constraintTexts = [{ id: 'stale', text: 'STALE' }]
    })
    const next = reduceModel(staleModel, {
      type: 'removeParameterRow',
      payload: {
        id: staleModel.parameters[5].id,
      },
    })

    expect(
      next.constraintTexts.map((constraintText) => constraintText.text),
    ).toEqual([TABLE_CONSTRAINT_TEXT])
    expect(next.constraintTexts[0]?.id).not.toBe('stale')
  })

  it('does not overwrite constraintTexts in direct edit mode', () => {
    const model = createModelWithConstraintText()
    const directEditModel = produce(model, (draft) => {
      draft.constraintDirectEditMode = true
      draft.constraintTexts = [{ id: 'manual', text: 'MANUAL_TEXT' }]
    })
    const next = reduceModel(directEditModel, {
      type: 'changeParameter',
      payload: {
        id: directEditModel.parameters[0].id,
        field: 'name',
        value: 'Drive Type',
      },
    })

    expect(next.constraintTexts).toEqual([
      { id: 'manual', text: 'MANUAL_TEXT' },
    ])
  })
})

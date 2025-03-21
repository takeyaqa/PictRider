import { PictConstraint } from './types'
import { convertConstraint } from './pict/pict-helper'

export function convertConstraintWrapper(constraints: PictConstraint): string {
  const conditions = constraints.conditions.map((c) => {
    return {
      ifOrThen: c.ifOrThen,
      predicate: c.predicate,
      parameter: c.parameterRef.name,
    }
  })
  return convertConstraint({ conditions })
}

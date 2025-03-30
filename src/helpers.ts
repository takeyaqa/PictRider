import { PictConstraint, PictParameter } from './types'
import { printConstraint } from './pict/pict-helper'

export function convertConstraintWrapper(
  constraints: PictConstraint,
  parameters: PictParameter[],
): string {
  const conditions = constraints.conditions.map((c) => {
    return {
      ifOrThen: c.ifOrThen,
      predicate: c.predicate,
      parameter: c.parameterRef.name,
    }
  })
  return printConstraint(
    { conditions },
    parameters.map((p) => p.name),
  )
}

export function uuidv4(): string {
  return crypto.randomUUID()
}

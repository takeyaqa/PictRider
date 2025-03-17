import { PictConstraint } from './pict-types.ts'

export function convertConstraint(constraint: PictConstraint): string {
  const ifConditions = constraint.conditions.filter((c) => c.ifOrThen === 'if')
  const thenConditions = constraint.conditions.filter(
    (c) => c.ifOrThen === 'then',
  )
  if (thenConditions.length === 0) {
    return ''
  }
  let ifConditionsText = ''
  for (const cond of ifConditions) {
    if (cond.predicate) {
      if (ifConditionsText) {
        ifConditionsText += ' AND '
      }
      ifConditionsText += `[${cond.parameter}] = "${cond.predicate}"`
    }
  }
  let thenConditionsText = ''
  for (const cond of thenConditions) {
    if (cond.predicate) {
      if (thenConditionsText) {
        thenConditionsText += ' AND '
      }
      thenConditionsText += `[${cond.parameter}] ${cond.predicate}`
    }
  }
  if (thenConditionsText) {
    return ifConditionsText
      ? `IF ${ifConditionsText} THEN ${thenConditionsText};`
      : `${thenConditionsText};`
  } else {
    return ''
  }
}

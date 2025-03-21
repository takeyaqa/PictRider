import { Condition, Constraint } from './pict-types'

export function printConstraint(
  constraint: Constraint,
  parameters: string[],
): string {
  const ifConditions = constraint.conditions.filter((c) => c.ifOrThen === 'if')
  const thenConditions = constraint.conditions.filter(
    (c) => c.ifOrThen === 'then',
  )
  if (thenConditions.length === 0) {
    return ''
  }
  const ifPredicateText = printPredicate(ifConditions, parameters)
  const thenPredicateText = printPredicate(thenConditions, parameters)
  if (thenPredicateText) {
    return ifPredicateText
      ? `IF ${ifPredicateText} THEN ${thenPredicateText};`
      : `${thenPredicateText};`
  } else {
    return ''
  }
}

function printPredicate(conditions: Condition[], parameters: string[]): string {
  let predicateText = ''
  for (const cond of conditions) {
    if (cond.predicate) {
      if (predicateText) {
        predicateText += ' AND '
      }
      predicateText += printClause(cond.predicate, cond.parameter, parameters)
    }
  }
  return predicateText
}

function printClause(
  inputPredicate: string,
  inputParameter: string,
  parameters: string[],
): string {
  const isAllNegated =
    inputPredicate.includes(',') && inputPredicate.startsWith('#')
  if (inputPredicate.includes(',')) {
    const predicates = inputPredicate.split(',').map((p) => p.trim())
    let predicateText = ''
    for (const predicate of predicates) {
      const [relation, identifier] = printRightIdentifier(predicate, parameters)
      if (predicateText) {
        if (isAllNegated) {
          predicateText += ' AND '
        } else if (relation !== '&=' && relation !== '&!') {
          predicateText += ' OR '
        } else {
          predicateText += ' AND '
        }
      }
      const fixedRelation = relation.replace('&', '')
      predicateText += printTerm(
        isAllNegated ? '<>' : fixedRelation,
        identifier,
        inputParameter,
        parameters,
      )
    }
    return `(${predicateText})`
  } else {
    const [relation, identifier] = printRightIdentifier(
      inputPredicate,
      parameters,
    )
    return `(${printTerm(relation, identifier, inputParameter, parameters)})`
  }
}

function printTerm(
  relation: string,
  inputPredicate: string,
  inputParameter: string,
  parameters: string[],
): string {
  return `[${inputParameter}] ${relation} ${printValueOrParameterName(inputPredicate, parameters)}`
}

function printRightIdentifier(
  predicate: string,
  parameters: string[],
): [string, string] {
  let isParameterName = false
  for (const parameter of parameters) {
    if (isPatternString(predicate)) {
      isParameterName = false
      break
    } else if (predicate.includes(parameter)) {
      isParameterName = true
      break
    }
  }
  if (isParameterName) {
    return splitParameterNameAndValue(predicate)
  } else {
    return splitValueAndRelation(predicate)
  }
}

function splitValueAndRelation(predicate: string): [string, string] {
  if (predicate.startsWith('#') && isPatternString(predicate)) {
    return ['NOT LIKE', predicate.replace('#', '').trim()]
  } else if (isPatternString(predicate)) {
    return ['LIKE', predicate.trim()]
  } else if (predicate.startsWith('#')) {
    return ['<>', predicate.replace('#', '').trim()]
  } else if (predicate.startsWith('>')) {
    return ['>', predicate.replace('>', '').trim()]
  } else if (predicate.startsWith('<')) {
    return ['<', predicate.replace('<', '').trim()]
  } else if (predicate.startsWith('>=')) {
    return ['>=', predicate.replace('>=', '').trim()]
  } else if (predicate.startsWith('<=')) {
    return ['<=', predicate.replace('<=', '').trim()]
  } else {
    return ['=', predicate.trim()]
  }
}

function splitParameterNameAndValue(predicate: string): [string, string] {
  if (predicate.startsWith('=')) {
    return ['=', predicate.replace('=', '').trim()]
  } else if (predicate.startsWith('!')) {
    return ['<>', predicate.replace('!', '').trim()]
  } else if (predicate.startsWith('&=')) {
    return ['&=', predicate.replace('&=', '').trim()]
  } else if (predicate.startsWith('&!')) {
    return ['&!', predicate.replace('&!', '').trim()]
  } else {
    return ['', predicate.trim()]
  }
}

function printValueOrParameterName(
  value: string,
  parameters: string[],
): string {
  if (parameters.includes(value)) {
    return `[${value}]`
  } else {
    return printValue(value)
  }
}

function printValue(value: string): string {
  if (Number.isNaN(Number(value))) {
    return `"${value}"`
  } else {
    return value
  }
}

function isPatternString(value: string): boolean {
  return value.includes('*') || value.includes('?')
}

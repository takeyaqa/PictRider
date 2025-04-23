import { FixedCondition, FixedConstraint } from './types'
import {
  Constraints as ConstraintsAst,
  Predicate,
  Relation,
  ParameterName,
  Value,
  RelationTerm,
  LikeTerm,
  InTerm,
  Term,
  LogicalOperator,
  Clause,
  NotClause,
} from './pict-constraints-parser/types'

type UnfixedTerm =
  | RelationTerm
  | LikeTerm
  | InTerm
  | UnfixedRelationTerm
  | NotClause

type UnfixedRelation = Relation | '&=' | '&!'

interface UnfixedRelationTerm {
  type: 'UnfixedRelationTerm'
  parameterName: ParameterName
  relation: UnfixedRelation
  right: Value | ParameterName
}

export function convertTableToConstraints(
  constraints: FixedConstraint[],
  parameters: string[],
): ConstraintsAst {
  const constraintsAst: ConstraintsAst = []
  const parametersSet = new Set(parameters.filter((p) => p !== ''))
  for (const constraint of constraints) {
    const ifConditions = constraint.conditions.filter(
      (c) => c.ifOrThen === 'if' && c.predicate !== '',
    )
    const thenConditions = constraint.conditions.filter(
      (c) => c.ifOrThen === 'then' && c.predicate !== '',
    )
    if (thenConditions.length === 0) {
      continue
    }
    if (isError(ifConditions) || isError(thenConditions)) {
      continue
    }
    if (ifConditions.length > 0) {
      const ifPredicates = ifConditions.map((condition) => {
        return convertPredicate(condition, parametersSet)
      })
      const thenPredicates = thenConditions.map((condition) => {
        return convertPredicate(condition, parametersSet)
      })
      constraintsAst.push({
        type: 'IfConstraint',
        condition: convertIfOrThenConstraint(ifPredicates),
        then: convertIfOrThenConstraint(thenPredicates),
      })
    } else {
      const thenPredicates = thenConditions.map((condition) => {
        return convertPredicate(condition, parametersSet)
      })
      constraintsAst.push({
        type: 'PredicateConstraint',
        predicate: convertIfOrThenConstraint(thenPredicates),
      })
    }
  }
  return constraintsAst
}

function convertIfOrThenConstraint(predicates: Predicate[]): Predicate {
  let predicate: Predicate
  if (predicates.length === 1) {
    predicate = predicates[0]
  } else {
    let left: Clause
    if (predicates[0].type !== 'LogicalPredicate') {
      left = predicates[0]
    } else {
      left = {
        type: 'PredicateClause',
        predicate: predicates[0],
      }
    }
    predicate = {
      type: 'LogicalPredicate',
      left: left,
      operator: 'AND',
      right: predicates[1],
    }
    for (let i = 2; i < predicates.length; i++) {
      predicate = {
        type: 'LogicalPredicate',
        left: {
          type: 'PredicateClause',
          predicate: predicate,
        },
        operator: 'AND',
        right: predicates[i],
      }
    }
  }
  return predicate
}

function convertPredicate(
  condition: FixedCondition,
  parameters: Set<string>,
): Predicate {
  const tokens = condition.predicate.split(',').map((token) => token.trim())
  const isAllNegated = tokens[0].startsWith('#')
  const terms = tokens.map((token) => {
    return convertTerm(token, condition.parameterName, parameters)
  })
  let predicate: Predicate
  if (terms.length === 1) {
    predicate = fixFirstTerm(terms[0], isAllNegated)
  } else {
    const firstTerm = fixFirstTerm(terms[0], isAllNegated)
    let secondTerm: Clause
    let operator: LogicalOperator = 'OR'
    if (terms[1].type === 'UnfixedRelationTerm') {
      ;[operator, secondTerm] = fixRestTerm(terms[1], isAllNegated)
    } else {
      secondTerm = terms[1]
    }
    predicate = {
      type: 'LogicalPredicate',
      left: firstTerm,
      operator: operator,
      right: secondTerm,
    }
    for (let i = 2; i < terms.length; i++) {
      let operator: LogicalOperator = 'OR'
      const targetTerm = terms[i]
      let fixedTerm: Clause
      if (targetTerm.type === 'UnfixedRelationTerm') {
        ;[operator, fixedTerm] = fixRestTerm(targetTerm, isAllNegated)
      } else {
        fixedTerm = targetTerm
      }
      predicate = {
        type: 'LogicalPredicate',
        left: {
          type: 'PredicateClause',
          predicate: predicate,
        },
        operator: operator,
        right: fixedTerm,
      }
    }
  }
  return predicate
}

function fixFirstTerm(unfixedTerm: UnfixedTerm, isAllNegated: boolean): Clause {
  if (unfixedTerm.type === 'UnfixedRelationTerm') {
    if (unfixedTerm.relation === '&=' || unfixedTerm.relation === '&!') {
      throw new Error('Invalid predicate format')
    }
    return {
      type: 'RelationTerm',
      parameterName: unfixedTerm.parameterName,
      relation: isAllNegated ? '<>' : unfixedTerm.relation,
      right: unfixedTerm.right,
    }
  } else {
    return unfixedTerm
  }
}

function fixRestTerm(
  unfixedTerm: UnfixedRelationTerm,
  isAllNegated: boolean,
): [LogicalOperator, Term] {
  let operator: LogicalOperator
  let relation: Relation
  if (unfixedTerm.relation === '&=' || unfixedTerm.relation === '&!') {
    operator = 'AND'
    relation = unfixedTerm.relation === '&=' ? '=' : '<>'
  } else {
    if (
      isAllNegated ||
      unfixedTerm.relation === '>' ||
      unfixedTerm.relation === '<' ||
      unfixedTerm.relation === '>=' ||
      unfixedTerm.relation === '<='
    ) {
      operator = 'AND'
    } else {
      operator = 'OR'
    }
    relation = isAllNegated ? '<>' : unfixedTerm.relation
  }
  return [
    operator,
    {
      type: 'RelationTerm',
      parameterName: unfixedTerm.parameterName,
      relation: relation,
      right: unfixedTerm.right,
    },
  ]
}

function isError(conditions: FixedCondition[]): boolean {
  for (const cond of conditions) {
    // '#' is only allowed at the beginning of the predicate
    if (cond.predicate.includes('#') && !cond.predicate.startsWith('#')) {
      return true
    }
  }
  return false
}

function convertTerm(
  predicate: string,
  parameter: string,
  parameters: Set<string>,
): UnfixedTerm {
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
    const [relation, name] = splitParameterNameAndValue(predicate)
    return {
      type: 'UnfixedRelationTerm',
      parameterName: {
        type: 'ParameterName',
        name: parameter,
      },
      relation: relation,
      right: {
        type: 'ParameterName',
        name: name,
      },
    }
  } else {
    const [relation, value] = splitValueAndRelation(predicate)
    if (relation === 'LIKE') {
      return {
        type: 'LikeTerm',
        parameter: parameter,
        patternString: value,
      }
    } else if (relation === 'NOT LIKE') {
      return {
        type: 'NotClause',
        predicate: {
          type: 'LikeTerm',
          parameter: parameter,
          patternString: value,
        },
      }
    } else {
      return {
        type: 'UnfixedRelationTerm',
        parameterName: {
          type: 'ParameterName',
          name: parameter,
        },
        relation: relation,
        right: Number.isNaN(Number(value))
          ? {
              type: 'String',
              value: value,
            }
          : {
              type: 'Number',
              value: Number(value),
            },
      }
    }
  }
}

function splitValueAndRelation(
  predicate: string,
): [Relation | 'NOT LIKE' | 'LIKE', string] {
  if (predicate.startsWith('#') && isPatternString(predicate)) {
    return ['NOT LIKE', predicate.replace('#', '').trim()]
  } else if (isPatternString(predicate)) {
    return ['LIKE', predicate.trim()]
  } else if (predicate.startsWith('#')) {
    return ['<>', predicate.replace('#', '').trim()]
  } else if (predicate.startsWith('>=')) {
    return ['>=', predicate.replace('>=', '').trim()]
  } else if (predicate.startsWith('<=')) {
    return ['<=', predicate.replace('<=', '').trim()]
  } else if (predicate.startsWith('>')) {
    return ['>', predicate.replace('>', '').trim()]
  } else if (predicate.startsWith('<')) {
    return ['<', predicate.replace('<', '').trim()]
  } else {
    return ['=', predicate.trim()]
  }
}

function splitParameterNameAndValue(
  predicate: string,
): [UnfixedRelation, string] {
  if (predicate.startsWith('=')) {
    return ['=', predicate.replace('=', '').trim()]
  } else if (predicate.startsWith('!')) {
    return ['<>', predicate.replace('!', '').trim()]
  } else if (predicate.startsWith('&=')) {
    return ['&=', predicate.replace('&=', '').trim()]
  } else if (predicate.startsWith('&!')) {
    return ['&!', predicate.replace('&!', '').trim()]
  } else {
    throw new Error('Invalid predicate format')
  }
}

function isPatternString(value: string): boolean {
  return value.includes('*') || value.includes('?')
}

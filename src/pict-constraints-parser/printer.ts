import { Constraint, Predicate, Clause, Term, Value } from './types'

export function printCodeFromAST(ast: Constraint[]): string {
  return ast.map(printConstraint).join('\n')
}

function printConstraint(constraint: Constraint): string {
  if (constraint.type === 'IfConstraint') {
    return `IF ${printPredicate(constraint.condition)} THEN ${printPredicate(constraint.then)};`
  } else {
    return `${printPredicate(constraint.predicate)};`
  }
}

function printPredicate(predicate: Predicate): string {
  if (predicate.type === 'LogicalPredicate') {
    if (predicate.right.type === 'LogicalPredicate') {
      return `${printClause(predicate.left)} ${predicate.operator} (${printPredicate(predicate.right)})`
    } else {
      return `${printClause(predicate.left)} ${predicate.operator} ${printPredicate(predicate.right)}`
    }
  }
  return printClause(predicate)
}

function printClause(clause: Clause): string {
  if (clause.type === 'PredicateClause') {
    return `(${printPredicate(clause.predicate)})`
  } else if (clause.type === 'NotClause') {
    return `NOT ${printPredicate(clause.predicate)}`
  } else {
    return printTerm(clause)
  }
}

function printTerm(term: Term): string {
  switch (term.type) {
    case 'RelationTerm': {
      let rightValue: string
      if (term.right.type === 'String' || term.right.type === 'Number') {
        rightValue = generateValue(term.right)
      } else {
        rightValue = `[${term.right.name}]`
      }
      return `[${term.parameterName.name}] ${term.relation} ${rightValue}`
    }
    case 'LikeTerm':
      return `[${term.parameter}] LIKE "${term.patternString}"`
    case 'InTerm':
      return `[${term.parameter}] IN { ${generateValueSet(term.values)} }`
    default:
      throw new Error('Invalid term type')
  }
}

function generateValueSet(values: Value[]): string {
  return values.map(generateValue).join(', ')
}

function generateValue(value: Value): string {
  if (value.type === 'String') {
    return `"${value.value}"`
  } else {
    return value.value.toString()
  }
}

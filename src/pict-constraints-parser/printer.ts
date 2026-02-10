import type {
  Constraints,
  Constraint,
  Predicate,
  Clause,
  Term,
  Value,
} from './types'

export function printCodeFromAST(ast: Constraints): string[] {
  return ast.map(printConstraint)
}

function printConstraint(constraint: Constraint): string {
  if (constraint.type === 'IfConstraint') {
    let result = `IF ${printPredicate(constraint.condition)} THEN ${printPredicate(constraint.then)}`
    if (constraint.else) {
      result += ` ELSE ${printPredicate(constraint.else)}`
    }
    return `${result};`
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
    case 'LikeTerm': {
      const likeOp = term.negated ? 'NOT LIKE' : 'LIKE'
      return `[${term.parameter}] ${likeOp} "${term.patternString}"`
    }
    case 'InTerm': {
      const inOp = term.negated ? 'NOT IN' : 'IN'
      return `[${term.parameter}] ${inOp} { ${generateValueSet(term.values)} }`
    }
    case 'FunctionTerm': {
      if (term.parameterName != null) {
        return `${term.function}([${term.parameterName}])`
      }
      return `${term.function}()`
    }
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

export type Constraints = Constraint[]

// Constraint
export type Constraint = IfConstraint | PredicateConstraint

export interface IfConstraint {
  type: 'IfConstraint'
  condition: Predicate
  then: Predicate
  else?: Predicate
}

export interface PredicateConstraint {
  type: 'PredicateConstraint'
  predicate: Predicate
}

// Predicate
export type Predicate = Clause | LogicalPredicate

export interface LogicalPredicate {
  type: 'LogicalPredicate'
  left: Clause
  operator: LogicalOperator
  right: Predicate
}

// Clause
export type Clause = Term | PredicateClause | NotClause

export interface PredicateClause {
  type: 'PredicateClause'
  predicate: Predicate
}

export interface NotClause {
  type: 'NotClause'
  predicate: Predicate
}

// Term
export type Term = RelationTerm | LikeTerm | InTerm

export interface RelationTerm {
  type: 'RelationTerm'
  parameterName: ParameterName
  relation: Relation
  right: Value | ParameterName
}

export interface LikeTerm {
  type: 'LikeTerm'
  parameter: string
  patternString: string
}

export interface InTerm {
  type: 'InTerm'
  parameter: string
  values: ValueSet
}

// ValueSet
export type ValueSet = Value[]

// LogicalOperator
export type LogicalOperator = 'AND' | 'OR'

// Relation
export type Relation = '=' | '<>' | '>' | '>=' | '<' | '<='

// ParameterName
export interface ParameterName {
  type: 'ParameterName'
  name: string
}

// Value
export type Value = StringValue | NumberValue

// String
export interface StringValue {
  type: 'String'
  value: string
}

// Number
export interface NumberValue {
  type: 'Number'
  value: number
}

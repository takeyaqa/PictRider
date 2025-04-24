import { it, describe, expect } from 'vitest'
import { printCodeFromAST } from '../../src/pict-constraints-parser/printer'
import {
  IfConstraint,
  PredicateConstraint,
  Relation,
} from '../../src/pict-constraints-parser/types'

describe('printCodeFromAST', () => {
  it('should return an empty string for an empty array', () => {
    const result = printCodeFromAST([])[0]
    expect(result).toBeUndefined()
  })

  describe('Simple Predicate Constraints', () => {
    it('should print a simple relation term constraint', () => {
      const constraint: PredicateConstraint = {
        type: 'PredicateConstraint',
        predicate: {
          type: 'RelationTerm',
          parameterName: { type: 'ParameterName', name: 'Parameter1' },
          relation: '=',
          right: { type: 'String', value: 'Value1' },
        },
      }

      const result = printCodeFromAST([constraint])[0]
      expect(result).toBe('[Parameter1] = "Value1";')
    })

    it('should print a relation term with a number value', () => {
      const constraint: PredicateConstraint = {
        type: 'PredicateConstraint',
        predicate: {
          type: 'RelationTerm',
          parameterName: { type: 'ParameterName', name: 'Parameter1' },
          relation: '=',
          right: { type: 'Number', value: 42 },
        },
      }

      const result = printCodeFromAST([constraint])[0]
      expect(result).toBe('[Parameter1] = 42;')
    })

    it('should print a relation term with a parameter name as right value', () => {
      const constraint: PredicateConstraint = {
        type: 'PredicateConstraint',
        predicate: {
          type: 'RelationTerm',
          parameterName: { type: 'ParameterName', name: 'Parameter1' },
          relation: '=',
          right: { type: 'ParameterName', name: 'Parameter2' },
        },
      }

      const result = printCodeFromAST([constraint])[0]
      expect(result).toBe('[Parameter1] = [Parameter2];')
    })

    it('should print a relation term with different relations', () => {
      const relations: { relation: string; expected: string }[] = [
        { relation: '<>', expected: '[Parameter1] <> "Value1";' },
        { relation: '>', expected: '[Parameter1] > "Value1";' },
        { relation: '>=', expected: '[Parameter1] >= "Value1";' },
        { relation: '<', expected: '[Parameter1] < "Value1";' },
        { relation: '<=', expected: '[Parameter1] <= "Value1";' },
      ]

      relations.forEach(({ relation, expected }) => {
        const constraint: PredicateConstraint = {
          type: 'PredicateConstraint',
          predicate: {
            type: 'RelationTerm',
            parameterName: { type: 'ParameterName', name: 'Parameter1' },
            relation: relation as Relation,
            right: { type: 'String', value: 'Value1' },
          },
        }

        const result = printCodeFromAST([constraint])[0]
        expect(result).toBe(expected)
      })
    })

    it('should print a LIKE term', () => {
      const constraint: PredicateConstraint = {
        type: 'PredicateConstraint',
        predicate: {
          type: 'LikeTerm',
          parameter: 'Parameter1',
          patternString: 'pattern*',
        },
      }

      const result = printCodeFromAST([constraint])[0]
      expect(result).toBe('[Parameter1] LIKE "pattern*";')
    })

    it('should print a NOT LIKE term', () => {
      const constraint: PredicateConstraint = {
        type: 'PredicateConstraint',
        predicate: {
          type: 'NotClause',
          predicate: {
            type: 'LikeTerm',
            parameter: 'Parameter1',
            patternString: 'pattern*',
          },
        },
      }

      const result = printCodeFromAST([constraint])[0]
      expect(result).toBe('NOT [Parameter1] LIKE "pattern*";')
    })

    it('should print an IN term', () => {
      const constraint: PredicateConstraint = {
        type: 'PredicateConstraint',
        predicate: {
          type: 'InTerm',
          parameter: 'Parameter1',
          values: [
            { type: 'String', value: 'Value1' },
            { type: 'String', value: 'Value2' },
            { type: 'Number', value: 42 },
          ],
        },
      }

      const result = printCodeFromAST([constraint])[0]
      expect(result).toBe('[Parameter1] IN { "Value1", "Value2", 42 };')
    })
  })

  describe('If Constraints', () => {
    it('should print a simple if constraint', () => {
      const constraint: IfConstraint = {
        type: 'IfConstraint',
        condition: {
          type: 'RelationTerm',
          parameterName: { type: 'ParameterName', name: 'Parameter1' },
          relation: '=',
          right: { type: 'String', value: 'Value1' },
        },
        then: {
          type: 'RelationTerm',
          parameterName: { type: 'ParameterName', name: 'Parameter2' },
          relation: '=',
          right: { type: 'String', value: 'Value2' },
        },
      }

      const result = printCodeFromAST([constraint])[0]
      expect(result).toBe(
        'IF [Parameter1] = "Value1" THEN [Parameter2] = "Value2";',
      )
    })
  })

  describe('Logical Predicates', () => {
    it('should print a logical AND predicate', () => {
      const constraint: PredicateConstraint = {
        type: 'PredicateConstraint',
        predicate: {
          type: 'LogicalPredicate',
          left: {
            type: 'RelationTerm',
            parameterName: { type: 'ParameterName', name: 'Parameter1' },
            relation: '=',
            right: { type: 'String', value: 'Value1' },
          },
          operator: 'AND',
          right: {
            type: 'RelationTerm',
            parameterName: { type: 'ParameterName', name: 'Parameter2' },
            relation: '=',
            right: { type: 'String', value: 'Value2' },
          },
        },
      }

      const result = printCodeFromAST([constraint])[0]
      expect(result).toBe(
        '[Parameter1] = "Value1" AND [Parameter2] = "Value2";',
      )
    })

    it('should print a logical OR predicate', () => {
      const constraint: PredicateConstraint = {
        type: 'PredicateConstraint',
        predicate: {
          type: 'LogicalPredicate',
          left: {
            type: 'RelationTerm',
            parameterName: { type: 'ParameterName', name: 'Parameter1' },
            relation: '=',
            right: { type: 'String', value: 'Value1' },
          },
          operator: 'OR',
          right: {
            type: 'RelationTerm',
            parameterName: { type: 'ParameterName', name: 'Parameter2' },
            relation: '=',
            right: { type: 'String', value: 'Value2' },
          },
        },
      }

      const result = printCodeFromAST([constraint])[0]
      expect(result).toBe('[Parameter1] = "Value1" OR [Parameter2] = "Value2";')
    })

    it('should handle nested logical predicates with parentheses', () => {
      const constraint: PredicateConstraint = {
        type: 'PredicateConstraint',
        predicate: {
          type: 'LogicalPredicate',
          left: {
            type: 'RelationTerm',
            parameterName: { type: 'ParameterName', name: 'Parameter1' },
            relation: '=',
            right: { type: 'String', value: 'Value1' },
          },
          operator: 'AND',
          right: {
            type: 'LogicalPredicate',
            left: {
              type: 'RelationTerm',
              parameterName: { type: 'ParameterName', name: 'Parameter2' },
              relation: '=',
              right: { type: 'String', value: 'Value2' },
            },
            operator: 'OR',
            right: {
              type: 'RelationTerm',
              parameterName: { type: 'ParameterName', name: 'Parameter3' },
              relation: '=',
              right: { type: 'String', value: 'Value3' },
            },
          },
        },
      }

      const result = printCodeFromAST([constraint])[0]
      expect(result).toBe(
        '[Parameter1] = "Value1" AND ([Parameter2] = "Value2" OR [Parameter3] = "Value3");',
      )
    })
  })

  describe('Clause Types', () => {
    it('should print a predicate clause with parentheses', () => {
      const constraint: PredicateConstraint = {
        type: 'PredicateConstraint',
        predicate: {
          type: 'PredicateClause',
          predicate: {
            type: 'RelationTerm',
            parameterName: { type: 'ParameterName', name: 'Parameter1' },
            relation: '=',
            right: { type: 'String', value: 'Value1' },
          },
        },
      }

      const result = printCodeFromAST([constraint])[0]
      expect(result).toBe('([Parameter1] = "Value1");')
    })

    it('should print a NOT clause', () => {
      const constraint: PredicateConstraint = {
        type: 'PredicateConstraint',
        predicate: {
          type: 'NotClause',
          predicate: {
            type: 'RelationTerm',
            parameterName: { type: 'ParameterName', name: 'Parameter1' },
            relation: '=',
            right: { type: 'String', value: 'Value1' },
          },
        },
      }

      const result = printCodeFromAST([constraint])[0]
      expect(result).toBe('NOT [Parameter1] = "Value1";')
    })
  })

  describe('Complex Combinations', () => {
    it('should print multiple constraints', () => {
      const constraint1: PredicateConstraint = {
        type: 'PredicateConstraint',
        predicate: {
          type: 'RelationTerm',
          parameterName: { type: 'ParameterName', name: 'Parameter1' },
          relation: '=',
          right: { type: 'String', value: 'Value1' },
        },
      }

      const constraint2: IfConstraint = {
        type: 'IfConstraint',
        condition: {
          type: 'RelationTerm',
          parameterName: { type: 'ParameterName', name: 'Parameter2' },
          relation: '=',
          right: { type: 'String', value: 'Value2' },
        },
        then: {
          type: 'RelationTerm',
          parameterName: { type: 'ParameterName', name: 'Parameter3' },
          relation: '=',
          right: { type: 'String', value: 'Value3' },
        },
      }

      const result = printCodeFromAST([constraint1, constraint2]).join('\n')
      expect(result).toBe(
        '[Parameter1] = "Value1";\nIF [Parameter2] = "Value2" THEN [Parameter3] = "Value3";',
      )
    })

    it('should print a complex constraint with nested predicates and clauses', () => {
      const constraint: IfConstraint = {
        type: 'IfConstraint',
        condition: {
          type: 'LogicalPredicate',
          left: {
            type: 'RelationTerm',
            parameterName: { type: 'ParameterName', name: 'Parameter1' },
            relation: '=',
            right: { type: 'String', value: 'Value1' },
          },
          operator: 'AND',
          right: {
            type: 'NotClause',
            predicate: {
              type: 'RelationTerm',
              parameterName: { type: 'ParameterName', name: 'Parameter2' },
              relation: '=',
              right: { type: 'String', value: 'Value2' },
            },
          },
        },
        then: {
          type: 'LogicalPredicate',
          left: {
            type: 'InTerm',
            parameter: 'Parameter3',
            values: [
              { type: 'String', value: 'Value3' },
              { type: 'String', value: 'Value4' },
            ],
          },
          operator: 'OR',
          right: {
            type: 'LikeTerm',
            parameter: 'Parameter4',
            patternString: 'pattern*',
          },
        },
      }

      const result = printCodeFromAST([constraint])[0]
      expect(result).toBe(
        'IF [Parameter1] = "Value1" AND NOT [Parameter2] = "Value2" THEN [Parameter3] IN { "Value3", "Value4" } OR [Parameter4] LIKE "pattern*";',
      )
    })
  })
})

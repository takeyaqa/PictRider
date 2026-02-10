import { it, describe, expect } from 'vitest'
import { parseConstraints } from './parser'
import { printCodeFromAST } from './printer'
import type { Constraints, ParseResult } from './types'

function expectOk(input: string): Constraints {
  const result = parseConstraints(input)
  expect(result.ok).toBe(true)
  return (result as Extract<ParseResult<Constraints>, { ok: true }>).value
}

describe('parseConstraints', () => {
  describe('Simple terms', () => {
    it('should parse parameter = string', () => {
      const constraints = expectOk('[P] = "value";')
      expect(constraints).toHaveLength(1)
      expect(constraints[0]).toEqual({
        type: 'PredicateConstraint',
        predicate: {
          type: 'RelationTerm',
          parameterName: { type: 'ParameterName', name: 'P' },
          relation: '=',
          right: { type: 'String', value: 'value' },
        },
      })
    })

    it('should parse parameter = number', () => {
      const constraints = expectOk('[P] = 42;')
      expect(constraints[0]).toEqual({
        type: 'PredicateConstraint',
        predicate: {
          type: 'RelationTerm',
          parameterName: { type: 'ParameterName', name: 'P' },
          relation: '=',
          right: { type: 'Number', value: 42 },
        },
      })
    })

    it('should parse parameter <> string', () => {
      const constraints = expectOk('[P] <> "value";')
      expect(constraints[0]).toMatchObject({
        type: 'PredicateConstraint',
        predicate: { type: 'RelationTerm', relation: '<>' },
      })
    })

    it('should parse all relation operators', () => {
      const relations: [string, string][] = [
        ['=', '='],
        ['<>', '<>'],
        ['<', '<'],
        ['<=', '<='],
        ['>', '>'],
        ['>=', '>='],
      ]
      for (const [input, expected] of relations) {
        const constraints = expectOk(`[P] ${input} "v";`)
        expect(constraints[0]).toMatchObject({
          type: 'PredicateConstraint',
          predicate: { type: 'RelationTerm', relation: expected },
        })
      }
    })

    it('should parse parameter = negative number', () => {
      const constraints = expectOk('[P] = -5;')
      expect(constraints[0]).toMatchObject({
        type: 'PredicateConstraint',
        predicate: {
          type: 'RelationTerm',
          right: { type: 'Number', value: -5 },
        },
      })
    })

    it('should parse parameter = decimal number', () => {
      const constraints = expectOk('[P] = 3.14;')
      expect(constraints[0]).toMatchObject({
        type: 'PredicateConstraint',
        predicate: {
          type: 'RelationTerm',
          right: { type: 'Number', value: 3.14 },
        },
      })
    })
  })

  describe('Parameter comparison', () => {
    it('should parse parameter = parameter', () => {
      const constraints = expectOk('[P1] = [P2];')
      expect(constraints[0]).toEqual({
        type: 'PredicateConstraint',
        predicate: {
          type: 'RelationTerm',
          parameterName: { type: 'ParameterName', name: 'P1' },
          relation: '=',
          right: { type: 'ParameterName', name: 'P2' },
        },
      })
    })
  })

  describe('LIKE / NOT LIKE', () => {
    it('should parse LIKE', () => {
      const constraints = expectOk('[P] LIKE "pattern*";')
      expect(constraints[0]).toEqual({
        type: 'PredicateConstraint',
        predicate: {
          type: 'LikeTerm',
          negated: false,
          parameter: 'P',
          patternString: 'pattern*',
        },
      })
    })

    it('should parse NOT LIKE', () => {
      const constraints = expectOk('[P] NOT LIKE "?x";')
      expect(constraints[0]).toEqual({
        type: 'PredicateConstraint',
        predicate: {
          type: 'LikeTerm',
          negated: true,
          parameter: 'P',
          patternString: '?x',
        },
      })
    })
  })

  describe('IN / NOT IN', () => {
    it('should parse IN with string values', () => {
      const constraints = expectOk('[P] IN { "a", "b" };')
      expect(constraints[0]).toEqual({
        type: 'PredicateConstraint',
        predicate: {
          type: 'InTerm',
          negated: false,
          parameter: 'P',
          values: [
            { type: 'String', value: 'a' },
            { type: 'String', value: 'b' },
          ],
        },
      })
    })

    it('should parse NOT IN with number values', () => {
      const constraints = expectOk('[P] NOT IN { 1, 2, 3 };')
      expect(constraints[0]).toEqual({
        type: 'PredicateConstraint',
        predicate: {
          type: 'InTerm',
          negated: true,
          parameter: 'P',
          values: [
            { type: 'Number', value: 1 },
            { type: 'Number', value: 2 },
            { type: 'Number', value: 3 },
          ],
        },
      })
    })

    it('should parse IN with single value', () => {
      const constraints = expectOk('[P] IN { "only" };')
      expect(constraints[0]).toMatchObject({
        type: 'PredicateConstraint',
        predicate: {
          type: 'InTerm',
          values: [{ type: 'String', value: 'only' }],
        },
      })
    })
  })

  describe('Functions', () => {
    it('should parse IsNegative with parameter', () => {
      const constraints = expectOk('IsNegative([P]);')
      expect(constraints[0]).toEqual({
        type: 'PredicateConstraint',
        predicate: {
          type: 'FunctionTerm',
          function: 'IsNegative',
          parameterName: 'P',
        },
      })
    })

    it('should parse IsPositive with parameter', () => {
      const constraints = expectOk('IsPositive([Param]);')
      expect(constraints[0]).toEqual({
        type: 'PredicateConstraint',
        predicate: {
          type: 'FunctionTerm',
          function: 'IsPositive',
          parameterName: 'Param',
        },
      })
    })

    it('should parse IsNegative without parameter', () => {
      const constraints = expectOk('IsNegative();')
      expect(constraints[0]).toEqual({
        type: 'PredicateConstraint',
        predicate: {
          type: 'FunctionTerm',
          function: 'IsNegative',
          parameterName: undefined,
        },
      })
    })

    it('should parse IsPositive without parameter', () => {
      const constraints = expectOk('IsPositive();')
      expect(constraints[0]).toEqual({
        type: 'PredicateConstraint',
        predicate: {
          type: 'FunctionTerm',
          function: 'IsPositive',
          parameterName: undefined,
        },
      })
    })
  })

  describe('Logical operators', () => {
    it('should parse AND', () => {
      const constraints = expectOk('[P1] = "a" AND [P2] = "b";')
      expect(constraints[0]).toEqual({
        type: 'PredicateConstraint',
        predicate: {
          type: 'LogicalPredicate',
          left: {
            type: 'RelationTerm',
            parameterName: { type: 'ParameterName', name: 'P1' },
            relation: '=',
            right: { type: 'String', value: 'a' },
          },
          operator: 'AND',
          right: {
            type: 'RelationTerm',
            parameterName: { type: 'ParameterName', name: 'P2' },
            relation: '=',
            right: { type: 'String', value: 'b' },
          },
        },
      })
    })

    it('should parse OR', () => {
      const constraints = expectOk('[P1] = "a" OR [P2] = "b";')
      expect(constraints[0]).toMatchObject({
        type: 'PredicateConstraint',
        predicate: { type: 'LogicalPredicate', operator: 'OR' },
      })
    })

    it('should parse chained logical operators', () => {
      const constraints = expectOk('[P1] = "a" AND [P2] = "b" OR [P3] = "c";')
      expect(constraints[0].type).toBe('PredicateConstraint')
      expect(constraints).toHaveLength(1)
    })
  })

  describe('NOT clause', () => {
    it('should parse NOT clause', () => {
      const constraints = expectOk('NOT [P] = "v";')
      expect(constraints[0]).toEqual({
        type: 'PredicateConstraint',
        predicate: {
          type: 'NotClause',
          predicate: {
            type: 'RelationTerm',
            parameterName: { type: 'ParameterName', name: 'P' },
            relation: '=',
            right: { type: 'String', value: 'v' },
          },
        },
      })
    })
  })

  describe('Parentheses', () => {
    it('should parse parenthesized predicate', () => {
      const constraints = expectOk('([P] = "v");')
      expect(constraints[0]).toEqual({
        type: 'PredicateConstraint',
        predicate: {
          type: 'PredicateClause',
          predicate: {
            type: 'RelationTerm',
            parameterName: { type: 'ParameterName', name: 'P' },
            relation: '=',
            right: { type: 'String', value: 'v' },
          },
        },
      })
    })

    it('should parse complex parenthesized expression', () => {
      const constraints = expectOk('([P1] = "a" OR [P2] = "b") AND [P3] = "c";')
      expect(constraints[0]).toMatchObject({
        type: 'PredicateConstraint',
        predicate: {
          type: 'LogicalPredicate',
          left: { type: 'PredicateClause' },
          operator: 'AND',
        },
      })
    })
  })

  describe('IF/THEN', () => {
    it('should parse IF/THEN', () => {
      const constraints = expectOk('IF [P1] = "a" THEN [P2] = "b";')
      expect(constraints[0]).toEqual({
        type: 'IfConstraint',
        condition: {
          type: 'RelationTerm',
          parameterName: { type: 'ParameterName', name: 'P1' },
          relation: '=',
          right: { type: 'String', value: 'a' },
        },
        then: {
          type: 'RelationTerm',
          parameterName: { type: 'ParameterName', name: 'P2' },
          relation: '=',
          right: { type: 'String', value: 'b' },
        },
      })
    })
  })

  describe('IF/THEN/ELSE', () => {
    it('should parse IF/THEN/ELSE', () => {
      const constraints = expectOk(
        'IF [P1] = "a" THEN [P2] = "b" ELSE [P2] = "c";',
      )
      expect(constraints[0]).toEqual({
        type: 'IfConstraint',
        condition: {
          type: 'RelationTerm',
          parameterName: { type: 'ParameterName', name: 'P1' },
          relation: '=',
          right: { type: 'String', value: 'a' },
        },
        then: {
          type: 'RelationTerm',
          parameterName: { type: 'ParameterName', name: 'P2' },
          relation: '=',
          right: { type: 'String', value: 'b' },
        },
        else: {
          type: 'RelationTerm',
          parameterName: { type: 'ParameterName', name: 'P2' },
          relation: '=',
          right: { type: 'String', value: 'c' },
        },
      })
    })
  })

  describe('Multiple constraints', () => {
    it('should parse multiple constraints', () => {
      const constraints = expectOk('[P1] = "a"; [P2] = "b";')
      expect(constraints).toHaveLength(2)
      expect(constraints[0].type).toBe('PredicateConstraint')
      expect(constraints[1].type).toBe('PredicateConstraint')
    })

    it('should parse mixed constraint types', () => {
      const constraints = expectOk('[P1] = "a"; IF [P2] = "b" THEN [P3] = "c";')
      expect(constraints).toHaveLength(2)
      expect(constraints[0].type).toBe('PredicateConstraint')
      expect(constraints[1].type).toBe('IfConstraint')
    })
  })

  describe('Case insensitivity', () => {
    it('should parse lowercase keywords', () => {
      const constraints = expectOk('if [P] = "a" then [Q] = "b";')
      expect(constraints[0].type).toBe('IfConstraint')
    })

    it('should parse mixed case keywords', () => {
      const constraints = expectOk('If [P] = "a" And [Q] = "b" Then [R] = "c";')
      expect(constraints[0].type).toBe('IfConstraint')
    })

    it('should parse lowercase logical operators', () => {
      const constraints = expectOk('[P1] = "a" and [P2] = "b" or [P3] = "c";')
      expect(constraints[0].type).toBe('PredicateConstraint')
    })
  })

  describe('Escape characters', () => {
    it('should parse escaped quote in string value', () => {
      const constraints = expectOk('[P] = "val\\"ue";')
      expect(constraints[0]).toMatchObject({
        type: 'PredicateConstraint',
        predicate: {
          type: 'RelationTerm',
          right: { type: 'String', value: 'val"ue' },
        },
      })
    })

    it('should parse escaped bracket in parameter name', () => {
      const constraints = expectOk('[param\\]name] = "v";')
      expect(constraints[0]).toMatchObject({
        type: 'PredicateConstraint',
        predicate: {
          type: 'RelationTerm',
          parameterName: { name: 'param]name' },
        },
      })
    })

    it('should parse escaped backslash in string', () => {
      const constraints = expectOk('[P] = "a\\\\b";')
      expect(constraints[0]).toMatchObject({
        type: 'PredicateConstraint',
        predicate: {
          type: 'RelationTerm',
          right: { type: 'String', value: 'a\\b' },
        },
      })
    })
  })

  describe('Roundtrip tests', () => {
    it('should roundtrip simple term', () => {
      const input = '[Parameter1] = "Value1";'
      const constraints = expectOk(input)
      const printed = printCodeFromAST(constraints)
      expect(printed[0]).toBe(input)
    })

    it('should roundtrip IF/THEN/ELSE', () => {
      const input = 'IF [P1] = "a" THEN [P2] = "b" ELSE [P2] = "c";'
      const constraints = expectOk(input)
      const printed = printCodeFromAST(constraints)
      expect(printed[0]).toBe(input)
    })

    it('should roundtrip LIKE', () => {
      const input = '[P] LIKE "pattern*";'
      const constraints = expectOk(input)
      const printed = printCodeFromAST(constraints)
      expect(printed[0]).toBe(input)
    })

    it('should roundtrip NOT LIKE', () => {
      const input = '[P] NOT LIKE "pattern*";'
      const constraints = expectOk(input)
      const printed = printCodeFromAST(constraints)
      expect(printed[0]).toBe(input)
    })

    it('should roundtrip IN', () => {
      const input = '[P] IN { "a", "b" };'
      const constraints = expectOk(input)
      const printed = printCodeFromAST(constraints)
      expect(printed[0]).toBe(input)
    })

    it('should roundtrip NOT IN', () => {
      const input = '[P] NOT IN { 1, 2, 3 };'
      const constraints = expectOk(input)
      const printed = printCodeFromAST(constraints)
      expect(printed[0]).toBe(input)
    })

    it('should roundtrip logical operators', () => {
      const input = '[P1] = "a" AND [P2] = "b";'
      const constraints = expectOk(input)
      const printed = printCodeFromAST(constraints)
      expect(printed[0]).toBe(input)
    })

    it('should roundtrip IsNegative with parameter', () => {
      const input = 'IsNegative([P]);'
      const constraints = expectOk(input)
      const printed = printCodeFromAST(constraints)
      expect(printed[0]).toBe(input)
    })

    it('should roundtrip IsPositive without parameter', () => {
      const input = 'IsPositive();'
      const constraints = expectOk(input)
      const printed = printCodeFromAST(constraints)
      expect(printed[0]).toBe(input)
    })

    it('should roundtrip parameter comparison', () => {
      const input = '[P1] = [P2];'
      const constraints = expectOk(input)
      const printed = printCodeFromAST(constraints)
      expect(printed[0]).toBe(input)
    })

    it('should roundtrip complex constraint', () => {
      const input =
        'IF [P1] = "a" AND NOT [P2] = "b" THEN [P3] IN { "c", "d" } OR [P4] LIKE "e*";'
      const constraints = expectOk(input)
      const printed = printCodeFromAST(constraints)
      expect(printed[0]).toBe(input)
    })
  })

  describe('Error cases', () => {
    it('should return error for missing semicolon', () => {
      const result = parseConstraints('[P] = "v"')
      expect(result.ok).toBe(false)
      expect((result as Extract<typeof result, { ok: false }>).error.type).toBe(
        'ExpectedSemicolon',
      )
    })

    it('should return error for missing THEN', () => {
      const result = parseConstraints('IF [P] = "v" [Q] = "w";')
      expect(result.ok).toBe(false)
      expect((result as Extract<typeof result, { ok: false }>).error.type).toBe(
        'ExpectedKeywordThen',
      )
    })

    it('should return error for missing closing parenthesis', () => {
      const result = parseConstraints('([P] = "v";')
      expect(result.ok).toBe(false)
      expect((result as Extract<typeof result, { ok: false }>).error.type).toBe(
        'ExpectedClosingParenthesis',
      )
    })

    it('should return error for missing closing brace', () => {
      const result = parseConstraints('[P] IN { "a", "b";')
      expect(result.ok).toBe(false)
      expect((result as Extract<typeof result, { ok: false }>).error.type).toBe(
        'ExpectedClosingBrace',
      )
    })

    it('should return error for unterminated string', () => {
      const result = parseConstraints('[P] = "value;')
      expect(result.ok).toBe(false)
      expect((result as Extract<typeof result, { ok: false }>).error.type).toBe(
        'UnterminatedString',
      )
    })

    it('should return error for unterminated parameter name', () => {
      const result = parseConstraints('[P = "v";')
      expect(result.ok).toBe(false)
      expect((result as Extract<typeof result, { ok: false }>).error.type).toBe(
        'UnterminatedParameterName',
      )
    })

    it('should return success for empty input', () => {
      const result = parseConstraints('')
      expect(result.ok).toBe(true)
      expect(
        (result as Extract<typeof result, { ok: true }>).value,
      ).toHaveLength(0)
    })

    it('should return error for missing relation', () => {
      const result = parseConstraints('[P] "v";')
      expect(result.ok).toBe(false)
      expect((result as Extract<typeof result, { ok: false }>).error.type).toBe(
        'ExpectedRelation',
      )
    })
  })
})

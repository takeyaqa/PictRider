import { it, describe, expect } from 'vitest'
import { tokenize, ParseException } from './tokenizer'

describe('tokenize', () => {
  describe('Keywords', () => {
    it('should tokenize IF keyword (case-insensitive)', () => {
      const tokens = tokenize('IF')
      expect(tokens[0]).toMatchObject({ type: 'IF', value: 'IF' })
    })

    it('should tokenize lowercase keywords', () => {
      const tokens = tokenize('if then else and or not in like')
      const types = tokens.slice(0, -1).map((t) => t.type)
      expect(types).toEqual([
        'IF',
        'THEN',
        'ELSE',
        'AND',
        'OR',
        'NOT',
        'IN',
        'LIKE',
      ])
    })

    it('should tokenize mixed case keywords', () => {
      const tokens = tokenize('If Then Else')
      const types = tokens.slice(0, -1).map((t) => t.type)
      expect(types).toEqual(['IF', 'THEN', 'ELSE'])
    })

    it('should tokenize function names', () => {
      const tokens = tokenize('IsNegative ISPOSITIVE')
      expect(tokens[0]).toMatchObject({ type: 'ISNEGATIVE' })
      expect(tokens[1]).toMatchObject({ type: 'ISPOSITIVE' })
    })
  })

  describe('Relation operators', () => {
    it('should tokenize =', () => {
      const tokens = tokenize('=')
      expect(tokens[0]).toMatchObject({ type: 'EQ', value: '=' })
    })

    it('should tokenize <>', () => {
      const tokens = tokenize('<>')
      expect(tokens[0]).toMatchObject({ type: 'NE', value: '<>' })
    })

    it('should tokenize < and <=', () => {
      const tokens = tokenize('< <=')
      expect(tokens[0]).toMatchObject({ type: 'LT', value: '<' })
      expect(tokens[1]).toMatchObject({ type: 'LE', value: '<=' })
    })

    it('should tokenize > and >=', () => {
      const tokens = tokenize('> >=')
      expect(tokens[0]).toMatchObject({ type: 'GT', value: '>' })
      expect(tokens[1]).toMatchObject({ type: 'GE', value: '>=' })
    })
  })

  describe('String literals', () => {
    it('should tokenize a simple string', () => {
      const tokens = tokenize('"hello"')
      expect(tokens[0]).toMatchObject({ type: 'STRING', value: 'hello' })
    })

    it('should tokenize a string with escaped quote', () => {
      const tokens = tokenize('"val\\"ue"')
      expect(tokens[0]).toMatchObject({ type: 'STRING', value: 'val"ue' })
    })

    it('should tokenize a string with escaped backslash', () => {
      const tokens = tokenize('"path\\\\to"')
      expect(tokens[0]).toMatchObject({ type: 'STRING', value: 'path\\to' })
    })

    it('should tokenize a string with escaped bracket', () => {
      const tokens = tokenize('"a\\]b"')
      expect(tokens[0]).toMatchObject({ type: 'STRING', value: 'a]b' })
    })

    it('should throw on unterminated string', () => {
      expect(() => tokenize('"hello')).toThrow(ParseException)
    })

    it('should throw on invalid escape character', () => {
      expect(() => tokenize('"\\n"')).toThrow(ParseException)
    })
  })

  describe('Number literals', () => {
    it('should tokenize an integer', () => {
      const tokens = tokenize('42')
      expect(tokens[0]).toMatchObject({ type: 'NUMBER', value: 42 })
    })

    it('should tokenize a decimal number', () => {
      const tokens = tokenize('3.14')
      expect(tokens[0]).toMatchObject({ type: 'NUMBER', value: 3.14 })
    })

    it('should tokenize a negative number', () => {
      const tokens = tokenize('-1')
      expect(tokens[0]).toMatchObject({ type: 'NUMBER', value: -1 })
    })
  })

  describe('Parameter names', () => {
    it('should tokenize a simple parameter name', () => {
      const tokens = tokenize('[Param]')
      expect(tokens[0]).toMatchObject({
        type: 'PARAMETER_NAME',
        value: 'Param',
      })
    })

    it('should tokenize a parameter name with spaces', () => {
      const tokens = tokenize('[My Parameter]')
      expect(tokens[0]).toMatchObject({
        type: 'PARAMETER_NAME',
        value: 'My Parameter',
      })
    })

    it('should tokenize a parameter name with escaped bracket', () => {
      const tokens = tokenize('[param\\]name]')
      expect(tokens[0]).toMatchObject({
        type: 'PARAMETER_NAME',
        value: 'param]name',
      })
    })

    it('should throw on unterminated parameter name', () => {
      expect(() => tokenize('[Param')).toThrow(ParseException)
    })
  })

  describe('Delimiters', () => {
    it('should tokenize parentheses', () => {
      const tokens = tokenize('()')
      expect(tokens[0]).toMatchObject({ type: 'LPAREN' })
      expect(tokens[1]).toMatchObject({ type: 'RPAREN' })
    })

    it('should tokenize braces', () => {
      const tokens = tokenize('{}')
      expect(tokens[0]).toMatchObject({ type: 'LBRACE' })
      expect(tokens[1]).toMatchObject({ type: 'RBRACE' })
    })

    it('should tokenize comma and semicolon', () => {
      const tokens = tokenize(',;')
      expect(tokens[0]).toMatchObject({ type: 'COMMA' })
      expect(tokens[1]).toMatchObject({ type: 'SEMICOLON' })
    })
  })

  describe('Whitespace handling', () => {
    it('should skip spaces and tabs', () => {
      const tokens = tokenize('  IF  \t THEN  ')
      const types = tokens.slice(0, -1).map((t) => t.type)
      expect(types).toEqual(['IF', 'THEN'])
    })

    it('should skip newlines', () => {
      const tokens = tokenize('IF\nTHEN\r\nELSE')
      const types = tokens.slice(0, -1).map((t) => t.type)
      expect(types).toEqual(['IF', 'THEN', 'ELSE'])
    })
  })

  describe('Position tracking', () => {
    it('should track token positions', () => {
      const tokens = tokenize('[P] = "v";')
      expect(tokens[0].position).toBe(0)
      expect(tokens[1].position).toBe(4)
      expect(tokens[2].position).toBe(6)
      expect(tokens[3].position).toBe(9)
    })
  })

  describe('EOF', () => {
    it('should always end with EOF token', () => {
      const tokens = tokenize('')
      expect(tokens).toHaveLength(1)
      expect(tokens[0]).toMatchObject({ type: 'EOF' })
    })

    it('should end with EOF after content', () => {
      const tokens = tokenize('IF')
      expect(tokens[tokens.length - 1]).toMatchObject({ type: 'EOF' })
    })
  })

  describe('Error cases', () => {
    it('should throw ParseException for unexpected character', () => {
      expect(() => tokenize('$')).toThrow(ParseException)
    })

    it('should include error type for unterminated string', () => {
      expect(() => tokenize('"hello')).toThrow(
        expect.objectContaining({
          parseError: expect.objectContaining({
            type: 'UnterminatedString',
          }),
        }),
      )
    })

    it('should include error type for unterminated parameter name', () => {
      expect(() => tokenize('[Param')).toThrow(
        expect.objectContaining({
          parseError: expect.objectContaining({
            type: 'UnterminatedParameterName',
          }),
        }),
      )
    })
  })

  describe('Complex tokenization', () => {
    it('should tokenize a complete constraint', () => {
      const tokens = tokenize('IF [P1] = "v" THEN [P2] <> 42;')
      const types = tokens.slice(0, -1).map((t) => t.type)
      expect(types).toEqual([
        'IF',
        'PARAMETER_NAME',
        'EQ',
        'STRING',
        'THEN',
        'PARAMETER_NAME',
        'NE',
        'NUMBER',
        'SEMICOLON',
      ])
    })

    it('should tokenize IN with value set', () => {
      const tokens = tokenize('[P] IN { "a", "b", 1 }')
      const types = tokens.slice(0, -1).map((t) => t.type)
      expect(types).toEqual([
        'PARAMETER_NAME',
        'IN',
        'LBRACE',
        'STRING',
        'COMMA',
        'STRING',
        'COMMA',
        'NUMBER',
        'RBRACE',
      ])
    })

    it('should tokenize function call', () => {
      const tokens = tokenize('IsNegative([Param])')
      const types = tokens.slice(0, -1).map((t) => t.type)
      expect(types).toEqual([
        'ISNEGATIVE',
        'LPAREN',
        'PARAMETER_NAME',
        'RPAREN',
      ])
    })
  })
})

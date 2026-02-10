import type { ParseError, ParseErrorType } from './types'

export type TokenType =
  // Keywords
  | 'IF'
  | 'THEN'
  | 'ELSE'
  // Logical operators
  | 'AND'
  | 'OR'
  | 'NOT'
  // Relation keywords
  | 'IN'
  | 'LIKE'
  // Function names
  | 'ISNEGATIVE'
  | 'ISPOSITIVE'
  // Relation symbols
  | 'EQ'
  | 'NE'
  | 'LT'
  | 'LE'
  | 'GT'
  | 'GE'
  // Delimiters
  | 'LPAREN'
  | 'RPAREN'
  | 'LBRACE'
  | 'RBRACE'
  | 'COMMA'
  | 'SEMICOLON'
  // Literals
  | 'STRING'
  | 'NUMBER'
  | 'PARAMETER_NAME'
  // End
  | 'EOF'

export interface Token {
  type: TokenType
  value: string | number
  position: number
}

export class ParseException extends Error {
  parseError: ParseError
  constructor(type: ParseErrorType, message: string, position: number) {
    super(message)
    this.parseError = { type, message, position }
  }
}

const KEYWORDS: Partial<Record<string, TokenType>> = {
  IF: 'IF',
  THEN: 'THEN',
  ELSE: 'ELSE',
  AND: 'AND',
  OR: 'OR',
  NOT: 'NOT',
  IN: 'IN',
  LIKE: 'LIKE',
  ISNEGATIVE: 'ISNEGATIVE',
  ISPOSITIVE: 'ISPOSITIVE',
}

const SPECIAL_CHARS = new Set(['\\', '"', ']'])

export function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  let pos = 0

  function throwError(type: ParseErrorType, message: string): ParseException {
    return new ParseException(type, message, pos)
  }

  function peek(): string {
    return pos < input.length ? input[pos] : ''
  }

  function advance(): string {
    return input[pos++]
  }

  function skipWhitespace(): void {
    while (pos < input.length && /\s/.test(input[pos])) {
      pos++
    }
  }

  function readString(): string {
    // opening quote already consumed
    let result = ''
    while (pos < input.length) {
      const ch = advance()
      if (ch === '"') {
        return result
      }
      if (ch === '\\') {
        if (pos >= input.length) {
          throw throwError(
            'UnexpectedEndOfInput',
            'Unexpected end of input in escape sequence',
          )
        }
        const next = advance()
        if (!SPECIAL_CHARS.has(next)) {
          throw throwError(
            'InvalidEscapeCharacter',
            `Invalid escape character: \\${next}`,
          )
        }
        result += next
      } else {
        result += ch
      }
    }
    throw throwError('UnterminatedString', 'Unterminated string literal')
  }

  function readParameterName(): string {
    // opening bracket already consumed
    let result = ''
    while (pos < input.length) {
      const ch = advance()
      if (ch === ']') {
        return result
      }
      if (ch === '\\') {
        if (pos >= input.length) {
          throw throwError(
            'UnexpectedEndOfInput',
            'Unexpected end of input in escape sequence',
          )
        }
        const next = advance()
        if (!SPECIAL_CHARS.has(next)) {
          throw throwError(
            'InvalidEscapeCharacter',
            `Invalid escape character: \\${next}`,
          )
        }
        result += next
      } else {
        result += ch
      }
    }
    throw throwError('UnterminatedParameterName', 'Unterminated parameter name')
  }

  function readNumber(): number {
    const start = pos
    // Handle optional leading minus
    if (pos < input.length && input[pos] === '-') {
      pos++
    }
    // Read digits and optional decimal point
    let hasDigits = false
    while (pos < input.length && /[0-9]/.test(input[pos])) {
      hasDigits = true
      pos++
    }
    if (pos < input.length && input[pos] === '.') {
      pos++
      while (pos < input.length && /[0-9]/.test(input[pos])) {
        hasDigits = true
        pos++
      }
    }
    if (!hasDigits) {
      throw throwError('InvalidNumber', 'Invalid number')
    }
    const numStr = input.slice(start, pos)
    const value = parseFloat(numStr)
    if (!isFinite(value)) {
      throw throwError('InvalidNumber', `Invalid number: ${numStr}`)
    }
    return value
  }

  function isWordChar(ch: string): boolean {
    return /[A-Za-z0-9_]/.test(ch)
  }

  function readWord(): string {
    const start = pos
    while (pos < input.length && isWordChar(input[pos])) {
      pos++
    }
    return input.slice(start, pos)
  }

  for (;;) {
    skipWhitespace()
    if (pos >= input.length) {
      tokens.push({ type: 'EOF', value: '', position: pos })
      break
    }

    const startPos = pos
    const ch = peek()

    // Single-character tokens
    switch (ch) {
      case '(':
        advance()
        tokens.push({ type: 'LPAREN', value: '(', position: startPos })
        continue
      case ')':
        advance()
        tokens.push({ type: 'RPAREN', value: ')', position: startPos })
        continue
      case '{':
        advance()
        tokens.push({ type: 'LBRACE', value: '{', position: startPos })
        continue
      case '}':
        advance()
        tokens.push({ type: 'RBRACE', value: '}', position: startPos })
        continue
      case ',':
        advance()
        tokens.push({ type: 'COMMA', value: ',', position: startPos })
        continue
      case ';':
        advance()
        tokens.push({ type: 'SEMICOLON', value: ';', position: startPos })
        continue
      case '=':
        advance()
        tokens.push({ type: 'EQ', value: '=', position: startPos })
        continue
      case '>':
        advance()
        if (peek() === '=') {
          advance()
          tokens.push({ type: 'GE', value: '>=', position: startPos })
        } else {
          tokens.push({ type: 'GT', value: '>', position: startPos })
        }
        continue
      case '<':
        advance()
        if (peek() === '>') {
          advance()
          tokens.push({ type: 'NE', value: '<>', position: startPos })
        } else if (peek() === '=') {
          advance()
          tokens.push({ type: 'LE', value: '<=', position: startPos })
        } else {
          tokens.push({ type: 'LT', value: '<', position: startPos })
        }
        continue
      default:
        break
    }

    // String literal
    if (ch === '"') {
      advance()
      const value = readString()
      tokens.push({ type: 'STRING', value, position: startPos })
      continue
    }

    // Parameter name
    if (ch === '[') {
      advance()
      const value = readParameterName()
      tokens.push({ type: 'PARAMETER_NAME', value, position: startPos })
      continue
    }

    // Number (digit or minus followed by digit)
    if (
      /[0-9]/.test(ch) ||
      (ch === '-' && pos + 1 < input.length && /[0-9]/.test(input[pos + 1]))
    ) {
      const value = readNumber()
      tokens.push({ type: 'NUMBER', value, position: startPos })
      continue
    }

    // Word (keyword or identifier)
    if (/[A-Za-z_]/.test(ch)) {
      const word = readWord()
      const upper = word.toUpperCase()
      const keywordType = KEYWORDS[upper]
      if (keywordType != null) {
        tokens.push({ type: keywordType, value: word, position: startPos })
      } else {
        throw throwError('UnexpectedToken', `Unexpected identifier: ${word}`)
      }
      continue
    }

    throw throwError('UnexpectedToken', `Unexpected character: ${ch}`)
  }

  return tokens
}

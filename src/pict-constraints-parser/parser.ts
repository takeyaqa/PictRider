import type {
  Constraints,
  Constraint,
  Predicate,
  Clause,
  Term,
  Value,
  ValueSet,
  LogicalOperator,
  Relation,
  ParseError,
  ParseResult,
} from './types'
import {
  tokenize,
  ParseException,
  type Token,
  type TokenType,
} from './tokenizer'

class Parser {
  private tokens: Token[]
  private pos: number

  constructor(tokens: Token[]) {
    this.tokens = tokens
    this.pos = 0
  }

  private peek(): Token {
    return this.tokens[this.pos]
  }

  private advance(): Token {
    const token = this.tokens[this.pos]
    this.pos++
    return token
  }

  private match(type: TokenType): boolean {
    if (this.peek().type === type) {
      this.advance()
      return true
    }
    return false
  }

  private expect(type: TokenType): Token {
    const token = this.peek()
    if (token.type !== type) {
      throw new ParseException(
        expectedTokenErrorType(type),
        `Expected ${type} but found ${token.type}`,
        token.position,
      )
    }
    return this.advance()
  }

  private throwError(
    type: ParseError['type'],
    message: string,
  ): ParseException {
    return new ParseException(type, message, this.peek().position)
  }

  parseConstraints(): Constraints {
    const constraints: Constraints = []
    while (this.peek().type !== 'EOF') {
      constraints.push(this.parseConstraint())
    }
    return constraints
  }

  private parseConstraint(): Constraint {
    if (this.peek().type === 'IF') {
      this.advance()
      const condition = this.parsePredicate()
      this.expect('THEN')
      const thenPredicate = this.parsePredicate()
      let elsePredicate: Predicate | undefined
      if (this.peek().type === 'ELSE') {
        this.advance()
        elsePredicate = this.parsePredicate()
      }
      this.expect('SEMICOLON')
      const result: Constraint = {
        type: 'IfConstraint',
        condition,
        then: thenPredicate,
      }
      if (elsePredicate != null) {
        result.else = elsePredicate
      }
      return result
    }

    const predicate = this.parsePredicate()
    this.expect('SEMICOLON')
    return { type: 'PredicateConstraint', predicate }
  }

  private parsePredicate(): Predicate {
    const left = this.parseClause()
    const tokenType = this.peek().type
    if (tokenType === 'AND' || tokenType === 'OR') {
      this.advance()
      const operator: LogicalOperator = tokenType
      const right = this.parsePredicate()
      return { type: 'LogicalPredicate', left, operator, right }
    }
    return left
  }

  private parseClause(): Clause {
    // ( Predicate )
    if (this.peek().type === 'LPAREN') {
      this.advance()
      const predicate = this.parsePredicate()
      this.expect('RPAREN')
      return { type: 'PredicateClause', predicate }
    }

    // NOT Predicate
    if (this.peek().type === 'NOT') {
      this.advance()
      const predicate = this.parsePredicate()
      return { type: 'NotClause', predicate }
    }

    // Term
    return this.parseTerm()
  }

  private parseTerm(): Term {
    // Function: IsNegative(...) or IsPositive(...)
    if (
      this.peek().type === 'ISNEGATIVE' ||
      this.peek().type === 'ISPOSITIVE'
    ) {
      const funcToken = this.advance()
      const funcName =
        funcToken.type === 'ISNEGATIVE' ? 'IsNegative' : 'IsPositive'
      this.expect('LPAREN')
      let parameterName: string | undefined
      if (this.peek().type === 'PARAMETER_NAME') {
        parameterName = this.advance().value as string
      }
      this.expect('RPAREN')
      return { type: 'FunctionTerm', function: funcName, parameterName }
    }

    // ParameterName Relation Value/ParameterName
    const paramToken = this.expect('PARAMETER_NAME')
    const paramName = paramToken.value as string

    // Check for NOT IN / NOT LIKE
    if (this.peek().type === 'NOT') {
      const savedPos = this.pos
      this.advance()
      if (this.peek().type === 'IN') {
        this.advance()
        return this.parseInTerm(paramName, true)
      }
      if (this.peek().type === 'LIKE') {
        this.advance()
        return this.parseLikeTerm(paramName, true)
      }
      // Not a NOT IN/NOT LIKE, restore position
      this.pos = savedPos
    }

    // IN { ValueSet }
    if (this.peek().type === 'IN') {
      this.advance()
      return this.parseInTerm(paramName, false)
    }

    // LIKE "pattern"
    if (this.peek().type === 'LIKE') {
      this.advance()
      return this.parseLikeTerm(paramName, false)
    }

    // Relation (=, <>, <, <=, >, >=)
    const relation = this.parseRelation()

    // Right side: Value or ParameterName
    if (this.peek().type === 'PARAMETER_NAME') {
      const rightParam = this.advance().value as string
      return {
        type: 'RelationTerm',
        parameterName: { type: 'ParameterName', name: paramName },
        relation,
        right: { type: 'ParameterName', name: rightParam },
      }
    }

    const value = this.parseValue()
    return {
      type: 'RelationTerm',
      parameterName: { type: 'ParameterName', name: paramName },
      relation,
      right: value,
    }
  }

  private parseInTerm(paramName: string, negated: boolean): Term {
    this.expect('LBRACE')
    const values = this.parseValueSet()
    this.expect('RBRACE')
    return { type: 'InTerm', negated, parameter: paramName, values }
  }

  private parseLikeTerm(paramName: string, negated: boolean): Term {
    const patternToken = this.expect('STRING')
    return {
      type: 'LikeTerm',
      negated,
      parameter: paramName,
      patternString: patternToken.value as string,
    }
  }

  private parseRelation(): Relation {
    const token = this.peek()
    switch (token.type) {
      case 'EQ':
        this.advance()
        return '='
      case 'NE':
        this.advance()
        return '<>'
      case 'LT':
        this.advance()
        return '<'
      case 'LE':
        this.advance()
        return '<='
      case 'GT':
        this.advance()
        return '>'
      case 'GE':
        this.advance()
        return '>='
      default:
        throw this.throwError(
          'ExpectedRelation',
          `Expected relation operator but found ${token.type}`,
        )
    }
  }

  private parseValue(): Value {
    const token = this.peek()
    if (token.type === 'STRING') {
      this.advance()
      return { type: 'String', value: token.value as string }
    }
    if (token.type === 'NUMBER') {
      this.advance()
      return { type: 'Number', value: token.value as number }
    }
    throw this.throwError(
      'ExpectedValue',
      `Expected value but found ${token.type}`,
    )
  }

  private parseValueSet(): ValueSet {
    const values: ValueSet = []
    values.push(this.parseValue())
    while (this.match('COMMA')) {
      values.push(this.parseValue())
    }
    return values
  }
}

function expectedTokenErrorType(type: TokenType): ParseError['type'] {
  switch (type) {
    case 'SEMICOLON':
      return 'ExpectedSemicolon'
    case 'THEN':
      return 'ExpectedKeywordThen'
    case 'RPAREN':
      return 'ExpectedClosingParenthesis'
    case 'RBRACE':
      return 'ExpectedClosingBrace'
    case 'PARAMETER_NAME':
      return 'ExpectedValue'
    default:
      return 'UnexpectedToken'
  }
}

export function parseConstraints(input: string): ParseResult<Constraints> {
  try {
    const tokens = tokenize(input)
    const parser = new Parser(tokens)
    const value = parser.parseConstraints()
    return { ok: true, value }
  } catch (e: unknown) {
    if (e instanceof ParseException) {
      return { ok: false, error: e.parseError }
    }
    throw e
  }
}

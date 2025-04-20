import { it, describe, expect } from 'vitest'
import { printConstraints } from '../../src/pict/pict-helper'
import { Constraint } from '../../src/pict/pict-types'

describe('convertConstraints', () => {
  it('should convert basic constraint (1)', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'if',
            parameter: 'A',
            predicate: 'a1',
          },
          {
            ifOrThen: 'then',
            parameter: 'B',
            predicate: 'b1',
          },
        ],
      },
    ]

    const result = printConstraints(constraints, ['A', 'B', 'C', 'D'])
    expect(result).toBe('IF [A] = "a1" THEN [B] = "b1";')
  })

  it('should convert basic constraint (2)', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'if',
            parameter: 'A',
            predicate: '#a1',
          },
          {
            ifOrThen: 'then',
            parameter: 'B',
            predicate: '#b1',
          },
        ],
      },
    ]

    const result = printConstraints(constraints, ['A', 'B', 'C', 'D'])
    expect(result).toBe('IF [A] <> "a1" THEN [B] <> "b1";')
  })

  it('should convert basic constraint (3)', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'if',
            parameter: 'A',
            predicate: 'a1, a2',
          },
          {
            ifOrThen: 'then',
            parameter: 'B',
            predicate: 'b1',
          },
        ],
      },
    ]

    const result = printConstraints(constraints, ['A', 'B', 'C', 'D'])
    expect(result).toBe('IF [A] = "a1" OR [A] = "a2" THEN [B] = "b1";')
  })

  it('should convert basic constraint (4)', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'if',
            parameter: 'A',
            predicate: 'a3',
          },
          {
            ifOrThen: 'then',
            parameter: 'B',
            predicate: '#b1',
          },
        ],
      },
    ]

    const result = printConstraints(constraints, ['A', 'B', 'C', 'D'])
    expect(result).toBe('IF [A] = "a3" THEN [B] <> "b1";')
  })

  it('should convert basic constraint (5)', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'if',
            parameter: 'A',
            predicate: 'a1,a2',
          },
          {
            ifOrThen: 'if',
            parameter: 'B',
            predicate: 'b1',
          },
          {
            ifOrThen: 'then',
            parameter: 'C',
            predicate: '#c2,c3',
          },
        ],
      },
    ]

    const result = printConstraints(constraints, ['A', 'B', 'C', 'D'])
    expect(result).toBe(
      'IF ([A] = "a1" OR [A] = "a2") AND [B] = "b1" THEN [C] <> "c2" AND [C] <> "c3";',
    )
  })

  it('should convert basic constraint (6)', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'if',
            parameter: 'A',
            predicate: 'a3',
          },
          {
            ifOrThen: 'then',
            parameter: 'B',
            predicate: '#b1',
          },
          {
            ifOrThen: 'then',
            parameter: 'C',
            predicate: 'c2,c3',
          },
        ],
      },
    ]

    const result = printConstraints(constraints, ['A', 'B', 'C', 'D'])
    expect(result).toBe(
      'IF [A] = "a3" THEN [B] <> "b1" AND ([C] = "c2" OR [C] = "c3");',
    )
  })

  it('should convert basic constraint (7)', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'if',
            parameter: 'B',
            predicate: 'b1',
          },
          {
            ifOrThen: 'then',
            parameter: 'C',
            predicate: 'c1',
          },
        ],
      },
    ]

    const result = printConstraints(constraints, ['A', 'B', 'C', 'D'])
    expect(result).toBe('IF [B] = "b1" THEN [C] = "c1";')
  })

  it('should convert basic constraint (8)', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'if',
            parameter: 'A',
            predicate: 'a1,<a2',
          },
          {
            ifOrThen: 'if',
            parameter: 'B',
            predicate: 'b1',
          },
          {
            ifOrThen: 'then',
            parameter: 'C',
            predicate: '#c2,c3',
          },
        ],
      },
    ]

    const result = printConstraints(constraints, ['A', 'B', 'C', 'D'])
    expect(result).toBe(
      'IF ([A] = "a1" AND [A] < "a2") AND [B] = "b1" THEN [C] <> "c2" AND [C] <> "c3";',
    )
  })

  it('should convert basic constraint (9)', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'if',
            parameter: 'A',
            predicate: 'a1,a2,< a3',
          },
          {
            ifOrThen: 'if',
            parameter: 'B',
            predicate: 'b1',
          },
          {
            ifOrThen: 'then',
            parameter: 'C',
            predicate: '#c2,c3',
          },
        ],
      },
    ]

    const result = printConstraints(constraints, ['A', 'B', 'C', 'D'])
    expect(result).toBe(
      'IF (([A] = "a1" OR [A] = "a2") AND [A] < "a3") AND [B] = "b1" THEN [C] <> "c2" AND [C] <> "c3";',
    )
  })

  it('should convert basic constraint (10)', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'if',
            parameter: 'A',
            predicate: 'a1,<=a2,a3',
          },
          {
            ifOrThen: 'if',
            parameter: 'B',
            predicate: 'b1',
          },
          {
            ifOrThen: 'then',
            parameter: 'C',
            predicate: '#c2,c3',
          },
        ],
      },
    ]

    const result = printConstraints(constraints, ['A', 'B', 'C', 'D'])
    expect(result).toBe(
      'IF (([A] = "a1" AND [A] <= "a2") OR [A] = "a3") AND [B] = "b1" THEN [C] <> "c2" AND [C] <> "c3";',
    )
  })

  it('should convert basic constraint (11)', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'if',
            parameter: 'A',
            predicate: '>a1,a2,a3',
          },
          {
            ifOrThen: 'if',
            parameter: 'B',
            predicate: 'b1',
          },
          {
            ifOrThen: 'then',
            parameter: 'C',
            predicate: '#c2,c3',
          },
        ],
      },
    ]

    const result = printConstraints(constraints, ['A', 'B', 'C', 'D'])
    expect(result).toBe(
      'IF (([A] > "a1" OR [A] = "a2") OR [A] = "a3") AND [B] = "b1" THEN [C] <> "c2" AND [C] <> "c3";',
    )
  })

  it('should not convert error constraint', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'if',
            parameter: 'A',
            predicate: 'a1,a2',
          },
          {
            ifOrThen: 'then',
            parameter: 'C',
            predicate: 'c2,#c3',
          },
        ],
      },
    ]

    const result = printConstraints(constraints, ['A', 'B', 'C', 'D'])
    expect(result).toBe('')
  })

  it('should convert parameter and parameter constraint (1)', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'if',
            parameter: 'A',
            predicate: 'a1',
          },
          {
            ifOrThen: 'then',
            parameter: 'C',
            predicate: '!B',
          },
        ],
      },
    ]

    const result = printConstraints(constraints, ['A', 'B', 'C', 'D'])
    expect(result).toBe('IF [A] = "a1" THEN [C] <> [B];')
  })

  it('should convert parameter and parameter constraint (2)', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'if',
            parameter: 'B',
            predicate: '=C',
          },
          {
            ifOrThen: 'then',
            parameter: 'A',
            predicate: 'a3',
          },
        ],
      },
    ]

    const result = printConstraints(constraints, ['A', 'B', 'C', 'D'])
    expect(result).toBe('IF [B] = [C] THEN [A] = "a3";')
  })

  it('should convert parameter and parameter constraint (3)', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'then',
            parameter: 'A',
            predicate: 'a1',
          },
          {
            ifOrThen: 'if',
            parameter: 'B',
            predicate: '=C, &=D',
          },
        ],
      },
    ]

    const result = printConstraints(constraints, ['A', 'B', 'C', 'D'])
    expect(result).toBe('IF [B] = [C] AND [B] = [D] THEN [A] = "a1";')
  })

  it('should convert parameter and parameter constraint (4)', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'then',
            parameter: 'A',
            predicate: '#a1',
          },
          {
            ifOrThen: 'if',
            parameter: 'B',
            predicate: '!C, !D',
          },
        ],
      },
    ]

    const result = printConstraints(constraints, ['A', 'B', 'C', 'D'])
    expect(result).toBe('IF [B] <> [C] OR [B] <> [D] THEN [A] <> "a1";')
  })

  it('should convert condition less constraint 1', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'then',
            parameter: 'B',
            predicate: '!C',
          },
          {
            ifOrThen: 'then',
            parameter: 'C',
            predicate: '!D',
          },
          {
            ifOrThen: 'then',
            parameter: 'D',
            predicate: '!B',
          },
        ],
      },
    ]

    const result = printConstraints(constraints, ['A', 'B', 'C', 'D'])
    expect(result).toBe('([B] <> [C] AND [C] <> [D]) AND [D] <> [B];')
  })

  it('should convert condition less constraint 2', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'then',
            parameter: 'B',
            predicate: '=C, !D',
          },
          {
            ifOrThen: 'then',
            parameter: 'D',
            predicate: '!E, &=F',
          },
        ],
      },
    ]

    const result = printConstraints(constraints, ['A', 'B', 'C', 'D', 'E', 'F'])
    expect(result).toBe(
      '([B] = [C] OR [B] <> [D]) AND ([D] <> [E] AND [D] = [F]);',
    )
  })

  it('should convert wildcard constraint', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'if',
            parameter: 'B',
            predicate: '*B*',
          },
          {
            ifOrThen: 'then',
            parameter: 'C',
            predicate: '#C??',
          },
        ],
      },
    ]

    const result = printConstraints(constraints, ['A', 'B', 'C'])
    expect(result).toBe('IF [B] LIKE "*B*" THEN [C] NOT LIKE "C??";')
  })

  it('should convert a simple constraint with one if and one then condition', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'if',
            parameter: 'Type',
            predicate: 'RAID-5',
          },
          {
            ifOrThen: 'then',
            parameter: 'Size',
            predicate: '> 1000',
          },
        ],
      },
    ]

    const result = printConstraints(constraints, ['Type', 'Size'])
    expect(result).toBe('IF [Type] = "RAID-5" THEN [Size] > 1000;')
  })

  it('should convert a constraint with double if conditions', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'if',
            parameter: 'Type',
            predicate: 'RAID-5',
          },
          {
            ifOrThen: 'if',
            parameter: 'Format method',
            predicate: 'Quick',
          },
          {
            ifOrThen: 'then',
            parameter: 'Size',
            predicate: '>1000',
          },
        ],
      },
    ]

    const result = printConstraints(constraints, [
      'Type',
      'Format method',
      'Size',
    ])
    expect(result).toBe(
      'IF [Type] = "RAID-5" AND [Format method] = "Quick" THEN [Size] > 1000;',
    )
  })

  it('should convert a constraint with triple if conditions', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'if',
            parameter: 'Type',
            predicate: 'RAID-5',
          },
          {
            ifOrThen: 'if',
            parameter: 'Format method',
            predicate: 'Quick',
          },
          {
            ifOrThen: 'then',
            parameter: 'Size',
            predicate: '>  1000',
          },
          {
            ifOrThen: 'if',
            parameter: 'Compression',
            predicate: 'ON',
          },
        ],
      },
    ]

    const result = printConstraints(constraints, [
      'Type',
      'Format method',
      'Size',
      'Compression',
    ])
    expect(result).toBe(
      'IF ([Type] = "RAID-5" AND [Format method] = "Quick") AND [Compression] = "ON" THEN [Size] > 1000;',
    )
  })

  it('should convert a constraint with multiple then conditions', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'if',
            parameter: 'Type',
            predicate: 'RAID-5',
          },
          {
            ifOrThen: 'then',
            parameter: 'Size',
            predicate: '> 1000',
          },
          {
            ifOrThen: 'then',
            parameter: 'Compression',
            predicate: 'OFF',
          },
        ],
      },
    ]

    const result = printConstraints(constraints, [
      'Type',
      'Size',
      'Compression',
    ])
    expect(result).toBe(
      'IF [Type] = "RAID-5" THEN [Size] > 1000 AND [Compression] = "OFF";',
    )
  })

  it('should ignore conditions with empty predicates', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'if',
            parameter: 'Type',
            predicate: 'RAID-5',
          },
          {
            ifOrThen: 'if',
            parameter: 'Format method',
            predicate: '', // Empty predicate should be ignored
          },
          {
            ifOrThen: 'then',
            parameter: 'Size',
            predicate: '> 1000',
          },
          {
            ifOrThen: 'then',
            parameter: 'Compression',
            predicate: '', // Empty predicate should be ignored
          },
        ],
      },
    ]

    const result = printConstraints(constraints, [
      'Type',
      'Format method',
      'Size',
      'Compression',
    ])
    expect(result).toBe('IF [Type] = "RAID-5" THEN [Size] > 1000;')
  })

  it('should return an empty string when no valid conditions exist', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'if',
            parameter: 'Type',
            predicate: '',
          },
          {
            ifOrThen: 'then',
            parameter: 'Size',
            predicate: '',
          },
        ],
      },
    ]

    const result = printConstraints(constraints, ['Type', 'Size'])
    expect(result).toBe('')
  })

  it('should return an empty string with only if conditions', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'if',
            parameter: 'Type',
            predicate: 'RAID-5',
          },
          {
            ifOrThen: 'if',
            parameter: 'Format method',
            predicate: 'Quick',
          },
        ],
      },
    ]

    const result = printConstraints(constraints, ['Type', 'Format method'])
    // Since there are no THEN conditions, it should just return the IF part
    expect(result).toBe('')
  })

  it('should handle a constraint with only then conditions', () => {
    const constraints: Constraint[] = [
      {
        conditions: [
          {
            ifOrThen: 'then',
            parameter: 'Size',
            predicate: '> 1000',
          },
          {
            ifOrThen: 'then',
            parameter: 'Compression',
            predicate: 'OFF',
          },
        ],
      },
    ]

    const result = printConstraints(
      constraints,
      constraints[0].conditions.map((c) => c.parameter),
    )
    // Since there are no IF conditions, it should just return the THEN part
    expect(result).toBe('[Size] > 1000 AND [Compression] = "OFF";')
  })
})

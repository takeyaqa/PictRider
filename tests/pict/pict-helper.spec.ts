import { it, describe, expect } from 'vitest'
import { convertConstraint } from '../../src/pict/pict-helper'
import { Constraint } from '../../src/pict/pict-types'

describe('convertConstraints', () => {
  it('should convert a simple constraint with one if and one then condition', () => {
    const constraint: Constraint = {
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
    }

    const result = convertConstraint(constraint)
    expect(result).toBe('IF [Type] = "RAID-5" THEN [Size] > 1000;')
  })

  it('should convert a constraint with double if conditions', () => {
    const constraint: Constraint = {
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
          predicate: '> 1000',
        },
      ],
    }

    const result = convertConstraint(constraint)
    expect(result).toBe(
      'IF [Type] = "RAID-5" AND [Format method] = "Quick" THEN [Size] > 1000;',
    )
  })

  it('should convert a constraint with triple if conditions', () => {
    const constraint: Constraint = {
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
          predicate: '> 1000',
        },
        {
          ifOrThen: 'if',
          parameter: 'Compression',
          predicate: 'ON',
        },
      ],
    }

    const result = convertConstraint(constraint)
    expect(result).toBe(
      'IF [Type] = "RAID-5" AND [Format method] = "Quick" AND [Compression] = "ON" THEN [Size] > 1000;',
    )
  })

  it('should convert a constraint with multiple then conditions', () => {
    const constraint: Constraint = {
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
          predicate: '= "OFF"',
        },
      ],
    }

    const result = convertConstraint(constraint)
    expect(result).toBe(
      'IF [Type] = "RAID-5" THEN [Size] > 1000 AND [Compression] = "OFF";',
    )
  })

  it('should ignore conditions with empty predicates', () => {
    const constraint: Constraint = {
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
    }

    const result = convertConstraint(constraint)
    expect(result).toBe('IF [Type] = "RAID-5" THEN [Size] > 1000;')
  })

  it('should return an empty string when no valid conditions exist', () => {
    const constraint: Constraint = {
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
    }

    const result = convertConstraint(constraint)
    expect(result).toBe('')
  })

  it('should return an empty string with only if conditions', () => {
    const constraint: Constraint = {
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
    }

    const result = convertConstraint(constraint)
    // Since there are no THEN conditions, it should just return the IF part
    expect(result).toBe('')
  })

  it('should handle a constraint with only then conditions', () => {
    const constraint: Constraint = {
      conditions: [
        {
          ifOrThen: 'then',
          parameter: 'Size',
          predicate: '> 1000',
        },
        {
          ifOrThen: 'then',
          parameter: 'Compression',
          predicate: '= "OFF"',
        },
      ],
    }

    const result = convertConstraint(constraint)
    // Since there are no IF conditions, it should just return the THEN part
    expect(result).toBe('[Size] > 1000 AND [Compression] = "OFF";')
  })
})

/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import '@testing-library/jest-dom/vitest'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App'
import { PictRunner } from '../src/pict/pict-runner'

describe('App', () => {
  describe('ParametersArea', () => {
    let user: any

    beforeEach(() => {
      user = userEvent.setup()
      render(<App />)
    })

    afterEach(() => {
      cleanup()
    })

    it('Should display PictRider title and default parameter values', () => {
      // assert - only checking default text and values
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'PictRider',
      )
      expect(screen.getAllByRole('textbox')).toHaveLength(12)
      expect(screen.getAllByRole('textbox')[0]).toHaveValue('Type')
      expect(screen.getAllByRole('textbox')[1]).toHaveValue(
        'Single, Span, Stripe, Mirror, RAID-5',
      )
      expect(screen.getAllByRole('textbox')[10]).toHaveValue('Compression')
      expect(screen.getAllByRole('textbox')[11]).toHaveValue('ON, OFF')
    })

    it('Should add a new parameter row when clicking the add row button', async () => {
      // act
      await user.click(screen.getByText('Add Row'))

      // assert - check count and default values (new row should be empty)
      expect(screen.getAllByRole('textbox')).toHaveLength(14)
      expect(screen.getAllByRole('textbox')[0]).toHaveValue('Type')
      expect(screen.getAllByRole('textbox')[1]).toHaveValue(
        'Single, Span, Stripe, Mirror, RAID-5',
      )
      expect(screen.getAllByRole('textbox')[10]).toHaveValue('Compression')
      expect(screen.getAllByRole('textbox')[11]).toHaveValue('ON, OFF')
      expect(screen.getAllByRole('textbox')[12]).toHaveValue('')
      expect(screen.getAllByRole('textbox')[13]).toHaveValue('')
    })

    it('Should remove a parameter row when clicking the delete row button', async () => {
      // act
      await user.click(screen.getByText('Remove Row'))

      // assert - check count and default values
      expect(screen.getAllByRole('textbox')).toHaveLength(10)
      expect(screen.getAllByRole('textbox')[0]).toHaveValue('Type')
      expect(screen.getAllByRole('textbox')[1]).toHaveValue(
        'Single, Span, Stripe, Mirror, RAID-5',
      )
      expect(screen.getAllByRole('textbox')[8]).toHaveValue('Cluster size')
      expect(screen.getAllByRole('textbox')[9]).toHaveValue('Quick, Slow')
    })

    it('Should disable delete row button when only one low', async () => {
      // act - delete rows until only one row is left
      await user.click(screen.getByText('Remove Row'))
      await user.click(screen.getByText('Remove Row'))
      await user.click(screen.getByText('Remove Row'))
      await user.click(screen.getByText('Remove Row'))
      await user.click(screen.getByText('Remove Row'))

      // assert
      expect(screen.getByText('Remove Row')).toBeDisabled()
    })

    it('Should clear all parameter values when clicking the clear button', async () => {
      // act
      await user.click(screen.getByText('Clear'))

      // assert - check count is not changed but values is empty
      expect(screen.getAllByRole('textbox')).toHaveLength(12)
      expect(screen.getAllByRole('textbox')[0]).toHaveValue('')
      expect(screen.getAllByRole('textbox')[1]).toHaveValue('')
      expect(screen.getAllByRole('textbox')[10]).toHaveValue('')
      expect(screen.getAllByRole('textbox')[11]).toHaveValue('')
    })

    it('Should handle adding and removing multiple parameter rows', async () => {
      // Initial state - 12 textbox (6 parameter rows)
      expect(screen.getAllByRole('textbox')).toHaveLength(12)

      // Add 3 rows
      // act - add first row
      await user.click(screen.getByText('Add Row'))
      // assert
      expect(screen.getAllByRole('textbox')).toHaveLength(14)

      // act - add second row
      await user.click(screen.getByText('Add Row'))
      // assert
      expect(screen.getAllByRole('textbox')).toHaveLength(16)

      // act - add third row
      await user.click(screen.getByText('Add Row'))
      // assert
      expect(screen.getAllByRole('textbox')).toHaveLength(18)

      // Now remove 2 rows
      // act - remove first row
      await user.click(screen.getByText('Remove Row'))
      // assert
      expect(screen.getAllByRole('textbox')).toHaveLength(16)

      // act - remove second row
      await user.click(screen.getByText('Remove Row'))
      // assert
      expect(screen.getAllByRole('textbox')).toHaveLength(14)

      // Verify we still have the correct values in the remaining textbox
      expect(screen.getAllByRole('textbox')[0]).toHaveValue('Type')
      expect(screen.getAllByRole('textbox')[1]).toHaveValue(
        'Single, Span, Stripe, Mirror, RAID-5',
      )
      expect(screen.getAllByRole('textbox')[12]).toHaveValue('')
      expect(screen.getAllByRole('textbox')[13]).toHaveValue('')
    })
  })

  describe('ConstraintsArea', () => {
    let user: any

    beforeEach(() => {
      user = userEvent.setup()
      render(<App />)
    })

    afterEach(() => {
      cleanup()
    })

    it('Should not render constraints area by default', () => {
      // assert - by default, constraints area should not be visible
      expect(screen.queryByText('Add Constraint')).not.toBeInTheDocument()
      expect(screen.queryByText('Remove Constraint')).not.toBeInTheDocument()
    })

    it('Should render constraints area when enabled', async () => {
      // act - enable constraints area by clicking the checkbox
      await user.click(screen.getByLabelText('Constraints'))

      // assert - verify constraints area is rendered
      expect(screen.getByText('Add Constraint')).toBeInTheDocument()
      expect(screen.getByText('Remove Constraint')).toBeInTheDocument()
      expect(screen.getByText('Parameter')).toBeInTheDocument() // One in parameters area, one in constraints area
      expect(screen.getByText('Constraint 1')).toBeInTheDocument()
      expect(screen.getAllByText('if')).toHaveLength(6) // Default app has 6 parameters, so we should have 6 'if' buttons
    })

    it('Should add a new constraint when add constraint button is clicked', async () => {
      // arrange -  enable constraints area
      await user.click(screen.getByLabelText('Constraints'))

      // assume - initially there should be one constraint
      expect(screen.getByText('Constraint 1')).toBeInTheDocument()
      expect(screen.queryByText('Constraint 2')).not.toBeInTheDocument()

      // act - add a new constraint
      await user.click(screen.getByText('Add Constraint'))

      // assert - now there should be two constraints
      expect(screen.getByText('Constraint 1')).toBeInTheDocument()
      expect(screen.getByText('Constraint 2')).toBeInTheDocument()
      expect(screen.getAllByText('if')).toHaveLength(12) // With 6 parameters and 2 constraints, we should have 12 'if' buttons
    })

    it('Should remove a constraint when remove constraint button is clicked', async () => {
      // arrange - enable constraints area and add a constraint so we have two
      await user.click(screen.getByLabelText('Constraints'))
      await user.click(screen.getByText('Add Constraint'))

      // assume - there should be two constraints
      expect(screen.getByText('Constraint 2')).toBeInTheDocument()

      // assert - remove constraint button should be enabled
      expect(screen.getByText('Remove Constraint')).toBeEnabled()

      // act - remove a constraint
      await user.click(screen.getByText('Remove Constraint'))

      // assert - now there should be only one constraint
      expect(screen.getByText('Constraint 1')).toBeInTheDocument()
      expect(screen.queryByText('Constraint 2')).not.toBeInTheDocument()
      expect(screen.getAllByText('if')).toHaveLength(6) // With 6 parameters and 1 constraint, we should have 6 'if' buttons
    })

    it('Should disable remove constraint button when only one constraint exists', async () => {
      // act - enable constraints area
      await user.click(screen.getByLabelText('Constraints'))

      // assert - by default there's only one constraint, so remove button should be disabled
      expect(screen.getByText('Remove Constraint')).toBeDisabled()

      // act - add a constraint
      await user.click(screen.getByText('Add Constraint'))

      // assert - now remove button should be enabled
      expect(screen.getByText('Remove Constraint')).toBeEnabled()

      // act - remove the constraint
      await user.click(screen.getByText('Remove Constraint'))

      // assert - remove button should be disabled again
      expect(screen.getByText('Remove Constraint')).toBeDisabled()
    })

    it('Should toggle condition between if and then when clicked', async () => {
      // arrange - enable constraints area
      await user.click(screen.getByLabelText('Constraints'))
      const firstIfButton = screen.getAllByText('if')[0] // Get the first 'if' button

      // act - click it to toggle to 'then'
      await user.click(firstIfButton)

      // assert - now it should be 'then'
      expect(firstIfButton).toHaveTextContent('then')

      // act - click it again to toggle back to 'if'
      await user.click(firstIfButton)

      // assert - now it should be 'if' again
      expect(firstIfButton).toHaveTextContent('if')
    })

    it('Should update condition predicate when input is changed', async () => {
      // arrange - enable constraints area
      await user.click(screen.getByLabelText('Constraints'))

      // get the second 'if' button (for Size parameter) and change it to 'then'
      const ifButtons = screen.getAllByText('if')
      await user.click(ifButtons[1])

      // find all inputs in the constraints area
      const constraintsTable = screen.getAllByRole('table')[0]
      const inputs = constraintsTable.querySelectorAll('input[type="text"]')

      // act - type predicates in both inputs
      await user.type(inputs[0], 'RAID-5')
      await user.type(inputs[1], '> 1000')

      // assert - the inputs should now have the values
      expect(inputs[0]).toHaveValue('RAID-5')
      expect(inputs[1]).toHaveValue('> 1000')

      // the constraint should be displayed in the pre element
      const preElement = screen.getByText(
        /IF \[Type\] = "RAID-5" THEN \[Size\] > 1000;/i,
      )
      expect(preElement).toBeInTheDocument()
    })

    it('Should display complex constraints with if/then conditions', async () => {
      // arrange - enable constraints area
      await user.click(screen.getByLabelText('Constraints'))

      // get the second 'if' button
      const ifButtons = screen.getAllByText('if')
      const secondIfButton = ifButtons[1]

      // change the second to 'then'
      await user.click(secondIfButton)

      // find all inputs in the constraints area
      const constraintsTable = screen.getAllByRole('table')[0]
      const inputs = constraintsTable.querySelectorAll('input[type="text"]')

      // act - type predicates
      await user.type(inputs[0], 'RAID-5')
      await user.type(inputs[1], '> 1000')

      // assert - the constraint should be displayed in the pre element
      const preElement = screen.getByText(
        /IF \[Type\] = "RAID-5" THEN \[Size\] > 1000;/i,
      )
      expect(preElement).toBeInTheDocument()
    })
  })

  describe('OutputArea', () => {
    let user: any
    let pictRunner: PictRunner

    beforeEach(() => {
      vi.mock('../src/pict/pict-runner', () => {
        const PictRunner = vi.fn()
        PictRunner.prototype.init = vi.fn()
        PictRunner.prototype.run = vi.fn(() => ({
          header: ['Type', 'Size', 'Format method'],
          body: [
            ['Single', '10', 'Quick'],
            ['Span', '100', 'Slow'],
          ],
        }))

        return { PictRunner }
      })
      pictRunner = new PictRunner()
      user = userEvent.setup()
      render(<App />)
    })

    afterEach(() => {
      cleanup()
      vi.clearAllMocks()
    })

    it('Should display result table when input default value', async () => {
      // act - click the run button
      await user.click(screen.getByText('Run'))

      // assert - check result table
      expect(pictRunner.run).toHaveBeenCalledWith(
        [
          {
            id: expect.any(String),
            name: 'Type',
            values: 'Single, Span, Stripe, Mirror, RAID-5',
          },
          {
            id: expect.any(String),
            name: 'Size',
            values: '10, 100, 500, 1000, 5000, 10000, 40000',
          },
          {
            id: expect.any(String),
            name: 'Format method',
            values: 'Quick, Slow',
          },
          {
            id: expect.any(String),
            name: 'File system',
            values: 'FAT, FAT32, NTFS',
          },
          {
            id: expect.any(String),
            name: 'Cluster size',
            values: 'Quick, Slow',
          },
          { id: expect.any(String), name: 'Compression', values: 'ON, OFF' },
        ],
        expect.any(Array),
      )
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
        'Result',
      )
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: 'Type' }),
      ).toBeInTheDocument()
      expect(screen.getByRole('cell', { name: '100' })).toBeInTheDocument()
    })

    it('Should display result table when add empty row', async () => {
      // arrange - add empty row
      await user.click(screen.getByText('Add Row'))

      // act - click the run button
      await user.click(screen.getByText('Run'))

      // assert - check result table
      expect(pictRunner.run).toHaveBeenCalledWith(
        [
          {
            id: expect.any(String),
            name: 'Type',
            values: 'Single, Span, Stripe, Mirror, RAID-5',
          },
          {
            id: expect.any(String),
            name: 'Size',
            values: '10, 100, 500, 1000, 5000, 10000, 40000',
          },
          {
            id: expect.any(String),
            name: 'Format method',
            values: 'Quick, Slow',
          },
          {
            id: expect.any(String),
            name: 'File system',
            values: 'FAT, FAT32, NTFS',
          },
          {
            id: expect.any(String),
            name: 'Cluster size',
            values: 'Quick, Slow',
          },
          { id: expect.any(String), name: 'Compression', values: 'ON, OFF' },
          { id: expect.any(String), name: '', values: '' },
        ],
        expect.any(Array),
      )
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
        'Result',
      )
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: 'Type' }),
      ).toBeInTheDocument()
      expect(screen.getByRole('cell', { name: '100' })).toBeInTheDocument()
    })

    it('Should display result table when delete existing row', async () => {
      // arrange - delete existing row
      await user.click(screen.getByText('Remove Row'))

      // act - click the run button
      await user.click(screen.getByText('Run'))

      // assert - check result table
      expect(pictRunner.run).toHaveBeenCalledWith(
        [
          {
            id: expect.any(String),
            name: 'Type',
            values: 'Single, Span, Stripe, Mirror, RAID-5',
          },
          {
            id: expect.any(String),
            name: 'Size',
            values: '10, 100, 500, 1000, 5000, 10000, 40000',
          },
          {
            id: expect.any(String),
            name: 'Format method',
            values: 'Quick, Slow',
          },
          {
            id: expect.any(String),
            name: 'File system',
            values: 'FAT, FAT32, NTFS',
          },
          {
            id: expect.any(String),
            name: 'Cluster size',
            values: 'Quick, Slow',
          },
        ],
        expect.any(Array),
      )
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
        'Result',
      )
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: 'Type' }),
      ).toBeInTheDocument()
      expect(screen.getByRole('cell', { name: '100' })).toBeInTheDocument()
    })

    it('Should display result table when editing value', async () => {
      // arrange - edit existing value
      const input = screen.getAllByRole('textbox')[1]
      await user.clear(input)
      await user.type(input, 'Double, Span, Stripe, Mirror, RAID-5000')

      // act - click the run button
      await user.click(screen.getByText('Run'))

      // assert - check result table
      expect(pictRunner.run).toHaveBeenCalledWith(
        [
          {
            id: expect.any(String),
            name: 'Type',
            values: 'Double, Span, Stripe, Mirror, RAID-5000',
          },
          {
            id: expect.any(String),
            name: 'Size',
            values: '10, 100, 500, 1000, 5000, 10000, 40000',
          },
          {
            id: expect.any(String),
            name: 'Format method',
            values: 'Quick, Slow',
          },
          {
            id: expect.any(String),
            name: 'File system',
            values: 'FAT, FAT32, NTFS',
          },
          {
            id: expect.any(String),
            name: 'Cluster size',
            values: 'Quick, Slow',
          },
          { id: expect.any(String), name: 'Compression', values: 'ON, OFF' },
        ],
        expect.any(Array),
      )
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
        'Result',
      )
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: 'Type' }),
      ).toBeInTheDocument()
      expect(screen.getByRole('cell', { name: '100' })).toBeInTheDocument()
    })
  })
})

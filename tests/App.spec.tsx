/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import '@testing-library/jest-dom/vitest'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent, { UserEvent } from '@testing-library/user-event'
import { PictRunner } from '@takeyaqa/pict-browser'
import App from '../src/App'

describe('App', () => {
  describe('ParametersArea', () => {
    let user: UserEvent
    let pictRunnerMock: PictRunner

    beforeEach(() => {
      const PictRunnerMock = vi.fn()
      PictRunnerMock.prototype.init = vi.fn()
      PictRunnerMock.prototype.run = vi.fn()
      pictRunnerMock = new PictRunner()
      user = userEvent.setup()
      render(<App pictRunnerInjection={pictRunnerMock} />)
    })

    afterEach(() => {
      cleanup()
      vi.clearAllMocks()
    })

    it('Should display PictRider title and default parameter values', () => {
      // assert - only checking default text and values
      expect(
        screen.getAllByRole('textbox', { name: 'Parameters' }),
      ).toHaveLength(6)
      expect(screen.getAllByRole('textbox', { name: 'Values' })).toHaveLength(6)
      expect(
        screen.getAllByRole('textbox', { name: 'Parameters' })[0],
      ).toHaveValue('Type')
      expect(screen.getAllByRole('textbox', { name: 'Values' })[0]).toHaveValue(
        'Single, Span, Stripe, Mirror, RAID-5',
      )
      expect(
        screen.getAllByRole('textbox', { name: 'Parameters' })[5],
      ).toHaveValue('Compression')
      expect(screen.getAllByRole('textbox', { name: 'Values' })[5]).toHaveValue(
        'ON, OFF',
      )
    })

    it('Should add a new parameter row when clicking the add row button', async () => {
      // act
      await user.click(screen.getByText('Add Row'))

      // assert - check count and default values (new row should be empty)
      expect(
        screen.getAllByRole('textbox', { name: 'Parameters' }),
      ).toHaveLength(7)
      expect(screen.getAllByRole('textbox', { name: 'Values' })).toHaveLength(7)
      expect(
        screen.getAllByRole('textbox', { name: 'Parameters' })[0],
      ).toHaveValue('Type')
      expect(screen.getAllByRole('textbox', { name: 'Values' })[0]).toHaveValue(
        'Single, Span, Stripe, Mirror, RAID-5',
      )
      expect(
        screen.getAllByRole('textbox', { name: 'Parameters' })[5],
      ).toHaveValue('Compression')
      expect(screen.getAllByRole('textbox', { name: 'Values' })[5]).toHaveValue(
        'ON, OFF',
      )
      expect(
        screen.getAllByRole('textbox', { name: 'Parameters' })[6],
      ).toHaveValue('')
      expect(screen.getAllByRole('textbox', { name: 'Values' })[6]).toHaveValue(
        '',
      )
    })

    it('Should remove a parameter row when clicking the delete row button', async () => {
      // act
      await user.click(screen.getByText('Remove Row'))

      // assert - check count and default values
      expect(
        screen.getAllByRole('textbox', { name: 'Parameters' }),
      ).toHaveLength(5)
      expect(screen.getAllByRole('textbox', { name: 'Values' })).toHaveLength(5)
      expect(
        screen.getAllByRole('textbox', { name: 'Parameters' })[0],
      ).toHaveValue('Type')
      expect(screen.getAllByRole('textbox', { name: 'Values' })[0]).toHaveValue(
        'Single, Span, Stripe, Mirror, RAID-5',
      )
      expect(
        screen.getAllByRole('textbox', { name: 'Parameters' })[4],
      ).toHaveValue('Cluster size')
      expect(screen.getAllByRole('textbox', { name: 'Values' })[4]).toHaveValue(
        '512, 1024, 2048, 4096, 8192, 16384, 32768, 65536',
      )
    })

    it('Should disable delete row button when only one low', async () => {
      // act - delete rows until only one row is left
      await user.click(screen.getByRole('button', { name: 'Remove Row' }))
      await user.click(screen.getByRole('button', { name: 'Remove Row' }))
      await user.click(screen.getByRole('button', { name: 'Remove Row' }))
      await user.click(screen.getByRole('button', { name: 'Remove Row' }))
      await user.click(screen.getByRole('button', { name: 'Remove Row' }))

      // assert
      expect(screen.getByText('Remove Row')).toBeDisabled()
    })

    it('Should clear all parameter values when clicking the clear button', async () => {
      // act
      await user.click(screen.getByRole('button', { name: 'Clear' }))

      // assert - check count is not changed but values is empty
      expect(
        screen.getAllByRole('textbox', { name: 'Parameters' }),
      ).toHaveLength(6)
      expect(screen.getAllByRole('textbox', { name: 'Values' })).toHaveLength(6)
      expect(
        screen.getAllByRole('textbox', { name: 'Parameters' })[0],
      ).toHaveValue('')
      expect(screen.getAllByRole('textbox', { name: 'Values' })[0]).toHaveValue(
        '',
      )
      expect(
        screen.getAllByRole('textbox', { name: 'Parameters' })[5],
      ).toHaveValue('')
      expect(screen.getAllByRole('textbox', { name: 'Values' })[5]).toHaveValue(
        '',
      )
    })

    it('Should handle adding and removing multiple parameter rows', async () => {
      // Initial state - 12 textbox (6 parameter rows)
      expect(screen.getAllByRole('textbox')).toHaveLength(12)

      // Add 3 rows
      // act - add first row
      await user.click(screen.getByRole('button', { name: 'Add Row' }))
      // assert
      expect(screen.getAllByRole('textbox')).toHaveLength(14)

      // act - add second row
      await user.click(screen.getByRole('button', { name: 'Add Row' }))
      // assert
      expect(screen.getAllByRole('textbox')).toHaveLength(16)

      // act - add third row
      await user.click(screen.getByRole('button', { name: 'Add Row' }))
      // assert
      expect(screen.getAllByRole('textbox')).toHaveLength(18)

      // Now remove 2 rows
      // act - remove first row
      await user.click(screen.getByRole('button', { name: 'Remove Row' }))
      // assert
      expect(screen.getAllByRole('textbox')).toHaveLength(16)

      // act - remove second row
      await user.click(screen.getByRole('button', { name: 'Remove Row' }))
      // assert
      expect(screen.getAllByRole('textbox')).toHaveLength(14)

      // Verify we still have the correct values in the remaining textbox
      expect(
        screen.getAllByRole('textbox', { name: 'Parameters' })[0],
      ).toHaveValue('Type')
      expect(screen.getAllByRole('textbox', { name: 'Values' })[0]).toHaveValue(
        'Single, Span, Stripe, Mirror, RAID-5',
      )
      expect(
        screen.getAllByRole('textbox', { name: 'Parameters' })[6],
      ).toHaveValue('')
      expect(screen.getAllByRole('textbox', { name: 'Values' })[6]).toHaveValue(
        '',
      )
    })

    it('Should disable add row button when maximum row limit (50) is reached', async () => {
      // Initial state - 12 textbox (6 parameter rows)
      expect(screen.getAllByRole('textbox')).toHaveLength(12)

      // Add rows until we reach the limit (50 rows)
      // We already have 6 rows, so we need to add 44 more
      for (let i = 0; i < 44; i++) {
        await user.click(screen.getByRole('button', { name: 'Add Row' }))
      }

      // Verify we have 50 rows (100 textbox - 2 per row)
      expect(screen.getAllByRole('textbox')).toHaveLength(100)

      // Verify the Add Row button is disabled
      expect(screen.getByRole('button', { name: 'Add Row' })).toBeDisabled()
    })

    it('Should display error message when duplicate parameter names are found (single)', async () => {
      // act - edit parameter name to create a duplicate
      const nameInput = screen.getAllByRole('textbox', {
        name: 'Parameters',
      })[1]
      await user.clear(nameInput)
      await user.type(nameInput, 'Type') // Set to 'Type' which already exists

      // assert - check error message is displayed
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Parameter names must be unique.',
      )
      expect(screen.getByRole('button', { name: 'Run' })).toBeDisabled()

      // act - clear the error by changing the name
      await user.clear(nameInput)
      await user.type(nameInput, 'New Type')

      // assert - error message should be gone
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Run' })).toBeEnabled()
    })

    it('Should display error message when duplicate parameter names are found (double)', async () => {
      // act - edit parameter name to create a duplicate
      const nameInput0 = screen.getAllByRole('textbox', {
        name: 'Parameters',
      })[0]
      await user.clear(nameInput0)
      await user.type(nameInput0, 'Type')
      const nameInput1 = screen.getAllByRole('textbox', {
        name: 'Parameters',
      })[1]
      await user.clear(nameInput1)
      await user.type(nameInput1, 'Type')

      // assert - check error message is displayed
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Parameter names must be unique.',
      )
      expect(screen.getByRole('button', { name: 'Run' })).toBeDisabled()

      // act - edit parameter name to create a duplicate twice
      const nameInput2 = screen.getAllByRole('textbox', {
        name: 'Parameters',
      })[2]
      await user.clear(nameInput2)
      await user.type(nameInput2, 'Duplicate')
      const nameInput3 = screen.getAllByRole('textbox', {
        name: 'Parameters',
      })[3]
      await user.clear(nameInput3)
      await user.type(nameInput3, 'Duplicate')

      // assert - still error message is displayed
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Parameter names must be unique.',
      )
      expect(screen.getByRole('button', { name: 'Run' })).toBeDisabled()

      // act - edit first parameter name to clear a duplicate, but still have one
      await user.clear(nameInput0)

      // assert - still error message is displayed
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Parameter names must be unique.',
      )
      expect(screen.getByRole('button', { name: 'Run' })).toBeDisabled()

      // act - clear the error by changing the name
      await user.clear(nameInput3)

      // assert - error message should be gone (blank input is ignored)
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Run' })).toBeEnabled()
    })

    it('Should display error message when invalid character in parameter name', async () => {
      // act - edit parameter name to create invalid character
      const nameInput = screen.getAllByRole('textbox', {
        name: 'Parameters',
      })[0]
      await user.clear(nameInput)
      await user.type(nameInput, 'Ty#:()|,~{{}}@[[]]:=!+&*?pe')

      // assert - check error message is displayed
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Parameter name cannot contain special characters: "#", ":", "<", ">", "(", ")", "|", ",", "~", "{", "}", "@", "[", "]", ";", "=", "!", "+", "&", "*", "?"',
      )
      expect(screen.getByRole('button', { name: 'Run' })).toBeDisabled()

      // act - clear the error by changing the name
      await user.clear(nameInput)
      await user.type(nameInput, 'Type')

      // assert - error message should be gone
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Run' })).toBeEnabled()
    })

    it('Should display error message when invalid character in parameter values', async () => {
      // act - edit parameter name to create invalid character
      const nameInput = screen.getAllByRole('textbox', {
        name: 'Values',
      })[0]
      await user.clear(nameInput)
      await user.type(nameInput, 'Type, a#:,{{}}@[[]]=!+&*?')
      // assert - check error message is displayed
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Parameter values cannot contain special characters: "#", ":", "{", "}", "@", "[", "]", ";", "=", "!", "+", "&", "*", "?"',
      )
      expect(screen.getByRole('button', { name: 'Run' })).toBeDisabled()

      // act - clear the error by changing the name
      await user.clear(nameInput)
      await user.type(nameInput, 'Type, A | B, C(3), ~D')

      // assert - error message should be gone
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Run' })).toBeEnabled()
    })
  })

  describe('SubModelArea', () => {
    let user: UserEvent
    let pictRunnerMock: PictRunner

    beforeEach(() => {
      const PictRunnerMock = vi.fn()
      PictRunnerMock.prototype.init = vi.fn()
      PictRunnerMock.prototype.run = vi.fn()
      pictRunnerMock = new PictRunner()
      user = userEvent.setup()
      render(<App pictRunnerInjection={pictRunnerMock} />)
    })

    afterEach(() => {
      cleanup()
      vi.clearAllMocks()
    })

    it('Should not render sub-models area by default', () => {
      // assert - by default, sub-models area should not be visible
      expect(
        screen.queryByRole('heading', { name: 'Sub-Models' }),
      ).not.toBeInTheDocument()
    })

    it('Should render sub-models area when enabled', async () => {
      // act - enable sub-models area by clicking the checkbox
      await user.click(screen.getByRole('checkbox', { name: 'Sub-models' }))

      // assert - verify sub-models area is rendered
      expect(
        screen.queryByRole('heading', { level: 2, name: 'Sub-Models' }),
      ).toBeInTheDocument()
      expect(
        screen.queryByRole('heading', { level: 3, name: 'Parameters' }),
      ).toBeInTheDocument()
      expect(
        screen.queryByRole('spinbutton', { name: 'Order' }),
      ).toBeInTheDocument()
    })

    it('Should change sub-model name when parameter name is changed', async () => {
      // arrange - enable sub-models area
      await user.click(screen.getByRole('checkbox', { name: 'Sub-models' }))

      // act - change the name of the first parameter name
      const nameInput = screen.getAllByRole('textbox', {
        name: 'Parameters',
      })[0]
      await user.clear(nameInput)
      await user.type(nameInput, 'TypeTypeType')

      // assert - the sub-model name should be updated
      expect(
        screen.queryByRole('checkbox', { name: 'TypeTypeType' }),
      ).toBeInTheDocument()
    })
  })

  describe('ConstraintsArea', () => {
    let user: UserEvent
    let pictRunnerMock: PictRunner

    beforeEach(() => {
      const PictRunnerMock = vi.fn()
      PictRunnerMock.prototype.init = vi.fn()
      PictRunnerMock.prototype.run = vi.fn()
      pictRunnerMock = new PictRunnerMock()
      user = userEvent.setup()
      render(<App pictRunnerInjection={pictRunnerMock} />)
    })

    afterEach(() => {
      cleanup()
      vi.clearAllMocks()
    })

    it('Should not render constraints area by default', () => {
      // assert - by default, constraints area should not be visible
      expect(
        screen.queryByRole('button', { name: 'Add Constraint' }),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: 'Remove Constraint' }),
      ).not.toBeInTheDocument()
    })

    it('Should render constraints area when enabled', async () => {
      // act - enable constraints area by clicking the checkbox
      await user.click(screen.getByRole('checkbox', { name: 'Constraints' }))

      // assert - verify constraints area is rendered
      expect(
        screen.getByRole('button', { name: 'Add Constraint' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Remove Constraint' }),
      ).toBeInTheDocument()
      expect(screen.getByText('Parameter')).toBeInTheDocument() // One in parameters area, one in constraints area
      expect(screen.getByText('Constraint 1')).toBeInTheDocument()
      expect(screen.getAllByRole('button', { name: 'if' })).toHaveLength(6) // Default app has 6 parameters, so we should have 6 'if' buttons
    })

    it('Should add a new constraint when add constraint button is clicked', async () => {
      // arrange -  enable constraints area
      await user.click(screen.getByRole('checkbox', { name: 'Constraints' }))

      // assume - initially there should be one constraint
      expect(screen.getByText('Constraint 1')).toBeInTheDocument()
      expect(screen.queryByText('Constraint 2')).not.toBeInTheDocument()

      // act - add a new constraint
      await user.click(screen.getByRole('button', { name: 'Add Constraint' }))

      // assert - now there should be two constraints
      expect(screen.getByText('Constraint 1')).toBeInTheDocument()
      expect(screen.getByText('Constraint 2')).toBeInTheDocument()
      expect(screen.getAllByRole('button', { name: 'if' })).toHaveLength(12) // With 6 parameters and 2 constraints, we should have 12 'if' buttons
    })

    it('Should remove a constraint when remove constraint button is clicked', async () => {
      // arrange - enable constraints area and add a constraint so we have two
      await user.click(screen.getByRole('checkbox', { name: 'Constraints' }))
      await user.click(screen.getByRole('button', { name: 'Add Constraint' }))

      // assume - there should be two constraints
      expect(screen.getByText('Constraint 2')).toBeInTheDocument()

      // assert - remove constraint button should be enabled
      expect(
        screen.getByRole('button', { name: 'Remove Constraint' }),
      ).toBeEnabled()

      // act - remove a constraint
      await user.click(
        screen.getByRole('button', { name: 'Remove Constraint' }),
      )

      // assert - now there should be only one constraint
      expect(screen.getByText('Constraint 1')).toBeInTheDocument()
      expect(screen.queryByText('Constraint 2')).not.toBeInTheDocument()
      expect(screen.getAllByRole('button', { name: 'if' })).toHaveLength(6) // With 6 parameters and 1 constraint, we should have 6 'if' buttons
    })

    it('Should disable remove constraint button when only one constraint exists', async () => {
      // act - enable constraints area
      await user.click(screen.getByRole('checkbox', { name: 'Constraints' }))

      // assert - by default there's only one constraint, so remove button should be disabled
      expect(
        screen.getByRole('button', { name: 'Remove Constraint' }),
      ).toBeDisabled()

      // act - add a constraint
      await user.click(screen.getByRole('button', { name: 'Add Constraint' }))

      // assert - now remove button should be enabled
      expect(
        screen.getByRole('button', { name: 'Remove Constraint' }),
      ).toBeEnabled()

      // act - remove the constraint
      await user.click(
        screen.getByRole('button', { name: 'Remove Constraint' }),
      )

      // assert - remove button should be disabled again
      expect(
        screen.getByRole('button', { name: 'Remove Constraint' }),
      ).toBeDisabled()
    })

    it('Should disable add constraint button when maximum constraint limit (50) is reached', async () => {
      // arrange - enable constraints area
      await user.click(screen.getByRole('checkbox', { name: 'Constraints' }))

      // Initial state - should have 1 constraint
      expect(screen.getByText('Constraint 1')).toBeInTheDocument()
      expect(screen.queryByText('Constraint 50')).not.toBeInTheDocument()

      // Add constraints until we reach the limit (50)
      // We already have 1 constraint, so we need to add 49 more
      for (let i = 0; i < 49; i++) {
        await user.click(screen.getByRole('button', { name: 'Add Constraint' }))
      }

      // Verify we have 50 constraints
      expect(screen.getByText('Constraint 50')).toBeInTheDocument()

      // Verify the Add Constraint button is disabled
      expect(
        screen.getByRole('button', { name: 'Add Constraint' }),
      ).toBeDisabled()
    })

    it('Should toggle condition between if and then when clicked', async () => {
      // arrange - enable constraints area
      await user.click(screen.getByRole('checkbox', { name: 'Constraints' }))
      const firstIfButton = screen.getAllByRole('button', { name: 'if' })[0] // Get the first 'if' button

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
      await user.click(screen.getByRole('checkbox', { name: 'Constraints' }))

      // get the second 'if' button (for Size parameter) and change it to 'then'
      const ifButtons = screen.getAllByRole('button', { name: 'if' })
      await user.click(ifButtons[1])

      // find all inputs in the constraints area
      const constraintsTable = screen.getByRole('table', {
        name: 'Constraints',
      })
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

    it('Should display alert when input is includes error', async () => {
      // arrange - enable constraints area
      await user.click(screen.getByRole('checkbox', { name: 'Constraints' }))

      // get the second 'if' button (for Size parameter) and change it to 'then'
      const ifButtons = screen.getAllByRole('button', { name: 'if' })
      await user.click(ifButtons[1])

      // find all inputs in the constraints area
      const constraintsTable = screen.getByRole('table', {
        name: 'Constraints',
      })
      const inputs = constraintsTable.querySelectorAll('input[type="text"]')

      // act - type predicates in both inputs

      await user.type(inputs[0], '@')
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Constraints cannot contain special characters: ":", "(", ")", "|", "~", "{", "}", "@", "[", "]", ";',
      )
      expect(screen.getByRole('button', { name: 'Run' })).toBeDisabled()

      // act - clear the error by changing the name
      await user.clear(inputs[0])
      await user.type(inputs[0], '<= 1000')

      // assert - error message should be gone
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Run' })).toBeEnabled()
    })

    it('Should display complex constraints with if/then conditions', async () => {
      // arrange - enable constraints area
      await user.click(screen.getByRole('checkbox', { name: 'Constraints' }))

      // get the second 'if' button
      const ifButtons = screen.getAllByRole('button', { name: 'if' })
      const secondIfButton = ifButtons[1]

      // change the second to 'then'
      await user.click(secondIfButton)

      // find all inputs in the constraints area
      const constraintsTable = screen.getByRole('table', {
        name: 'Constraints',
      })
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

    it('Should change constraints when edit parameter name', async () => {
      // arrange - enable constraints area
      await user.click(screen.getByRole('checkbox', { name: 'Constraints' }))

      // get the second 'if' button
      const ifButtons = screen.getAllByRole('button', { name: 'if' })
      const secondIfButton = ifButtons[1]

      // change the second to 'then'
      await user.click(secondIfButton)

      // find all inputs in the constraints area
      const constraintsTable = screen.getByRole('table', {
        name: 'Constraints',
      })
      const inputs = constraintsTable.querySelectorAll('input[type="text"]')

      // act - type predicates
      await user.type(inputs[0], 'RAID-5')
      await user.type(inputs[1], '> 1000')

      // assert - the constraint should be displayed in the pre element
      const constraintsCell = constraintsTable.querySelector('td')
      expect(constraintsCell).toHaveTextContent('Type')
      const beforePreElement = screen.getByText(
        /IF \[Type\] = "RAID-5" THEN \[Size\] > 1000;/i,
      )
      expect(beforePreElement).toBeInTheDocument()

      // act - edit parameter values
      const parameterInput = screen.getAllByRole('textbox', {
        name: 'Parameters',
      })[0]
      await user.clear(parameterInput)
      await user.type(parameterInput, 'New Type')

      // assert - the constraint should be displayed in the pre element
      expect(constraintsCell).toHaveTextContent('New Type')
      const afterPreElement = screen.getByText(
        /IF \[New Type\] = "RAID-5" THEN \[Size\] > 1000;/i,
      )
      expect(afterPreElement).toBeInTheDocument()
    })

    it('Should change direct edit mode when click button', async () => {
      // arrange
      await user.click(screen.getByRole('checkbox', { name: 'Constraints' }))

      // act
      await user.click(screen.getByRole('button', { name: 'Edit Directly' }))

      // assert
      expect(
        screen.getByRole('textbox', { name: 'Constraint Formula' }),
      ).toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: 'Add Constraint' }),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: 'Remove Constraint' }),
      ).not.toBeInTheDocument()
    })
  })

  describe('Run Pict', () => {
    let user: UserEvent
    let pictRunnerMock: PictRunner

    beforeEach(() => {
      const PictRunnerMock = vi.fn()
      PictRunnerMock.prototype.init = vi.fn()
      PictRunnerMock.prototype.run = vi.fn(() => ({
        header: ['Type', 'Size', 'Format method'],
        body: [
          ['Single', '10', 'Quick'],
          ['Span', '100', 'Slow'],
        ],
      }))
      pictRunnerMock = new PictRunnerMock()
      user = userEvent.setup()
      render(<App pictRunnerInjection={pictRunnerMock} />)
    })

    afterEach(() => {
      cleanup()
      vi.clearAllMocks()
    })

    it('Should display result table', async () => {
      // act - click the run button
      await user.click(screen.getByRole('button', { name: 'Run' }))

      // assert - check result table
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.getByRole('table', { name: 'Result' })).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: 'Type' }),
      ).toBeInTheDocument()
      expect(screen.getByRole('cell', { name: '100' })).toBeInTheDocument()

      // Check that the CSV and TSV buttons are present
      expect(screen.getByRole('button', { name: 'CSV' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'TSV' })).toBeInTheDocument()
    })

    it('Should have CSV and TSV buttons that are enabled after running PICT', async () => {
      // Run PICT to get results
      await user.click(screen.getByRole('button', { name: 'Run' }))

      // Get the CSV button and verify it exists and is enabled
      const csvButton = screen.getByRole('button', { name: 'CSV' })
      expect(csvButton).toBeInTheDocument()
      expect(csvButton).not.toBeDisabled()

      // Get the TSV button and verify it exists and is enabled
      const tsvButton = screen.getByRole('button', { name: 'TSV' })
      expect(tsvButton).toBeInTheDocument()
      expect(tsvButton).not.toBeDisabled()
    })

    it('Should clear results when clicking the Clear Result button', async () => {
      // Run PICT to get results
      await user.click(screen.getByRole('button', { name: 'Run' }))

      // Verify result table is displayed
      expect(screen.getByRole('table', { name: 'Result' })).toBeInTheDocument()

      // Click the Clear Result button
      await user.click(screen.getByRole('button', { name: 'Clear Result' }))

      // Verify result table is no longer displayed
      expect(
        screen.queryByRole('table', { name: 'Result' }),
      ).not.toBeInTheDocument()
    })

    it('Should call with parameters when input default value', async () => {
      // act - click the run button
      await user.click(screen.getByRole('button', { name: 'Run' }))

      // assert - check result table
      expect(pictRunnerMock.run).toHaveBeenCalledWith(
        [
          {
            name: 'Type',
            values: 'Single, Span, Stripe, Mirror, RAID-5',
          },
          {
            name: 'Size',
            values: '10, 100, 500, 1000, 5000, 10000, 40000',
          },
          {
            name: 'Format method',
            values: 'Quick, Slow',
          },
          {
            name: 'File system',
            values: 'FAT, FAT32, NTFS',
          },
          {
            name: 'Cluster size',
            values: '512, 1024, 2048, 4096, 8192, 16384, 32768, 65536',
          },
          { name: 'Compression', values: 'ON, OFF' },
        ],
        expect.anything(),
      )
    })

    it('Should call with parameters when add empty row', async () => {
      // arrange - add empty row
      await user.click(screen.getByRole('button', { name: 'Add Row' }))

      // act - click the run button
      await user.click(screen.getByRole('button', { name: 'Run' }))

      // assert - check result table
      expect(pictRunnerMock.run).toHaveBeenCalledWith(
        [
          {
            name: 'Type',
            values: 'Single, Span, Stripe, Mirror, RAID-5',
          },
          {
            name: 'Size',
            values: '10, 100, 500, 1000, 5000, 10000, 40000',
          },
          {
            name: 'Format method',
            values: 'Quick, Slow',
          },
          {
            name: 'File system',
            values: 'FAT, FAT32, NTFS',
          },
          {
            name: 'Cluster size',
            values: '512, 1024, 2048, 4096, 8192, 16384, 32768, 65536',
          },
          { name: 'Compression', values: 'ON, OFF' },
          // empty row is ignored
        ],
        expect.anything(),
      )
    })

    it('Should call with parameters when delete existing row', async () => {
      // arrange - delete existing row
      await user.click(screen.getByRole('button', { name: 'Remove Row' }))

      // act - click the run button
      await user.click(screen.getByRole('button', { name: 'Run' }))

      // assert - check result table
      expect(pictRunnerMock.run).toHaveBeenCalledWith(
        [
          {
            name: 'Type',
            values: 'Single, Span, Stripe, Mirror, RAID-5',
          },
          {
            name: 'Size',
            values: '10, 100, 500, 1000, 5000, 10000, 40000',
          },
          {
            name: 'Format method',
            values: 'Quick, Slow',
          },
          {
            name: 'File system',
            values: 'FAT, FAT32, NTFS',
          },
          {
            name: 'Cluster size',
            values: '512, 1024, 2048, 4096, 8192, 16384, 32768, 65536',
          },
        ],
        expect.anything(),
      )
    })

    it('Should call with parameters when editing value', async () => {
      // arrange - edit existing value
      const input = screen.getAllByRole('textbox', { name: 'Values' })[0]
      await user.clear(input)
      await user.type(input, 'Double, Span, Stripe, Mirror, RAID-5000')

      // act - click the run button
      await user.click(screen.getByRole('button', { name: 'Run' }))

      // assert - check result table
      expect(pictRunnerMock.run).toHaveBeenCalledWith(
        [
          {
            name: 'Type',
            values: 'Double, Span, Stripe, Mirror, RAID-5000',
          },
          {
            name: 'Size',
            values: '10, 100, 500, 1000, 5000, 10000, 40000',
          },
          {
            name: 'Format method',
            values: 'Quick, Slow',
          },
          {
            name: 'File system',
            values: 'FAT, FAT32, NTFS',
          },
          {
            name: 'Cluster size',
            values: '512, 1024, 2048, 4096, 8192, 16384, 32768, 65536',
          },
          { name: 'Compression', values: 'ON, OFF' },
        ],
        expect.anything(),
      )
    })

    it('Should call with parameters when editing parameter to empty', async () => {
      // arrange - edit existing value
      const input = screen.getAllByRole('textbox', { name: 'Parameters' })[1]
      await user.clear(input)

      // act - click the run button
      await user.click(screen.getByRole('button', { name: 'Run' }))

      // assert - check result table
      expect(pictRunnerMock.run).toHaveBeenCalledWith(
        [
          {
            name: 'Type',
            values: 'Single, Span, Stripe, Mirror, RAID-5',
          },
          // empty parameter is ignored
          {
            name: 'Format method',
            values: 'Quick, Slow',
          },
          {
            name: 'File system',
            values: 'FAT, FAT32, NTFS',
          },
          {
            name: 'Cluster size',
            values: '512, 1024, 2048, 4096, 8192, 16384, 32768, 65536',
          },
          { name: 'Compression', values: 'ON, OFF' },
        ],
        expect.anything(),
      )
    })

    it('Should call with parameters when editing values to empty', async () => {
      // arrange - edit existing value
      const input = screen.getAllByRole('textbox', { name: 'Values' })[2]
      await user.clear(input)

      // act - click the run button
      await user.click(screen.getByRole('button', { name: 'Run' }))

      // assert - check result table
      expect(pictRunnerMock.run).toHaveBeenCalledWith(
        [
          {
            name: 'Type',
            values: 'Single, Span, Stripe, Mirror, RAID-5',
          },
          {
            name: 'Size',
            values: '10, 100, 500, 1000, 5000, 10000, 40000',
          },
          // empty values is ignored
          {
            name: 'File system',
            values: 'FAT, FAT32, NTFS',
          },
          {
            name: 'Cluster size',
            values: '512, 1024, 2048, 4096, 8192, 16384, 32768, 65536',
          },
          { name: 'Compression', values: 'ON, OFF' },
        ],
        expect.anything(),
      )
    })

    it('Should call with sub-models when enable sub-models', async () => {
      // arrange - enable sub-models
      await user.click(screen.getByRole('checkbox', { name: 'Sub-models' }))
      await user.click(screen.getByRole('checkbox', { name: 'Type' }))
      await user.click(screen.getByRole('checkbox', { name: 'Size' }))
      await user.click(screen.getByRole('checkbox', { name: 'Format method' }))
      await user.clear(screen.getByRole('spinbutton', { name: 'Order' }))
      await user.type(screen.getByRole('spinbutton', { name: 'Order' }), '3')

      // act - click the run button
      await user.click(screen.getByRole('button', { name: 'Run' }))

      // assert - check result table
      expect(pictRunnerMock.run).toHaveBeenCalledWith(
        [
          {
            name: 'Type',
            values: 'Single, Span, Stripe, Mirror, RAID-5',
          },
          {
            name: 'Size',
            values: '10, 100, 500, 1000, 5000, 10000, 40000',
          },
          {
            name: 'Format method',
            values: 'Quick, Slow',
          },
          {
            name: 'File system',
            values: 'FAT, FAT32, NTFS',
          },
          {
            name: 'Cluster size',
            values: '512, 1024, 2048, 4096, 8192, 16384, 32768, 65536',
          },
          { name: 'Compression', values: 'ON, OFF' },
        ],
        {
          subModels: [
            {
              parameterNames: ['Type', 'Size', 'Format method'],
              order: 3,
            },
          ],
          options: expect.anything(),
        },
      )
    })

    it('Should call with sub-models when enable sub-models and delete parameter rows', async () => {
      // arrange - enable sub-models
      await user.click(screen.getByRole('checkbox', { name: 'Sub-models' }))
      await user.click(screen.getByRole('checkbox', { name: 'Type' }))
      await user.click(screen.getByRole('checkbox', { name: 'Size' }))
      await user.click(screen.getByRole('checkbox', { name: 'Format method' }))

      await user.clear(screen.getByRole('spinbutton', { name: 'Order' }))
      await user.type(screen.getByRole('spinbutton', { name: 'Order' }), '3')

      // act - click the run button
      await user.click(screen.getByRole('button', { name: 'Remove Row' }))
      await user.click(screen.getByRole('button', { name: 'Run' }))

      // assert - check result table
      expect(pictRunnerMock.run).toHaveBeenCalledWith(
        [
          {
            name: 'Type',
            values: 'Single, Span, Stripe, Mirror, RAID-5',
          },
          {
            name: 'Size',
            values: '10, 100, 500, 1000, 5000, 10000, 40000',
          },
          {
            name: 'Format method',
            values: 'Quick, Slow',
          },
          {
            name: 'File system',
            values: 'FAT, FAT32, NTFS',
          },
          {
            name: 'Cluster size',
            values: '512, 1024, 2048, 4096, 8192, 16384, 32768, 65536',
          },
        ],
        {
          subModels: [
            {
              parameterNames: ['Type', 'Size', 'Format method'],
              order: 3,
            },
          ],
          options: expect.anything(),
        },
      )
    })

    it('Should call with constraints when constraints direct editing mode', async () => {
      // arrange
      await user.click(screen.getByRole('checkbox', { name: 'Constraints' }))
      await user.click(screen.getByRole('button', { name: 'Edit Directly' }))

      // act
      await user.type(
        screen.getByRole('textbox', { name: 'Constraint Formula' }),
        'IF [[Type] = "RAID-5" THEN [[Size] > 1000;',
      )
      await user.click(screen.getByRole('button', { name: 'Run' }))

      // assert
      expect(pictRunnerMock.run).toHaveBeenCalledWith(
        [
          {
            name: 'Type',
            values: 'Single, Span, Stripe, Mirror, RAID-5',
          },
          {
            name: 'Size',
            values: '10, 100, 500, 1000, 5000, 10000, 40000',
          },
          {
            name: 'Format method',
            values: 'Quick, Slow',
          },
          {
            name: 'File system',
            values: 'FAT, FAT32, NTFS',
          },
          {
            name: 'Cluster size',
            values: '512, 1024, 2048, 4096, 8192, 16384, 32768, 65536',
          },
          { name: 'Compression', values: 'ON, OFF' },
        ],
        {
          constraintsText: 'IF [Type] = "RAID-5" THEN [Size] > 1000;',
          subModels: undefined,
          options: expect.anything(),
        },
      )
    })
  })
})

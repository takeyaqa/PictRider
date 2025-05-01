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
      pictRunnerMock = new PictRunnerMock()
      const ResizeObserverMock = vi.fn()
      ResizeObserverMock.prototype.disconnect = vi.fn()
      ResizeObserverMock.prototype.observe = vi.fn()
      ResizeObserverMock.prototype.unobserve = vi.fn()
      global.ResizeObserver = ResizeObserverMock
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
        screen.getAllByRole('textbox', { name: /Parameter [0-9]+ Name/ }),
      ).toHaveLength(6)
      expect(
        screen.getAllByRole('textbox', { name: /Parameter [0-9]+ Values/ }),
      ).toHaveLength(6)
      expect(
        screen.getByRole('textbox', { name: 'Parameter 1 Name' }),
      ).toHaveValue('Type')
      expect(
        screen.getByRole('textbox', { name: 'Parameter 1 Values' }),
      ).toHaveValue('Single, Span, Stripe, Mirror, RAID-5')
      expect(
        screen.getByRole('textbox', { name: 'Parameter 6 Name' }),
      ).toHaveValue('Compression')
      expect(
        screen.getByRole('textbox', { name: 'Parameter 6 Values' }),
      ).toHaveValue('ON, OFF')
    })

    it('Should add a new parameter row when clicking the add row button', async () => {
      // act
      await user.click(
        screen.getByRole('button', { name: 'Parameter 6 Edit Menu' }),
      )
      await user.click(screen.getByRole('menuitem', { name: 'Insert Below' }))

      // assert - check count and default values (new row should be empty)
      expect(
        screen.getAllByRole('textbox', { name: /Parameter [0-9]+ Name/ }),
      ).toHaveLength(7)
      expect(
        screen.getAllByRole('textbox', { name: /Parameter [0-9]+ Values/ }),
      ).toHaveLength(7)
      expect(
        screen.getByRole('textbox', { name: 'Parameter 1 Name' }),
      ).toHaveValue('Type')
      expect(
        screen.getByRole('textbox', { name: 'Parameter 1 Values' }),
      ).toHaveValue('Single, Span, Stripe, Mirror, RAID-5')
      expect(
        screen.getByRole('textbox', { name: 'Parameter 6 Name' }),
      ).toHaveValue('Compression')
      expect(
        screen.getByRole('textbox', { name: 'Parameter 6 Values' }),
      ).toHaveValue('ON, OFF')
      expect(
        screen.getByRole('textbox', { name: 'Parameter 7 Name' }),
      ).toHaveValue('')
      expect(
        screen.getByRole('textbox', { name: 'Parameter 7 Values' }),
      ).toHaveValue('')
    })

    it('Should remove a parameter row when clicking the delete row button', async () => {
      // act
      await user.click(
        screen.getByRole('button', { name: 'Parameter 6 Edit Menu' }),
      )
      await user.click(screen.getByRole('menuitem', { name: 'Delete Row' }))

      // assert - check count and default values
      expect(
        screen.getAllByRole('textbox', { name: /Parameter [0-9]+ Name/ }),
      ).toHaveLength(5)
      expect(
        screen.getAllByRole('textbox', { name: /Parameter [0-9]+ Values/ }),
      ).toHaveLength(5)
      expect(
        screen.getByRole('textbox', { name: 'Parameter 1 Name' }),
      ).toHaveValue('Type')
      expect(
        screen.getByRole('textbox', { name: 'Parameter 1 Values' }),
      ).toHaveValue('Single, Span, Stripe, Mirror, RAID-5')
      expect(
        screen.getByRole('textbox', { name: 'Parameter 5 Name' }),
      ).toHaveValue('Cluster size')
      expect(
        screen.getByRole('textbox', { name: 'Parameter 5 Values' }),
      ).toHaveValue('512, 1024, 2048, 4096, 8192, 16384, 32768, 65536')
    })

    it('Should disable delete row button when only one low', async () => {
      // act - delete rows until only one row is left
      await user.click(
        screen.getByRole('button', { name: 'Parameter 1 Edit Menu' }),
      )
      await user.click(screen.getByRole('menuitem', { name: 'Delete Row' }))
      await user.click(
        screen.getByRole('button', { name: 'Parameter 1 Edit Menu' }),
      )
      await user.click(screen.getByRole('menuitem', { name: 'Delete Row' }))
      await user.click(
        screen.getByRole('button', { name: 'Parameter 1 Edit Menu' }),
      )
      await user.click(screen.getByRole('menuitem', { name: 'Delete Row' }))
      await user.click(
        screen.getByRole('button', { name: 'Parameter 1 Edit Menu' }),
      )
      await user.click(screen.getByRole('menuitem', { name: 'Delete Row' }))
      await user.click(
        screen.getByRole('button', { name: 'Parameter 1 Edit Menu' }),
      )
      await user.click(screen.getByRole('menuitem', { name: 'Delete Row' }))

      // assert
      await user.click(
        screen.getByRole('button', { name: 'Parameter 1 Edit Menu' }),
      )
      expect(
        screen.getByRole('menuitem', { name: 'Delete Row' }),
      ).toBeDisabled()
    })

    it('Should clear all parameter values when clicking the clear button', async () => {
      // act
      await user.click(screen.getByRole('button', { name: 'Clear Input' }))

      // assert - check count is not changed but values is empty
      expect(
        screen.getAllByRole('textbox', { name: /Parameter [0-9]+ Name/ }),
      ).toHaveLength(6)
      expect(
        screen.getAllByRole('textbox', { name: /Parameter [0-9]+ Values/ }),
      ).toHaveLength(6)
      expect(
        screen.getByRole('textbox', { name: 'Parameter 1 Name' }),
      ).toHaveValue('')
      expect(
        screen.getByRole('textbox', { name: 'Parameter 1 Values' }),
      ).toHaveValue('')
      expect(
        screen.getByRole('textbox', { name: 'Parameter 6 Name' }),
      ).toHaveValue('')
      expect(
        screen.getByRole('textbox', { name: 'Parameter 6 Values' }),
      ).toHaveValue('')
    })

    it('Should handle adding and removing multiple parameter rows', async () => {
      // Initial state - 6 parameter rows
      expect(
        screen.getAllByRole('textbox', { name: /Parameter [0-9]+ Name/ }),
      ).toHaveLength(6)

      // Add 3 rows
      // act - add first row
      await user.click(
        screen.getByRole('button', { name: 'Parameter 1 Edit Menu' }),
      )
      await user.click(screen.getByRole('menuitem', { name: 'Insert Below' }))
      // assert
      expect(
        screen.getAllByRole('textbox', { name: /Parameter [0-9]+ Name/ }),
      ).toHaveLength(7)

      // act - add second row
      await user.click(
        screen.getByRole('button', { name: 'Parameter 3 Edit Menu' }),
      )
      await user.click(screen.getByRole('menuitem', { name: 'Insert Above' }))
      // assert
      expect(
        screen.getAllByRole('textbox', { name: /Parameter [0-9]+ Name/ }),
      ).toHaveLength(8)

      // act - add third row
      await user.click(
        screen.getByRole('button', { name: 'Parameter 5 Edit Menu' }),
      )
      await user.click(screen.getByRole('menuitem', { name: 'Insert Below' }))
      // assert
      expect(
        screen.getAllByRole('textbox', { name: /Parameter [0-9]+ Name/ }),
      ).toHaveLength(9)

      // Now remove 2 rows
      // act - remove first row
      await user.click(
        screen.getByRole('button', { name: 'Parameter 5 Edit Menu' }),
      )
      await user.click(screen.getByRole('menuitem', { name: 'Delete Row' }))
      // assert
      expect(
        screen.getAllByRole('textbox', { name: /Parameter [0-9]+ Name/ }),
      ).toHaveLength(8)

      // act - remove second row
      await user.click(
        screen.getByRole('button', { name: 'Parameter 7 Edit Menu' }),
      )
      await user.click(screen.getByRole('menuitem', { name: 'Delete Row' }))
      // assert
      expect(
        screen.getAllByRole('textbox', { name: /Parameter [0-9]+ Name/ }),
      ).toHaveLength(7)

      // Verify we still have the correct values in the remaining textbox
      expect(
        screen.getByRole('textbox', { name: 'Parameter 1 Name' }),
      ).toHaveValue('Type')
      expect(
        screen.getByRole('textbox', { name: 'Parameter 2 Name' }),
      ).toHaveValue('')
      expect(
        screen.getByRole('textbox', { name: 'Parameter 3 Name' }),
      ).toHaveValue('')
      expect(
        screen.getByRole('textbox', { name: 'Parameter 4 Name' }),
      ).toHaveValue('Size')
      expect(
        screen.getByRole('textbox', { name: 'Parameter 5 Name' }),
      ).toHaveValue('')
      expect(
        screen.getByRole('textbox', { name: 'Parameter 6 Name' }),
      ).toHaveValue('File system')
      expect(
        screen.getByRole('textbox', { name: 'Parameter 7 Name' }),
      ).toHaveValue('Compression')
    })

    it('Should disable add row button when maximum row limit (50) is reached', async () => {
      // Initial state - 6 parameter rows
      expect(
        screen.getAllByRole('textbox', { name: /Parameter [0-9]+ Name/ }),
      ).toHaveLength(6)

      // Add rows until we reach the limit (50 rows)
      // We already have 6 rows, so we need to add 44 more
      for (let i = 0; i < 44; i++) {
        await user.click(
          screen.getByRole('button', { name: 'Parameter 1 Edit Menu' }),
        )
        await user.click(screen.getByRole('menuitem', { name: 'Insert Above' }))
      }

      // Verify we have 50 rows
      expect(
        screen.getAllByRole('textbox', { name: /Parameter [0-9]+ Name/ }),
      ).toHaveLength(50)

      // Verify the Add Row button is disabled
      await user.click(
        screen.getByRole('button', { name: 'Parameter 1 Edit Menu' }),
      )
      expect(
        screen.getByRole('menuitem', { name: 'Insert Above' }),
      ).toBeDisabled()
    })

    it('Should display error message when duplicate parameter names are found (single)', async () => {
      // act - edit parameter name to create a duplicate
      const nameInput = screen.getByRole('textbox', {
        name: 'Parameter 2 Name',
      })
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
      const nameInput1 = screen.getByRole('textbox', {
        name: 'Parameter 1 Name',
      })
      await user.clear(nameInput1)
      await user.type(nameInput1, 'Type')
      const nameInput2 = screen.getByRole('textbox', {
        name: 'Parameter 2 Name',
      })
      await user.clear(nameInput2)
      await user.type(nameInput2, 'Type')

      // assert - check error message is displayed
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Parameter names must be unique.',
      )
      expect(screen.getByRole('button', { name: 'Run' })).toBeDisabled()

      // act - edit parameter name to create a duplicate twice
      const nameInput3 = screen.getByRole('textbox', {
        name: 'Parameter 3 Name',
      })
      await user.clear(nameInput3)
      await user.type(nameInput3, 'Duplicate')
      const nameInput4 = screen.getByRole('textbox', {
        name: 'Parameter 4 Name',
      })
      await user.clear(nameInput4)
      await user.type(nameInput4, 'Duplicate')

      // assert - still error message is displayed
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Parameter names must be unique.',
      )
      expect(screen.getByRole('button', { name: 'Run' })).toBeDisabled()

      // act - edit first parameter name to clear a duplicate, but still have one
      await user.clear(nameInput1)

      // assert - still error message is displayed
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Parameter names must be unique.',
      )
      expect(screen.getByRole('button', { name: 'Run' })).toBeDisabled()

      // act - clear the error by changing the name
      await user.clear(nameInput4)

      // assert - error message should be gone (blank input is ignored)
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Run' })).toBeEnabled()
    })

    it('Should display error message when invalid character in parameter name', async () => {
      // act - edit parameter name to create invalid character
      const nameInput = screen.getByRole('textbox', {
        name: 'Parameter 1 Name',
      })
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
      const nameInput = screen.getByRole('textbox', {
        name: 'Parameter 1 Values',
      })
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
      pictRunnerMock = new PictRunnerMock()
      const ResizeObserverMock = vi.fn()
      ResizeObserverMock.prototype.disconnect = vi.fn()
      ResizeObserverMock.prototype.observe = vi.fn()
      ResizeObserverMock.prototype.unobserve = vi.fn()
      global.ResizeObserver = ResizeObserverMock
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
        screen.queryByRole('switch', { name: 'Enable Sub-Models' }),
      ).not.toBeChecked()
    })

    it('Should render sub-models area when enabled', async () => {
      // act - enable sub-models area by clicking the checkbox
      await user.click(
        screen.getByRole('switch', { name: 'Enable Sub-Models' }),
      )

      // assert - verify sub-models area is rendered
      expect(
        screen.queryByRole('heading', { level: 2, name: 'Sub-Models' }),
      ).toBeInTheDocument()
      expect(screen.queryByText('Sub-Model 1')).toBeInTheDocument()
      expect(
        screen.queryAllByRole('spinbutton', { name: 'Order' }),
      ).toHaveLength(1)
    })

    it('Should change sub-model name when parameter name is changed', async () => {
      // arrange - enable sub-models area
      await user.click(
        screen.getByRole('switch', { name: 'Enable Sub-Models' }),
      )

      // act - change the name of the first parameter name
      const nameInput = screen.getByRole('textbox', {
        name: 'Parameter 1 Name',
      })
      await user.clear(nameInput)
      await user.type(nameInput, 'TypeTypeType')

      // assert - the sub-model name should be updated
      expect(
        screen.queryAllByRole('checkbox', { name: 'TypeTypeType' }),
      ).toHaveLength(1)
    })

    it('Should add and remove a new sub-model when add/remove sub-model button is clicked', async () => {
      // arrange - enable sub-models area
      await user.click(
        screen.getByRole('switch', { name: 'Enable Sub-Models' }),
      )

      // act - add a new sub-model
      await user.click(screen.getByRole('button', { name: 'Add Sub-Model' }))

      // assert - now there should be two sub-models
      expect(screen.queryByText('Sub-Model 1')).toBeInTheDocument()
      expect(screen.queryByText('Sub-Model 2')).toBeInTheDocument()

      // act - remove a new sub-model
      await user.click(screen.getByRole('button', { name: 'Remove Sub-Model' }))

      // assert - now there should be one sub-model
      expect(screen.queryByText('Sub-Model 1')).toBeInTheDocument()
      expect(screen.queryByText('Sub-Model 2')).not.toBeInTheDocument()
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
      const ResizeObserverMock = vi.fn()
      ResizeObserverMock.prototype.disconnect = vi.fn()
      ResizeObserverMock.prototype.observe = vi.fn()
      ResizeObserverMock.prototype.unobserve = vi.fn()
      global.ResizeObserver = ResizeObserverMock
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
      await user.click(
        screen.getByRole('switch', { name: 'Enable Constraints' }),
      )

      // assert - verify constraints area is rendered
      expect(
        screen.getByRole('button', { name: 'Add Constraint' }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Remove Constraint' }),
      ).toBeInTheDocument()
      expect(screen.getByText('Constraint 1')).toBeInTheDocument()
      expect(
        screen.getAllByRole('button', { name: /Constraint [0-9]+ .+ if/ }),
      ).toHaveLength(6) // Default app has 6 parameters, so we should have 6 'if' buttons
    })

    it('Should add a new constraint when add constraint button is clicked', async () => {
      // arrange -  enable constraints area
      await user.click(
        screen.getByRole('switch', { name: 'Enable Constraints' }),
      )

      // assume - initially there should be one constraint
      expect(screen.getByText('Constraint 1')).toBeInTheDocument()
      expect(screen.queryByText('Constraint 2')).not.toBeInTheDocument()

      // act - add a new constraint
      await user.click(screen.getByRole('button', { name: 'Add Constraint' }))

      // assert - now there should be two constraints
      expect(screen.getByText('Constraint 1')).toBeInTheDocument()
      expect(screen.getByText('Constraint 2')).toBeInTheDocument()
      expect(
        screen.getAllByRole('button', { name: /Constraint [0-9]+ .+ if/ }),
      ).toHaveLength(12) // With 6 parameters and 2 constraints, we should have 12 'if' buttons
    })

    it('Should remove a constraint when remove constraint button is clicked', async () => {
      // arrange - enable constraints area and add a constraint so we have two
      await user.click(
        screen.getByRole('switch', { name: 'Enable Constraints' }),
      )
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
      expect(
        screen.getAllByRole('button', { name: /Constraint [0-9]+ .+ if/ }),
      ).toHaveLength(6) // With 6 parameters and 1 constraint, we should have 6 'if' buttons
    })

    it('Should disable remove constraint button when only one constraint exists', async () => {
      // act - enable constraints area
      await user.click(
        screen.getByRole('switch', { name: 'Enable Constraints' }),
      )

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
      await user.click(
        screen.getByRole('switch', { name: 'Enable Constraints' }),
      )

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
      await user.click(
        screen.getByRole('switch', { name: 'Enable Constraints' }),
      )
      const firstIfButton = screen.getByRole('button', {
        name: 'Constraint 1 Type if',
      }) // Get the first 'if' button

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
      await user.click(
        screen.getByRole('switch', { name: 'Enable Constraints' }),
      )

      // get the second 'if' button (for Size parameter) and change it to 'then'
      const ifButton = screen.getByRole('button', {
        name: 'Constraint 1 Size if',
      })
      await user.click(ifButton)

      // find inputs in the constraints area
      const input1 = screen.getByRole('textbox', {
        name: 'Constraint 1 Type Predicate',
      })
      const input2 = screen.getByRole('textbox', {
        name: 'Constraint 1 Size Predicate',
      })

      // act - type predicates in both inputs
      await user.type(input1, 'RAID-5')
      await user.type(input2, '> 1000')

      // assert - the inputs should now have the values
      expect(input1).toHaveValue('RAID-5')
      expect(input2).toHaveValue('> 1000')

      // the constraint should be displayed in the pre element
      const preElement = screen.getByText(
        /IF \[Type\] = "RAID-5" THEN \[Size\] > 1000;/i,
      )
      expect(preElement).toBeInTheDocument()
    })

    it('Should display alert when input is includes error', async () => {
      // arrange - enable constraints area
      await user.click(
        screen.getByRole('switch', { name: 'Enable Constraints' }),
      )

      // get the second 'if' button (for Size parameter) and change it to 'then'
      const ifButton = screen.getByRole('button', {
        name: 'Constraint 1 Type if',
      })
      await user.click(ifButton)

      // find all inputs in the constraints area
      const input1 = screen.getByRole('textbox', {
        name: 'Constraint 1 Type Predicate',
      })

      // act - type predicates in both inputs

      await user.type(input1, '@')
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Constraints cannot contain special characters: ":", "(", ")", "|", "~", "{", "}", "@", "[", "]", ";',
      )
      expect(screen.getByRole('button', { name: 'Run' })).toBeDisabled()

      // act - clear the error by changing the name
      await user.clear(input1)
      await user.type(input1, '<= 1000')

      // assert - error message should be gone
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Run' })).toBeEnabled()
    })

    it('Should change constraints when edit parameter name', async () => {
      // arrange - enable constraints area
      await user.click(
        screen.getByRole('switch', { name: 'Enable Constraints' }),
      )

      // get the second 'if' button
      const secondIfButton = screen.getByRole('button', {
        name: 'Constraint 1 Size if',
      })

      // change the second to 'then'
      await user.click(secondIfButton)

      // find inputs in the constraints area
      const input1 = screen.getByRole('textbox', {
        name: 'Constraint 1 Type Predicate',
      })
      const input2 = screen.getByRole('textbox', {
        name: 'Constraint 1 Size Predicate',
      })

      // act - type predicates
      await user.type(input1, 'RAID-5')
      await user.type(input2, '> 1000')

      // assert - the constraint should be displayed in the pre element
      const constraintsCell = screen.getByText('Type')
      expect(constraintsCell).toHaveTextContent('Type')
      const beforePreElement = screen.getByText(
        /IF \[Type\] = "RAID-5" THEN \[Size\] > 1000;/i,
      )
      expect(beforePreElement).toBeInTheDocument()

      // act - edit parameter values
      const parameterInput = screen.getByRole('textbox', {
        name: 'Parameter 1 Name',
      })
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
      await user.click(
        screen.getByRole('switch', { name: 'Enable Constraints' }),
      )

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

    it('Should reset constraints when click reset button', async () => {
      // arrange
      await user.click(
        screen.getByRole('switch', { name: 'Enable Constraints' }),
      )
      await user.click(screen.getByRole('button', { name: 'Edit Directly' }))
      expect(
        screen.getByRole('textbox', { name: 'Constraint Formula' }),
      ).toBeInTheDocument()

      // act
      await user.click(
        screen.getByRole('button', { name: 'Reset Constraints' }),
      )

      // assert
      expect(screen.queryByText('Constraint 1')).toBeInTheDocument()
      expect(screen.queryByText('Constraint 2')).not.toBeInTheDocument()
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
      const ResizeObserverMock = vi.fn()
      ResizeObserverMock.prototype.disconnect = vi.fn()
      ResizeObserverMock.prototype.observe = vi.fn()
      ResizeObserverMock.prototype.unobserve = vi.fn()
      global.ResizeObserver = ResizeObserverMock
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

      // Check that the Download buttons are present
      expect(
        screen.getByRole('button', { name: 'Download' }),
      ).toBeInTheDocument()
    })

    it('Should have Download buttons that are enabled after running PICT', async () => {
      // Run PICT to get results
      await user.click(screen.getByRole('button', { name: 'Run' }))

      // Get the Download button and verify it exists and is enabled
      const csvButton = screen.getByRole('button', { name: 'Download' })
      expect(csvButton).toBeInTheDocument()
      expect(csvButton).not.toBeDisabled()
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
      await user.click(
        screen.getByRole('button', { name: 'Parameter 6 Edit Menu' }),
      )
      await user.click(screen.getByRole('menuitem', { name: 'Insert Below' }))

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
      await user.click(
        screen.getByRole('button', { name: 'Parameter 6 Edit Menu' }),
      )
      await user.click(screen.getByRole('menuitem', { name: 'Delete Row' }))

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
      const input = screen.getByRole('textbox', { name: 'Parameter 1 Values' })
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
      const input = screen.getByRole('textbox', { name: 'Parameter 2 Name' })
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
      const input = screen.getByRole('textbox', { name: 'Parameter 3 Values' })
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
      await user.click(
        screen.getByRole('switch', { name: 'Enable Sub-Models' }),
      )
      await user.click(screen.getAllByRole('checkbox', { name: 'Type' })[0])
      await user.click(screen.getAllByRole('checkbox', { name: 'Size' })[0])
      await user.click(
        screen.getAllByRole('checkbox', { name: 'Format method' })[0],
      )
      await user.clear(screen.getAllByRole('spinbutton', { name: 'Order' })[0])
      await user.type(
        screen.getAllByRole('spinbutton', { name: 'Order' })[0],
        '3',
      )

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
      await user.click(
        screen.getByRole('switch', { name: 'Enable Sub-Models' }),
      )
      await user.click(screen.getAllByRole('checkbox', { name: 'Type' })[0])
      await user.click(screen.getAllByRole('checkbox', { name: 'Size' })[0])
      await user.click(
        screen.getAllByRole('checkbox', { name: 'Format method' })[0],
      )

      await user.clear(screen.getAllByRole('spinbutton', { name: 'Order' })[0])
      await user.type(
        screen.getAllByRole('spinbutton', { name: 'Order' })[0],
        '3',
      )

      // act - click the run button
      await user.click(
        screen.getByRole('button', { name: 'Parameter 6 Edit Menu' }),
      )
      await user.click(screen.getByRole('menuitem', { name: 'Delete Row' }))
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
      await user.click(
        screen.getByRole('switch', { name: 'Enable Constraints' }),
      )
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
          subModels: [],
          options: expect.anything(),
        },
      )
    })
  })
})

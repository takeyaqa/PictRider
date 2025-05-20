/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/unbound-method */
import { PictRunner } from '@takeyaqa/pict-browser'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import App from './App'

describe('App', () => {
  describe('ParametersArea', () => {
    let screen: ReturnType<typeof render>
    let pictRunnerMock: PictRunner

    beforeEach(() => {
      const PictRunnerMock = vi.fn()
      PictRunnerMock.prototype.init = vi.fn()
      PictRunnerMock.prototype.run = vi.fn()
      pictRunnerMock = new PictRunnerMock()
      screen = render(<App pictRunnerInjection={pictRunnerMock} />)
    })

    afterEach(() => {
      vi.clearAllMocks()
    })

    it('Should display PictRider title and default parameter values', async () => {
      // assert - only checking default text and values
      await expect
        .element(
          screen.getByRole('textbox', { name: /Parameter [0-9]+ Name/ }).nth(5),
        )
        .toBeInTheDocument()
      await expect
        .element(
          screen.getByRole('textbox', { name: /Parameter [0-9]+ Name/ }).nth(6),
        )
        .not.toBeInTheDocument()
      await expect
        .element(
          screen
            .getByRole('textbox', { name: /Parameter [0-9]+ Values/ })
            .nth(5),
        )
        .toBeInTheDocument()
      await expect
        .element(
          screen
            .getByRole('textbox', { name: /Parameter [0-9]+ Values/ })
            .nth(6),
        )
        .not.toBeInTheDocument()
      await expect
        .element(screen.getByRole('textbox', { name: 'Parameter 1 Name' }))
        .toHaveValue('Type')
      await expect
        .element(screen.getByRole('textbox', { name: 'Parameter 1 Values' }))
        .toHaveValue('Single, Span, Stripe, Mirror, RAID-5')
      await expect
        .element(screen.getByRole('textbox', { name: 'Parameter 6 Name' }))
        .toHaveValue('Compression')
      await expect
        .element(screen.getByRole('textbox', { name: 'Parameter 6 Values' }))
        .toHaveValue('ON, OFF')
    })

    it('Should add a new parameter row when clicking the add row button', async () => {
      // act
      await screen
        .getByRole('button', { name: 'Parameter 6 Edit Menu' })
        .click()
      await screen.getByRole('menuitem', { name: 'Insert Below' }).click()

      // assert - check count and default values (new row should be empty)
      await expect
        .element(
          screen.getByRole('textbox', { name: /Parameter [0-9]+ Name/ }).nth(6),
        )
        .toBeInTheDocument()
      await expect
        .element(
          screen
            .getByRole('textbox', { name: /Parameter [0-9]+ Values/ })
            .nth(6),
        )
        .toBeInTheDocument()
      await expect
        .element(screen.getByRole('textbox', { name: 'Parameter 1 Name' }))
        .toHaveValue('Type')
      await expect
        .element(screen.getByRole('textbox', { name: 'Parameter 1 Values' }))
        .toHaveValue('Single, Span, Stripe, Mirror, RAID-5')
      await expect
        .element(screen.getByRole('textbox', { name: 'Parameter 6 Name' }))
        .toHaveValue('Compression')
      await expect
        .element(screen.getByRole('textbox', { name: 'Parameter 6 Values' }))
        .toHaveValue('ON, OFF')
      await expect
        .element(screen.getByRole('textbox', { name: 'Parameter 7 Name' }))
        .toHaveValue('')
      await expect
        .element(screen.getByRole('textbox', { name: 'Parameter 7 Values' }))
        .toHaveValue('')
    })

    it('Should remove a parameter row when clicking the delete row button', async () => {
      // act
      await screen
        .getByRole('button', { name: 'Parameter 6 Edit Menu' })
        .click()
      await screen.getByRole('menuitem', { name: 'Delete Row' }).click()

      // assert - check count and default values
      await expect
        .element(
          screen.getByRole('textbox', { name: /Parameter [0-9]+ Name/ }).nth(5),
        )
        .not.toBeInTheDocument()
      await expect
        .element(
          screen
            .getByRole('textbox', { name: /Parameter [0-9]+ Values/ })
            .nth(5),
        )
        .not.toBeInTheDocument()
      await expect
        .element(screen.getByRole('textbox', { name: 'Parameter 1 Name' }))
        .toHaveValue('Type')
      await expect
        .element(screen.getByRole('textbox', { name: 'Parameter 1 Values' }))
        .toHaveValue('Single, Span, Stripe, Mirror, RAID-5')
      await expect
        .element(screen.getByRole('textbox', { name: 'Parameter 5 Name' }))
        .toHaveValue('Cluster size')
      await expect
        .element(screen.getByRole('textbox', { name: 'Parameter 5 Values' }))
        .toHaveValue('512, 1024, 2048, 4096, 8192, 16384, 32768, 65536')
    })

    it('Should disable delete row button when only one low', async () => {
      // act - delete rows until only one row is left
      await screen
        .getByRole('button', { name: 'Parameter 1 Edit Menu' })
        .click()
      await screen.getByRole('menuitem', { name: 'Delete Row' }).click()
      await screen
        .getByRole('button', { name: 'Parameter 1 Edit Menu' })
        .click()
      await screen.getByRole('menuitem', { name: 'Delete Row' }).click()
      await screen
        .getByRole('button', { name: 'Parameter 1 Edit Menu' })
        .click()
      await screen.getByRole('menuitem', { name: 'Delete Row' }).click()
      await screen
        .getByRole('button', { name: 'Parameter 1 Edit Menu' })
        .click()
      await screen.getByRole('menuitem', { name: 'Delete Row' }).click()
      await screen
        .getByRole('button', { name: 'Parameter 1 Edit Menu' })
        .click()
      await screen.getByRole('menuitem', { name: 'Delete Row' }).click()

      // assert
      await screen
        .getByRole('button', { name: 'Parameter 1 Edit Menu' })
        .click()
      await expect
        .element(screen.getByRole('menuitem', { name: 'Delete Row' }))
        .toBeDisabled()
    })

    it('Should clear all parameter values when clicking the clear button', async () => {
      // act
      await screen.getByRole('button', { name: 'Clear Input' }).click()

      // assert - check count is not changed but values is empty
      await expect
        .element(
          screen.getByRole('textbox', { name: /Parameter [0-9]+ Name/ }).nth(5),
        )
        .toBeInTheDocument()
      await expect
        .element(
          screen.getByRole('textbox', { name: /Parameter [0-9]+ Name/ }).nth(6),
        )
        .not.toBeInTheDocument()
      await expect
        .element(
          screen
            .getByRole('textbox', { name: /Parameter [0-9]+ Values/ })
            .nth(5),
        )
        .toBeInTheDocument()
      await expect
        .element(
          screen
            .getByRole('textbox', { name: /Parameter [0-9]+ Values/ })
            .nth(6),
        )
        .not.toBeInTheDocument()
      await expect
        .element(screen.getByRole('textbox', { name: 'Parameter 1 Name' }))
        .toHaveValue('')
      await expect
        .element(screen.getByRole('textbox', { name: 'Parameter 1 Values' }))
        .toHaveValue('')
      await expect
        .element(screen.getByRole('textbox', { name: 'Parameter 6 Name' }))
        .toHaveValue('')
      await expect
        .element(screen.getByRole('textbox', { name: 'Parameter 6 Values' }))
        .toHaveValue('')
    })

    it('Should handle adding and removing multiple parameter rows', async () => {
      // Initial state - 6 parameter rows
      await expect
        .element(
          screen.getByRole('textbox', { name: /Parameter [0-9]+ Name/ }).nth(5),
        )
        .toBeInTheDocument()

      // Add 3 rows
      // act - add first row
      await screen
        .getByRole('button', { name: 'Parameter 1 Edit Menu' })
        .click()

      await screen.getByRole('menuitem', { name: 'Insert Below' }).click()
      // assert
      await expect
        .element(
          screen.getByRole('textbox', { name: /Parameter [0-9]+ Name/ }).nth(6),
        )
        .toBeInTheDocument()

      // act - add second row
      await screen
        .getByRole('button', { name: 'Parameter 3 Edit Menu' })
        .click()
      await screen.getByRole('menuitem', { name: 'Insert Above' }).click()
      // assert
      await expect
        .element(
          screen.getByRole('textbox', { name: /Parameter [0-9]+ Name/ }).nth(7),
        )
        .toBeInTheDocument()

      // act - add third row
      await screen
        .getByRole('button', { name: 'Parameter 5 Edit Menu' })
        .click()
      await screen.getByRole('menuitem', { name: 'Insert Below' }).click()
      // assert
      await expect
        .element(
          screen.getByRole('textbox', { name: /Parameter [0-9]+ Name/ }).nth(8),
        )
        .toBeInTheDocument()

      // Now remove 2 rows
      // act - remove first row
      await screen
        .getByRole('button', { name: 'Parameter 5 Edit Menu' })
        .click()
      await screen.getByRole('menuitem', { name: 'Delete Row' }).click()
      // assert
      await expect
        .element(
          screen.getByRole('textbox', { name: /Parameter [0-9]+ Name/ }).nth(8),
        )
        .not.toBeInTheDocument()

      // act - remove second row
      await screen
        .getByRole('button', { name: 'Parameter 7 Edit Menu' })
        .click()
      await screen.getByRole('menuitem', { name: 'Delete Row' }).click()
      // assert
      await expect
        .element(
          screen.getByRole('textbox', { name: /Parameter [0-9]+ Name/ }).nth(7),
        )
        .not.toBeInTheDocument()

      // Verify we still have the correct values in the remaining textbox
      await expect
        .element(screen.getByRole('textbox', { name: 'Parameter 1 Name' }))
        .toHaveValue('Type')
      await expect
        .element(screen.getByRole('textbox', { name: 'Parameter 2 Name' }))
        .toHaveValue('')
      await expect
        .element(screen.getByRole('textbox', { name: 'Parameter 3 Name' }))
        .toHaveValue('')
      await expect
        .element(screen.getByRole('textbox', { name: 'Parameter 4 Name' }))
        .toHaveValue('Size')
      await expect
        .element(screen.getByRole('textbox', { name: 'Parameter 5 Name' }))
        .toHaveValue('')
      await expect
        .element(screen.getByRole('textbox', { name: 'Parameter 6 Name' }))
        .toHaveValue('File system')
      await expect
        .element(screen.getByRole('textbox', { name: 'Parameter 7 Name' }))
        .toHaveValue('Compression')
    })

    it('Should disable add row button when maximum row limit (50) is reached', async () => {
      // Initial state - 6 parameter rows
      await expect
        .element(
          screen.getByRole('textbox', { name: /Parameter [0-9]+ Name/ }).nth(5),
        )
        .toBeInTheDocument()
      await expect
        .element(
          screen.getByRole('textbox', { name: /Parameter [0-9]+ Name/ }).nth(6),
        )
        .not.toBeInTheDocument()

      // Add rows until we reach the limit (50 rows)
      // We already have 6 rows, so we need to add 44 more
      for (let i = 0; i < 44; i++) {
        await screen
          .getByRole('button', { name: 'Parameter 1 Edit Menu' })
          .click()
        await screen.getByRole('menuitem', { name: 'Insert Above' }).click()
      }

      // Verify we have 50 rows
      await expect
        .element(
          screen
            .getByRole('textbox', { name: /Parameter [0-9]+ Name/ })
            .nth(49),
        )
        .toBeInTheDocument()
      await expect
        .element(
          screen
            .getByRole('textbox', { name: /Parameter [0-9]+ Name/ })
            .nth(50),
        )
        .not.toBeInTheDocument()

      // Verify the Add Row button is disabled
      await screen
        .getByRole('button', { name: 'Parameter 1 Edit Menu' })
        .click()
      await expect
        .element(screen.getByRole('menuitem', { name: 'Insert Above' }))
        .toBeDisabled()
    })

    it('Should display error message when duplicate parameter names are found (single)', async () => {
      // act - edit parameter name to create a duplicate
      const nameInput = screen.getByRole('textbox', {
        name: 'Parameter 2 Name',
      })
      await nameInput.clear()
      await nameInput.fill('Type') // Set to 'Type' which already exists

      // assert - check error message is displayed
      await expect
        .element(screen.getByRole('alert'))
        .toHaveTextContent('Parameter names must be unique.')
      await expect
        .element(screen.getByRole('button', { name: 'Run' }))
        .toBeDisabled()

      // act - clear the error by changing the name
      await nameInput.clear()
      await nameInput.fill('New Type')

      // assert - error message should be gone
      await expect.element(screen.getByRole('alert')).not.toBeInTheDocument()
      await expect
        .element(screen.getByRole('button', { name: 'Run' }))
        .toBeEnabled()
    })

    it('Should display error message when duplicate parameter names are found (double)', async () => {
      // act - edit parameter name to create a duplicate
      const nameInput1 = screen.getByRole('textbox', {
        name: 'Parameter 1 Name',
      })
      await nameInput1.clear()
      await nameInput1.fill('Type')
      const nameInput2 = screen.getByRole('textbox', {
        name: 'Parameter 2 Name',
      })
      await nameInput2.clear()
      await nameInput2.fill('Type')

      // assert - check error message is displayed
      await expect
        .element(screen.getByRole('alert'))
        .toHaveTextContent('Parameter names must be unique.')
      await expect
        .element(screen.getByRole('button', { name: 'Run' }))
        .toBeDisabled()

      // act - edit parameter name to create a duplicate twice
      const nameInput3 = screen.getByRole('textbox', {
        name: 'Parameter 3 Name',
      })
      await nameInput3.clear()
      await nameInput3.fill('Duplicate')
      const nameInput4 = screen.getByRole('textbox', {
        name: 'Parameter 4 Name',
      })
      await nameInput4.clear()
      await nameInput4.fill('Duplicate')

      // assert - still error message is displayed
      await expect
        .element(screen.getByRole('alert'))
        .toHaveTextContent('Parameter names must be unique.')
      await expect
        .element(screen.getByRole('button', { name: 'Run' }))
        .toBeDisabled()

      // act - edit first parameter name to clear a duplicate, but still have one
      await nameInput1.clear()

      // assert - still error message is displayed
      await expect
        .element(screen.getByRole('alert'))
        .toHaveTextContent('Parameter names must be unique.')
      await expect
        .element(screen.getByRole('button', { name: 'Run' }))
        .toBeDisabled()

      // act - clear the error by changing the name
      await nameInput4.clear()

      // assert - error message should be gone (blank input is ignored)
      await expect.element(screen.getByRole('alert')).not.toBeInTheDocument()
      await expect
        .element(screen.getByRole('button', { name: 'Run' }))
        .toBeEnabled()
    })

    it('Should display error message when invalid character in parameter name', async () => {
      // act - edit parameter name to create invalid character
      const nameInput = screen.getByRole('textbox', {
        name: 'Parameter 1 Name',
      })
      await nameInput.clear()
      await nameInput.fill('Ty#:()|,~{}@[]:=!+&*?pe')

      // assert - check error message is displayed
      await expect
        .element(screen.getByRole('alert'))
        .toHaveTextContent(
          'Parameter name cannot contain special characters: "#", ":", "<", ">", "(", ")", "|", ",", "~", "{", "}", "@", "[", "]", ";", "=", "!", "+", "&", "*", "?"',
        )
      await expect
        .element(screen.getByRole('button', { name: 'Run' }))
        .toBeDisabled()

      // act - clear the error by changing the name
      await nameInput.clear()
      await nameInput.fill('Type')

      // assert - error message should be gone
      await expect.element(screen.getByRole('alert')).not.toBeInTheDocument()
      await expect
        .element(screen.getByRole('button', { name: 'Run' }))
        .toBeEnabled()
    })

    it('Should display error message when invalid character in parameter values', async () => {
      // act - edit parameter name to create invalid character
      const nameInput = screen.getByRole('textbox', {
        name: 'Parameter 1 Values',
      })
      await nameInput.clear()
      await nameInput.fill('Type, a#:,{}@[]=!+&*?')
      // assert - check error message is displayed
      await expect
        .element(screen.getByRole('alert'))
        .toHaveTextContent(
          'Parameter values cannot contain special characters: "#", ":", "{", "}", "@", "[", "]", ";", "=", "!", "+", "&", "*", "?"',
        )
      await expect
        .element(screen.getByRole('button', { name: 'Run' }))
        .toBeDisabled()

      // act - clear the error by changing the name
      await nameInput.clear()
      await nameInput.fill('Type, A | B, C(3), ~D')

      // assert - error message should be gone
      await expect.element(screen.getByRole('alert')).not.toBeInTheDocument()
      await expect
        .element(screen.getByRole('button', { name: 'Run' }))
        .toBeEnabled()
    })
  })

  describe('SubModelArea', () => {
    let screen: ReturnType<typeof render>
    let pictRunnerMock: PictRunner

    beforeEach(() => {
      const PictRunnerMock = vi.fn()
      PictRunnerMock.prototype.init = vi.fn()
      PictRunnerMock.prototype.run = vi.fn()
      pictRunnerMock = new PictRunnerMock()
      screen = render(<App pictRunnerInjection={pictRunnerMock} />)
    })

    afterEach(() => {
      vi.clearAllMocks()
    })

    it('Should not render sub-models area by default', async () => {
      // assert - by default, sub-models area should not be visible
      await expect
        .element(screen.getByRole('switch', { name: 'Enable Sub-Models' }))
        .not.toBeChecked()
    })

    it('Should render sub-models area when enabled', async () => {
      // act - enable sub-models area by clicking the checkbox
      await screen.getByRole('switch', { name: 'Enable Sub-Models' }).click()

      // assert - verify sub-models area is rendered
      await expect
        .element(screen.getByRole('heading', { level: 2, name: 'Sub-Models' }))
        .toBeInTheDocument()
      await expect
        .element(screen.getByText('Sub-Model 1', { exact: true }))
        .toBeInTheDocument()
      await expect
        .element(
          screen.getByRole('spinbutton', { name: 'Order', exact: true }).nth(0),
        )
        .toBeInTheDocument()
      await expect
        .element(
          screen.getByRole('spinbutton', { name: 'Order', exact: true }).nth(1),
        )
        .not.toBeInTheDocument()
    })

    it('Should change sub-model name when parameter name is changed', async () => {
      // arrange - enable sub-models area
      await screen.getByRole('switch', { name: 'Enable Sub-Models' }).click()

      // act - change the name of the first parameter name
      const nameInput = screen.getByRole('textbox', {
        name: 'Parameter 1 Name',
      })
      await nameInput.clear()
      await nameInput.fill('TypeTypeType')

      // assert - the sub-model name should be updated
      await expect
        .element(screen.getByRole('checkbox', { name: 'TypeTypeType' }))
        .toBeInTheDocument()
    })

    it('Should add and remove a new sub-model when add/remove sub-model button is clicked', async () => {
      // arrange - enable sub-models area
      await screen.getByRole('switch', { name: 'Enable Sub-Models' }).click()

      // act - add a new sub-model
      await screen.getByRole('button', { name: 'Add Sub-Model' }).click()

      // assert - now there should be two sub-models
      await expect
        .element(screen.getByText('Sub-Model 1', { exact: true }))
        .toBeInTheDocument()
      await expect
        .element(screen.getByText('Sub-Model 2', { exact: true }))
        .toBeInTheDocument()

      // act - remove a new sub-model
      await screen.getByRole('button', { name: 'Remove Sub-Model' }).click()

      // assert - now there should be one sub-model
      await expect
        .element(screen.getByText('Sub-Model 1', { exact: true }))
        .toBeInTheDocument()
      await expect
        .element(screen.getByText('Sub-Model 2', { exact: true }))
        .not.toBeInTheDocument()
    })
  })

  describe('ConstraintsArea', () => {
    let screen: ReturnType<typeof render>
    let pictRunnerMock: PictRunner

    beforeEach(() => {
      const PictRunnerMock = vi.fn()
      PictRunnerMock.prototype.init = vi.fn()
      PictRunnerMock.prototype.run = vi.fn()
      pictRunnerMock = new PictRunnerMock()
      screen = render(<App pictRunnerInjection={pictRunnerMock} />)
    })

    afterEach(() => {
      vi.clearAllMocks()
    })

    it('Should not render constraints area by default', async () => {
      // assert - by default, constraints area should not be visible
      await expect
        .element(screen.getByRole('button', { name: 'Add Constraint' }))
        .not.toBeInTheDocument()
      await expect
        .element(screen.getByRole('button', { name: 'Remove Constraint' }))
        .not.toBeInTheDocument()
    })

    it('Should render constraints area when enabled', async () => {
      // act - enable constraints area by clicking the checkbox
      await screen.getByRole('switch', { name: 'Enable Constraints' }).click()

      // assert - verify constraints area is rendered
      await expect
        .element(screen.getByRole('button', { name: 'Add Constraint' }))
        .toBeInTheDocument()
      await expect
        .element(screen.getByRole('button', { name: 'Remove Constraint' }))
        .toBeInTheDocument()
      await expect
        .element(screen.getByText('Constraint 1', { exact: true }))
        .toBeInTheDocument()
      await expect
        .element(
          screen
            .getByRole('button', { name: /Constraint [0-9]+ .+ if/ })
            .nth(5),
        )
        .toBeInTheDocument() // Default app has 6 parameters, so we should have 6 'if' buttons
      await expect
        .element(
          screen
            .getByRole('button', { name: /Constraint [0-9]+ .+ if/ })
            .nth(6),
        )
        .not.toBeInTheDocument() // Default app has 6 parameters, so we should have 6 'if' buttons
    })

    it('Should add a new constraint when add constraint button is clicked', async () => {
      // arrange -  enable constraints area
      await screen.getByRole('switch', { name: 'Enable Constraints' }).click()

      // assume - initially there should be one constraint
      await expect
        .element(screen.getByText('Constraint 1', { exact: true }))
        .toBeInTheDocument()
      await expect
        .element(screen.getByText('Constraint 2', { exact: true }))
        .not.toBeInTheDocument()

      // act - add a new constraint
      await screen.getByRole('button', { name: 'Add Constraint' }).click()

      // assert - now there should be two constraints
      await expect
        .element(screen.getByText('Constraint 1', { exact: true }))
        .toBeInTheDocument()
      await expect
        .element(screen.getByText('Constraint 2', { exact: true }))
        .toBeInTheDocument()
      await expect
        .element(
          screen
            .getByRole('button', { name: /Constraint [0-9]+ .+ if/ })
            .nth(11),
        )
        .toBeInTheDocument() // With 6 parameters and 2 constraints, we should have 12 'if' buttons
      await expect
        .element(
          screen
            .getByRole('button', { name: /Constraint [0-9]+ .+ if/ })
            .nth(12),
        )
        .not.toBeInTheDocument() // With 6 parameters and 2 constraints, we should have 12 'if' buttons
    })

    it('Should remove a constraint when remove constraint button is clicked', async () => {
      // arrange - enable constraints area and add a constraint so we have two
      await screen.getByRole('switch', { name: 'Enable Constraints' }).click()
      await screen.getByRole('button', { name: 'Add Constraint' }).click()

      // assume - there should be two constraints
      await expect
        .element(screen.getByText('Constraint 2', { exact: true }))
        .toBeInTheDocument()

      // assert - remove constraint button should be enabled
      await expect
        .element(screen.getByRole('button', { name: 'Remove Constraint' }))
        .toBeEnabled()

      // act - remove a constraint
      await screen.getByRole('button', { name: 'Remove Constraint' }).click()

      // assert - now there should be only one constraint
      await expect
        .element(screen.getByText('Constraint 1', { exact: true }))
        .toBeInTheDocument()
      await expect
        .element(screen.getByText('Constraint 2', { exact: true }))
        .not.toBeInTheDocument()
      await expect
        .element(
          screen
            .getByRole('button', { name: /Constraint [0-9]+ .+ if/ })
            .nth(5),
        )
        .toBeInTheDocument() // With 6 parameters and 1 constraint, we should have 6 'if' buttons
      await expect
        .element(
          screen
            .getByRole('button', { name: /Constraint [0-9]+ .+ if/ })
            .nth(6),
        )
        .not.toBeInTheDocument() // With 6 parameters and 1 constraint, we should have 6 'if' buttons
    })

    it('Should disable remove constraint button when only one constraint exists', async () => {
      // act - enable constraints area
      await screen.getByRole('switch', { name: 'Enable Constraints' }).click()

      // assert - by default there's only one constraint, so remove button should be disabled
      await expect
        .element(screen.getByRole('button', { name: 'Remove Constraint' }))
        .toBeDisabled()

      // act - add a constraint
      await screen.getByRole('button', { name: 'Add Constraint' }).click()

      // assert - now remove button should be enabled
      await expect
        .element(screen.getByRole('button', { name: 'Remove Constraint' }))
        .toBeEnabled()

      // act - remove the constraint
      await screen.getByRole('button', { name: 'Remove Constraint' }).click()

      // assert - remove button should be disabled again
      await expect
        .element(screen.getByRole('button', { name: 'Remove Constraint' }))
        .toBeDisabled()
    })

    it('Should disable add constraint button when maximum constraint limit (50) is reached', async () => {
      // arrange - enable constraints area
      await screen.getByRole('switch', { name: 'Enable Constraints' }).click()

      // Initial state - should have 1 constraint
      await expect
        .element(screen.getByText('Constraint 1', { exact: true }))
        .toBeInTheDocument()
      await expect
        .element(screen.getByText('Constraint 50', { exact: true }))
        .not.toBeInTheDocument()

      // Add constraints until we reach the limit (50)
      // We already have 1 constraint, so we need to add 49 more
      for (let i = 0; i < 49; i++) {
        await screen.getByRole('button', { name: 'Add Constraint' }).click()
      }

      // Verify we have 50 constraints
      await expect
        .element(screen.getByText('Constraint 50', { exact: true }))
        .toBeInTheDocument()

      // Verify the Add Constraint button is disabled
      await expect
        .element(screen.getByRole('button', { name: 'Add Constraint' }))
        .toBeDisabled()
    })

    it('Should toggle condition between if and then when clicked', async () => {
      // arrange - enable constraints area
      await screen.getByRole('switch', { name: 'Enable Constraints' }).click()

      // act - click it to toggle to 'then'
      await screen
        .getByRole('button', {
          name: 'Constraint 1 Type if',
        })
        .click()

      // assert - now it should be 'then'
      await expect
        .element(
          screen.getByRole('button', {
            name: 'Constraint 1 Type then',
          }),
        )
        .toHaveTextContent('then')

      // act - click it again to toggle back to 'if'
      await screen
        .getByRole('button', {
          name: 'Constraint 1 Type then',
        })
        .click()

      // assert - now it should be 'if' again
      await expect
        .element(
          screen.getByRole('button', {
            name: 'Constraint 1 Type if',
          }),
        )
        .toHaveTextContent('if')
    })

    it('Should update condition predicate when input is changed', async () => {
      // arrange - enable constraints area
      await screen.getByRole('switch', { name: 'Enable Constraints' }).click()

      // get the second 'if' button (for Size parameter) and change it to 'then'
      const ifButton = screen.getByRole('button', {
        name: 'Constraint 1 Size if',
      })
      await ifButton.click()

      // find inputs in the constraints area
      const input1 = screen.getByRole('textbox', {
        name: 'Constraint 1 Type Predicate',
      })
      const input2 = screen.getByRole('textbox', {
        name: 'Constraint 1 Size Predicate',
      })

      // act - type predicates in both inputs
      await input1.fill('RAID-5')
      await input2.fill('> 1000')

      // assert - the inputs should now have the values
      await expect.element(input1).toHaveValue('RAID-5')
      await expect.element(input2).toHaveValue('> 1000')

      // the constraint should be displayed in the pre element
      const preElement = screen.getByText(
        /IF \[Type\] = "RAID-5" THEN \[Size\] > 1000;/i,
      )
      await expect.element(preElement).toBeInTheDocument()
    })

    it('Should display alert when input is includes error', async () => {
      // arrange - enable constraints area
      await screen.getByRole('switch', { name: 'Enable Constraints' }).click()

      // get the second 'if' button (for Size parameter) and change it to 'then'
      const ifButton = screen.getByRole('button', {
        name: 'Constraint 1 Type if',
      })
      await ifButton.click()

      // find all inputs in the constraints area
      const input1 = screen.getByRole('textbox', {
        name: 'Constraint 1 Type Predicate',
      })

      // act - type predicates in both inputs

      await input1.fill('@')
      await expect
        .element(screen.getByRole('alert'))
        .toHaveTextContent(
          'Constraints cannot contain special characters: ":", "(", ")", "|", "~", "{", "}", "@", "[", "]", ";',
        )
      await expect
        .element(screen.getByRole('button', { name: 'Run' }))
        .toBeDisabled()

      // act - clear the error by changing the name
      await input1.clear()
      await input1.fill('<= 1000')

      // assert - error message should be gone
      await expect.element(screen.getByRole('alert')).not.toBeInTheDocument()
      await expect
        .element(screen.getByRole('button', { name: 'Run' }))
        .toBeEnabled()
    })

    it('Should change constraints when edit parameter name', async () => {
      // arrange - enable constraints area
      await screen.getByRole('switch', { name: 'Enable Constraints' }).click()

      // get the second 'if' button
      const secondIfButton = screen.getByRole('button', {
        name: 'Constraint 1 Size if',
      })

      // change the second to 'then'
      await secondIfButton.click()

      // find inputs in the constraints area
      const input1 = screen.getByRole('textbox', {
        name: 'Constraint 1 Type Predicate',
      })
      const input2 = screen.getByRole('textbox', {
        name: 'Constraint 1 Size Predicate',
      })

      // act - type predicates
      await input1.fill('RAID-5')
      await input2.fill('> 1000')

      // assert - the constraint should be displayed in the pre element
      const constraintsCell = screen.getByText('Type', { exact: true })
      await expect.element(constraintsCell).toHaveTextContent('Type')
      const beforePreElement = screen.getByText(
        /IF \[Type\] = "RAID-5" THEN \[Size\] > 1000;/i,
      )
      await expect.element(beforePreElement).toBeInTheDocument()

      // act - edit parameter values
      const parameterInput = screen.getByRole('textbox', {
        name: 'Parameter 1 Name',
      })
      await parameterInput.clear()
      await parameterInput.fill('New Type')

      // assert - the constraint should be displayed in the pre element
      await expect
        .element(screen.getByText('New Type', { exact: true }))
        .toHaveTextContent('New Type')
      const afterPreElement = screen.getByText(
        /IF \[New Type\] = "RAID-5" THEN \[Size\] > 1000;/i,
      )
      await expect.element(afterPreElement).toBeInTheDocument()
    })

    it('Should change direct edit mode when click button', async () => {
      // arrange
      await screen.getByRole('switch', { name: 'Enable Constraints' }).click()

      // act
      await screen.getByRole('button', { name: 'Edit Directly' }).click()

      // assert
      await expect
        .element(screen.getByRole('textbox', { name: 'Constraint Formula' }))
        .toBeInTheDocument()
      await expect
        .element(screen.getByRole('button', { name: 'Add Constraint' }))
        .not.toBeInTheDocument()
      await expect
        .element(screen.getByRole('button', { name: 'Remove Constraint' }))
        .not.toBeInTheDocument()
    })

    it('Should reset constraints when click reset button', async () => {
      // arrange
      await screen.getByRole('switch', { name: 'Enable Constraints' }).click()
      await screen.getByRole('button', { name: 'Edit Directly' }).click()
      await expect
        .element(screen.getByRole('textbox', { name: 'Constraint Formula' }))
        .toBeInTheDocument()

      // act
      await screen.getByRole('button', { name: 'Reset Constraints' }).click()

      // assert
      await expect
        .element(screen.getByText('Constraint 1', { exact: true }))
        .toBeInTheDocument()
      await expect
        .element(screen.getByText('Constraint 2', { exact: true }))
        .not.toBeInTheDocument()
    })
  })

  describe('Run Pict', () => {
    let screen: ReturnType<typeof render>
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
      screen = render(<App pictRunnerInjection={pictRunnerMock} />)
    })

    afterEach(() => {
      vi.clearAllMocks()
    })

    it('Should display result table', async () => {
      // act - click the run button
      await screen.getByRole('button', { name: 'Run' }).click()

      // assert - check result table
      await expect.element(screen.getByRole('alert')).not.toBeInTheDocument()
      await expect
        .element(screen.getByRole('table', { name: 'Result' }))
        .toBeInTheDocument()
      // await expect
      //   .element(screen.getByRole('columnheader', { name: 'Type' }))
      //   .toBeInTheDocument()
      await expect
        .element(screen.getByRole('cell', { name: '100' }))
        .toBeInTheDocument()

      // Check that the Download buttons are present
      await expect
        .element(screen.getByRole('button', { name: 'Download' }))
        .toBeInTheDocument()
    })

    it('Should have Download buttons that are enabled after running PICT', async () => {
      // Run PICT to get results
      await screen.getByRole('button', { name: 'Run' }).click()

      // Get the Download button and verify it exists and is enabled
      const csvButton = screen.getByRole('button', { name: 'Download' })
      await expect.element(csvButton).toBeInTheDocument()
      await expect.element(csvButton).not.toBeDisabled()
    })

    it('Should clear results when clicking the Clear Result button', async () => {
      // Run PICT to get results
      await screen.getByRole('button', { name: 'Run' }).click()

      // Verify result table is displayed
      await expect
        .element(screen.getByRole('table', { name: 'Result' }))
        .toBeInTheDocument()

      // Click the Clear Result button
      await screen.getByRole('button', { name: 'Clear Result' }).click()

      // Verify result table is no longer displayed
      await expect
        .element(screen.getByRole('table', { name: 'Result' }))
        .not.toBeInTheDocument()
    })

    it('Should call with parameters when input default value', async () => {
      // act - click the run button
      await screen.getByRole('button', { name: 'Run' }).click()

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
      await screen
        .getByRole('button', { name: 'Parameter 6 Edit Menu' })
        .click()
      await screen.getByRole('menuitem', { name: 'Insert Below' }).click()

      // act - click the run button
      await screen.getByRole('button', { name: 'Run' }).click()

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
      await screen
        .getByRole('button', { name: 'Parameter 6 Edit Menu' })
        .click()
      await screen.getByRole('menuitem', { name: 'Delete Row' }).click()

      // act - click the run button
      await screen.getByRole('button', { name: 'Run' }).click()

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
      await input.clear()
      await input.fill('Double, Span, Stripe, Mirror, RAID-5000')

      // act - click the run button
      await screen.getByRole('button', { name: 'Run' }).click()

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
      await input.clear()

      // act - click the run button
      await screen.getByRole('button', { name: 'Run' }).click()

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
      await input.clear()

      // act - click the run button
      await screen.getByRole('button', { name: 'Run' }).click()

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
      await screen.getByRole('switch', { name: 'Enable Sub-Models' }).click()

      await screen.getByRole('checkbox', { name: 'Type' }).nth(0).click()
      await screen.getByRole('checkbox', { name: 'Size' }).nth(0).click()
      await screen
        .getByRole('checkbox', { name: 'Format method' })
        .nth(0)
        .click()
      await screen.getByRole('spinbutton', { name: 'Order' }).nth(0).clear()
      await screen.getByRole('spinbutton', { name: 'Order' }).nth(0).fill('3')

      // act - click the run button
      await screen.getByRole('button', { name: 'Run' }).click()

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
      await screen.getByRole('switch', { name: 'Enable Sub-Models' }).click()

      await screen.getByRole('checkbox', { name: 'Type' }).nth(0).click()
      await screen.getByRole('checkbox', { name: 'Size' }).nth(0).click()
      await screen
        .getByRole('checkbox', { name: 'Format method' })
        .nth(0)
        .click()
      await screen.getByRole('spinbutton', { name: 'Order' }).nth(0).clear()
      await screen.getByRole('spinbutton', { name: 'Order' }).nth(0).fill('3')

      // act - click the run button
      await screen
        .getByRole('button', { name: 'Parameter 6 Edit Menu' })
        .click()

      await screen.getByRole('menuitem', { name: 'Delete Row' }).click()
      await screen.getByRole('button', { name: 'Run' }).click()

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
      await screen.getByRole('switch', { name: 'Enable Constraints' }).click()
      await screen.getByRole('button', { name: 'Edit Directly' }).click()

      // act
      await screen
        .getByRole('textbox', { name: 'Constraint Formula' })
        .fill('IF [Type] = "RAID-5" THEN [Size] > 1000;')
      await screen.getByRole('button', { name: 'Run' }).click()

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
          options: expect.anything(),
        },
      )
    })
  })
})

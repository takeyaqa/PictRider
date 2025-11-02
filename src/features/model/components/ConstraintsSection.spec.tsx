/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { PictRunner } from '@takeyaqa/pict-wasm'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import App from '../../../App'

describe('ConstraintsSection', () => {
  let screen: Awaited<ReturnType<typeof render>>
  let pictRunnerMock: PictRunner

  beforeEach(async () => {
    const PictRunnerMock = vi.fn()
    PictRunnerMock.prototype.init = vi.fn()
    PictRunnerMock.prototype.run = vi.fn()
    pictRunnerMock = new PictRunnerMock()
    screen = await render(<App pictRunnerInjection={pictRunnerMock} />)
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
        screen.getByRole('button', { name: /Constraint [0-9]+ .+ if/ }).nth(5),
      )
      .toBeInTheDocument() // Default app has 6 parameters, so we should have 6 'if' buttons
    await expect
      .element(
        screen.getByRole('button', { name: /Constraint [0-9]+ .+ if/ }).nth(6),
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
        screen.getByRole('button', { name: /Constraint [0-9]+ .+ if/ }).nth(11),
      )
      .toBeInTheDocument() // With 6 parameters and 2 constraints, we should have 12 'if' buttons
    await expect
      .element(
        screen.getByRole('button', { name: /Constraint [0-9]+ .+ if/ }).nth(12),
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
        screen.getByRole('button', { name: /Constraint [0-9]+ .+ if/ }).nth(5),
      )
      .toBeInTheDocument() // With 6 parameters and 1 constraint, we should have 6 'if' buttons
    await expect
      .element(
        screen.getByRole('button', { name: /Constraint [0-9]+ .+ if/ }).nth(6),
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

  it.skip('Should reset constraints when click reset button', async () => {
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

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/unbound-method */
import { PictRunner } from '@takeyaqa/pict-browser'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import App from '../../../App'

describe('ParametersSection', () => {
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
        screen.getByRole('textbox', { name: /Parameter [0-9]+ Values/ }).nth(5),
      )
      .toBeInTheDocument()
    await expect
      .element(
        screen.getByRole('textbox', { name: /Parameter [0-9]+ Values/ }).nth(6),
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
    await screen.getByRole('button', { name: 'Parameter 6 Edit Menu' }).click()
    await screen.getByRole('menuitem', { name: 'Insert Below' }).click()

    // assert - check count and default values (new row should be empty)
    await expect
      .element(
        screen.getByRole('textbox', { name: /Parameter [0-9]+ Name/ }).nth(6),
      )
      .toBeInTheDocument()
    await expect
      .element(
        screen.getByRole('textbox', { name: /Parameter [0-9]+ Values/ }).nth(6),
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
    await screen.getByRole('button', { name: 'Parameter 6 Edit Menu' }).click()
    await screen.getByRole('menuitem', { name: 'Delete Row' }).click()

    // assert - check count and default values
    await expect
      .element(
        screen.getByRole('textbox', { name: /Parameter [0-9]+ Name/ }).nth(5),
      )
      .not.toBeInTheDocument()
    await expect
      .element(
        screen.getByRole('textbox', { name: /Parameter [0-9]+ Values/ }).nth(5),
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
    await screen.getByRole('button', { name: 'Parameter 1 Edit Menu' }).click()
    await screen.getByRole('menuitem', { name: 'Delete Row' }).click()
    await screen.getByRole('button', { name: 'Parameter 1 Edit Menu' }).click()
    await screen.getByRole('menuitem', { name: 'Delete Row' }).click()
    await screen.getByRole('button', { name: 'Parameter 1 Edit Menu' }).click()
    await screen.getByRole('menuitem', { name: 'Delete Row' }).click()
    await screen.getByRole('button', { name: 'Parameter 1 Edit Menu' }).click()
    await screen.getByRole('menuitem', { name: 'Delete Row' }).click()
    await screen.getByRole('button', { name: 'Parameter 1 Edit Menu' }).click()
    await screen.getByRole('menuitem', { name: 'Delete Row' }).click()

    // assert
    await screen.getByRole('button', { name: 'Parameter 1 Edit Menu' }).click()
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
        screen.getByRole('textbox', { name: /Parameter [0-9]+ Values/ }).nth(5),
      )
      .toBeInTheDocument()
    await expect
      .element(
        screen.getByRole('textbox', { name: /Parameter [0-9]+ Values/ }).nth(6),
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
    await screen.getByRole('button', { name: 'Parameter 1 Edit Menu' }).click()

    await screen.getByRole('menuitem', { name: 'Insert Below' }).click()
    // assert
    await expect
      .element(
        screen.getByRole('textbox', { name: /Parameter [0-9]+ Name/ }).nth(6),
      )
      .toBeInTheDocument()

    // act - add second row
    await screen.getByRole('button', { name: 'Parameter 3 Edit Menu' }).click()
    await screen.getByRole('menuitem', { name: 'Insert Above' }).click()
    // assert
    await expect
      .element(
        screen.getByRole('textbox', { name: /Parameter [0-9]+ Name/ }).nth(7),
      )
      .toBeInTheDocument()

    // act - add third row
    await screen.getByRole('button', { name: 'Parameter 5 Edit Menu' }).click()
    await screen.getByRole('menuitem', { name: 'Insert Below' }).click()
    // assert
    await expect
      .element(
        screen.getByRole('textbox', { name: /Parameter [0-9]+ Name/ }).nth(8),
      )
      .toBeInTheDocument()

    // Now remove 2 rows
    // act - remove first row
    await screen.getByRole('button', { name: 'Parameter 5 Edit Menu' }).click()
    await screen.getByRole('menuitem', { name: 'Delete Row' }).click()
    // assert
    await expect
      .element(
        screen.getByRole('textbox', { name: /Parameter [0-9]+ Name/ }).nth(8),
      )
      .not.toBeInTheDocument()

    // act - remove second row
    await screen.getByRole('button', { name: 'Parameter 7 Edit Menu' }).click()
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
        screen.getByRole('textbox', { name: /Parameter [0-9]+ Name/ }).nth(49),
      )
      .toBeInTheDocument()
    await expect
      .element(
        screen.getByRole('textbox', { name: /Parameter [0-9]+ Name/ }).nth(50),
      )
      .not.toBeInTheDocument()

    // Verify the Add Row button is disabled
    await screen.getByRole('button', { name: 'Parameter 1 Edit Menu' }).click()
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

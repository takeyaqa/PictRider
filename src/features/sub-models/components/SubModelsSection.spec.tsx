import { PictRunner } from '@takeyaqa/pict-wasm'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import App from '../../../App'

describe('SubModelArea', () => {
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

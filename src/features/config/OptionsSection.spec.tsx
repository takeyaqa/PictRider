import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import OptionsSection from './OptionsSection'
import ConfigProvider from './provider'

function OptionsSectionWrapper() {
  return (
    <ConfigProvider>
      <OptionsSection />
    </ConfigProvider>
  )
}

describe('OptionsSection', () => {
  let screen: Awaited<ReturnType<typeof render>>

  beforeEach(async () => {
    screen = await render(<OptionsSectionWrapper />)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('Should display default option values', async () => {
    // assert - check heading
    await expect.element(screen.getByText('Options')).toBeInTheDocument()

    // assert - check Order of combinations default value is 2
    await expect
      .element(
        screen.getByRole('spinbutton', { name: 'Order of combinations' }),
      )
      .toHaveValue(2)

    // assert - check Randomize generation is unchecked
    await expect
      .element(screen.getByRole('checkbox', { name: 'Randomize generation' }))
      .not.toBeChecked()

    // assert - check Seed is disabled when randomize is off
    await expect
      .element(screen.getByRole('spinbutton', { name: 'Seed' }))
      .toBeDisabled()

    // assert - check Show model file is unchecked
    await expect
      .element(screen.getByRole('checkbox', { name: 'Show model file' }))
      .not.toBeChecked()
  })

  it('Should change order of combinations value', async () => {
    // arrange
    const input = screen.getByRole('spinbutton', {
      name: 'Order of combinations',
    })

    // act
    await input.clear()
    await input.fill('5')

    // assert
    await expect.element(input).toHaveValue(5)
  })

  it('Should enable seed input when randomize generation is checked', async () => {
    // act
    await screen.getByRole('checkbox', { name: 'Randomize generation' }).click()

    // assert - Randomize generation should be checked
    await expect
      .element(screen.getByRole('checkbox', { name: 'Randomize generation' }))
      .toBeChecked()

    // assert - Seed should be enabled
    await expect
      .element(screen.getByRole('spinbutton', { name: 'Seed' }))
      .toBeEnabled()
  })

  it('Should disable seed input when randomize generation is unchecked', async () => {
    // arrange - enable randomize generation first
    await screen.getByRole('checkbox', { name: 'Randomize generation' }).click()
    await expect
      .element(screen.getByRole('spinbutton', { name: 'Seed' }))
      .toBeEnabled()

    // act - uncheck randomize generation
    await screen.getByRole('checkbox', { name: 'Randomize generation' }).click()

    // assert - Seed should be disabled again
    await expect
      .element(screen.getByRole('spinbutton', { name: 'Seed' }))
      .toBeDisabled()
  })

  it('Should change seed value when randomize generation is enabled', async () => {
    // arrange - enable randomize generation
    await screen.getByRole('checkbox', { name: 'Randomize generation' }).click()
    const seedInput = screen.getByRole('spinbutton', { name: 'Seed' })

    // act
    await seedInput.fill('12345')

    // assert
    await expect.element(seedInput).toHaveValue(12345)
  })

  it('Should toggle show model file checkbox', async () => {
    // act - check
    await screen.getByRole('checkbox', { name: 'Show model file' }).click()

    // assert
    await expect
      .element(screen.getByRole('checkbox', { name: 'Show model file' }))
      .toBeChecked()

    // act - uncheck
    await screen.getByRole('checkbox', { name: 'Show model file' }).click()

    // assert
    await expect
      .element(screen.getByRole('checkbox', { name: 'Show model file' }))
      .not.toBeChecked()
  })
})

import { PictRunner } from '@takeyaqa/pict-wasm'
import { useMemo } from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import type { Constraints, Parameters, SubModels } from '../../types'
import ConfigProvider from '../config/provider'
import { getInitialConstraints } from '../constraints/reducer'
import { getInitialParameters } from '../parameters/reducer'
import { getInitialSubModels } from '../sub-models/reducer'
import MenuSection from './MenuSection'

interface MenuSectionWrapperProps {
  pictRunnerInjection: PictRunner
  canClearResult?: boolean
  parametersOverride?: Parameters
  onClearInput?: () => void
  onClearResult?: () => void
  setResult?: () => void
}

function MenuSectionWrapper({
  pictRunnerInjection,
  canClearResult = false,
  parametersOverride,
  onClearResult = vi.fn(),
  onClearInput = vi.fn(),
  setResult = vi.fn(),
}: MenuSectionWrapperProps) {
  const parameters = useMemo(
    () => parametersOverride ?? getInitialParameters(),
    [parametersOverride],
  )
  const constraints: Constraints = useMemo(
    () => getInitialConstraints(parameters.parameters),
    [parameters],
  )
  const subModels: SubModels = useMemo(() => getInitialSubModels(), [])

  return (
    <ConfigProvider>
      <MenuSection
        pictRunnerInjection={pictRunnerInjection}
        canClearResult={canClearResult}
        parameters={parameters}
        constraints={constraints}
        subModels={subModels}
        onClearInput={onClearInput}
        onClearResult={onClearResult}
        setResult={setResult}
      />
    </ConfigProvider>
  )
}

describe('MenuSection', () => {
  let screen: Awaited<ReturnType<typeof render>>
  let pictRunnerMock: PictRunner

  beforeEach(() => {
    const PictRunnerMock = vi.fn()
    PictRunnerMock.prototype.run = vi.fn(() => ({
      result: {
        header: ['Type', 'Size', 'Format method'],
        body: [
          ['Single', '10', 'Quick'],
          ['Span', '100', 'Slow'],
        ],
      },
    }))
    pictRunnerMock = new PictRunnerMock()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('Should display three menu buttons', async () => {
    // arrange
    screen = await render(
      <MenuSectionWrapper pictRunnerInjection={pictRunnerMock} />,
    )

    // assert
    await expect
      .element(screen.getByRole('button', { name: 'Clear Input' }))
      .toBeInTheDocument()
    await expect
      .element(screen.getByRole('button', { name: 'Clear Result' }))
      .toBeInTheDocument()
    await expect
      .element(screen.getByRole('button', { name: 'Run' }))
      .toBeInTheDocument()
  })

  it('Should disable Clear Result button when canClearResult is false', async () => {
    // arrange
    screen = await render(
      <MenuSectionWrapper
        pictRunnerInjection={pictRunnerMock}
        canClearResult={false}
      />,
    )

    // assert
    await expect
      .element(screen.getByRole('button', { name: 'Clear Result' }))
      .toBeDisabled()
  })

  it('Should enable Clear Result button when canClearResult is true', async () => {
    // arrange
    screen = await render(
      <MenuSectionWrapper
        pictRunnerInjection={pictRunnerMock}
        canClearResult={true}
      />,
    )

    // assert
    await expect
      .element(screen.getByRole('button', { name: 'Clear Result' }))
      .toBeEnabled()
  })

  it('Should call handleClearInput when Clear Input is clicked', async () => {
    // arrange
    const handleClearInput = vi.fn()
    screen = await render(
      <MenuSectionWrapper
        pictRunnerInjection={pictRunnerMock}
        onClearInput={handleClearInput}
      />,
    )

    // act
    await screen.getByRole('button', { name: 'Clear Input' }).click()

    // assert
    expect(handleClearInput).toHaveBeenCalledOnce()
  })

  it('Should call handleClearResult when Clear Result is clicked', async () => {
    // arrange
    const handleClearResult = vi.fn()
    screen = await render(
      <MenuSectionWrapper
        pictRunnerInjection={pictRunnerMock}
        canClearResult={true}
        onClearResult={handleClearResult}
      />,
    )

    // act
    await screen.getByRole('button', { name: 'Clear Result' }).click()

    // assert
    expect(handleClearResult).toHaveBeenCalledOnce()
  })

  it('Should enable Run button when pict runner is loaded and no validation errors', async () => {
    // arrange
    screen = await render(
      <MenuSectionWrapper pictRunnerInjection={pictRunnerMock} />,
    )

    // assert
    await expect
      .element(screen.getByRole('button', { name: 'Run' }))
      .toBeEnabled()
  })

  it('Should disable Run button when parameters contain invalid values', async () => {
    // arrange
    const invalidParameters: Parameters = {
      parameters: [
        {
          id: '1',
          name: '',
          values: 'a, b',
          isValidName: false,
          isValidValues: true,
        },
      ],
      parameterErrors: [],
    }
    screen = await render(
      <MenuSectionWrapper
        pictRunnerInjection={pictRunnerMock}
        parametersOverride={invalidParameters}
      />,
    )

    // assert
    await expect
      .element(screen.getByRole('button', { name: 'Run' }))
      .toBeDisabled()
  })
})

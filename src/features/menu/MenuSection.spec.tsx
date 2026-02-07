import { PictRunner } from '@takeyaqa/pict-wasm'
import { useMemo } from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import type {
  ConstraintsState,
  ParametersState,
  SubModelsState,
} from '../../types'
import ConfigProvider from '../config/provider'
import { getInitialConstraints } from '../constraints/reducer'
import { getInitialParameters } from '../parameters/reducer'
import { getInitialSubModels } from '../sub-models/reducer'
import MenuSection from './MenuSection'

interface WrapperProps {
  pictRunnerInjection: PictRunner
  canClearResult?: boolean
  handleClearResult?: () => void
  setResult?: () => void
  handleClickClear?: () => void
  parametersOverride?: ParametersState
}

function MenuSectionWrapper({
  pictRunnerInjection,
  canClearResult = false,
  handleClearResult = vi.fn(),
  setResult = vi.fn(),
  handleClickClear = vi.fn(),
  parametersOverride,
}: WrapperProps) {
  const parameters = useMemo(
    () => parametersOverride ?? getInitialParameters(),
    [parametersOverride],
  )
  const constraints: ConstraintsState = useMemo(
    () => getInitialConstraints(parameters.parameters),
    [parameters],
  )
  const subModels: SubModelsState = useMemo(() => getInitialSubModels(), [])

  return (
    <ConfigProvider>
      <MenuSection
        pictRunnerInjection={pictRunnerInjection}
        canClearResult={canClearResult}
        handleClearResult={handleClearResult}
        setResult={setResult}
        parameters={parameters}
        constraints={constraints}
        subModels={subModels}
        handleClickClear={handleClickClear}
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

  it('Should call handleClickClear when Clear Input is clicked', async () => {
    // arrange
    const handleClickClear = vi.fn()
    screen = await render(
      <MenuSectionWrapper
        pictRunnerInjection={pictRunnerMock}
        handleClickClear={handleClickClear}
      />,
    )

    // act
    await screen.getByRole('button', { name: 'Clear Input' }).click()

    // assert
    expect(handleClickClear).toHaveBeenCalledOnce()
  })

  it('Should call handleClearResult when Clear Result is clicked', async () => {
    // arrange
    const handleClearResult = vi.fn()
    screen = await render(
      <MenuSectionWrapper
        pictRunnerInjection={pictRunnerMock}
        canClearResult={true}
        handleClearResult={handleClearResult}
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
    const invalidParameters: ParametersState = {
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

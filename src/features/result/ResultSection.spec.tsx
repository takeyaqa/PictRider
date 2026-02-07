import { useMemo } from 'react'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import type { Result } from '../../types'
import ConfigContext from '../config/context'
import { getInitialConfig } from '../config/reducer'
import ResultSection from './ResultSection'

const sampleResult: Result = {
  header: [
    { id: '1', name: 'Type' },
    { id: '2', name: 'Size' },
  ],
  body: [
    {
      id: 'r1',
      values: [
        { id: 'v1', value: 'Single' },
        { id: 'v2', value: '10' },
      ],
    },
    {
      id: 'r2',
      values: [
        { id: 'v3', value: 'Span' },
        { id: 'v4', value: '100' },
      ],
    },
  ],
  modelFile: 'Type: Single, Span\nSize: 10, 100',
  messages: [],
}

interface WrapperProps {
  result: Result | null
  showModelFile?: boolean
}

function ResultSectionWrapper({ result, showModelFile = false }: WrapperProps) {
  const value = useMemo(
    () => ({
      config: { ...getInitialConfig(), showModelFile },
      handlers: {
        handleChangeConfigCheckbox: vi.fn(),
        handleChangeConfigInput: vi.fn(),
      },
    }),
    [showModelFile],
  )

  return (
    <ConfigContext value={value}>
      <ResultSection result={result} />
    </ConfigContext>
  )
}

describe('ResultSection', () => {
  let screen: Awaited<ReturnType<typeof render>>

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('Should not render anything when result is null', async () => {
    // arrange
    screen = await render(<ResultSectionWrapper result={null} />)

    // assert
    await expect
      .element(screen.getByRole('table', { name: 'Result' }))
      .not.toBeInTheDocument()
    await expect
      .element(screen.getByRole('button', { name: 'Download' }))
      .not.toBeInTheDocument()
  })

  it('Should display result table with header and body', async () => {
    // arrange
    screen = await render(<ResultSectionWrapper result={sampleResult} />)

    // assert - heading
    await expect.element(screen.getByText('Result')).toBeInTheDocument()

    // assert - table
    await expect
      .element(screen.getByRole('table', { name: 'Result' }))
      .toBeInTheDocument()

    // assert - body cells
    await expect
      .element(screen.getByRole('cell', { name: 'Single', exact: true }))
      .toBeInTheDocument()
    await expect
      .element(screen.getByRole('cell', { name: '10', exact: true }))
      .toBeInTheDocument()
    await expect
      .element(screen.getByRole('cell', { name: 'Span', exact: true }))
      .toBeInTheDocument()
    await expect
      .element(screen.getByRole('cell', { name: '100', exact: true }))
      .toBeInTheDocument()
  })

  it('Should display Download button', async () => {
    // arrange
    screen = await render(<ResultSectionWrapper result={sampleResult} />)

    // assert
    await expect
      .element(screen.getByRole('button', { name: 'Download' }))
      .toBeInTheDocument()
  })

  it('Should not display Model File section by default', async () => {
    // arrange
    screen = await render(<ResultSectionWrapper result={sampleResult} />)

    // assert
    await expect.element(screen.getByText('Model File')).not.toBeInTheDocument()
  })

  it('Should display Model File section when showModelFile is true', async () => {
    // arrange
    screen = await render(
      <ResultSectionWrapper result={sampleResult} showModelFile={true} />,
    )

    // assert
    await expect.element(screen.getByText('Model File')).toBeInTheDocument()
    await expect
      .element(screen.getByText('Type: Single, Span\nSize: 10, 100'))
      .toBeInTheDocument()
  })

  it('Should display alert messages when result has messages', async () => {
    // arrange
    const resultWithMessages: Result = {
      ...sampleResult,
      messages: [{ id: 'm1', text: 'Warning: some issue occurred' }],
    }
    screen = await render(<ResultSectionWrapper result={resultWithMessages} />)

    // assert
    await expect
      .element(screen.getByRole('alert'))
      .toHaveTextContent('Warning: some issue occurred')
  })
})

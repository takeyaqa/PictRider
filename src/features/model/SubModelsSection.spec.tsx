import { useImmerReducer } from 'use-immer'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import ConfigProvider from '../config/provider'
import SubModelsSection from './SubModelsSection'
import { modelReducer, getInitialModel } from './reducer'

function SubModelsSectionWrapper() {
  const [model, dispatch] = useImmerReducer(modelReducer, getInitialModel())

  const handleClickSubModelParameters = (
    subModelId: string,
    parameterId: string,
    checked: boolean,
  ) => {
    dispatch({
      type: 'clickSubModelParameters',
      payload: { subModelId, parameterId, checked },
    })
  }

  const handleChangeSubModelOrder = (id: string, order: number) => {
    dispatch({
      type: 'changeSubModelOrder',
      payload: { id, order },
    })
  }

  const handleAddSubModel = () => {
    dispatch({ type: 'addSubModel' })
  }

  const handleRemoveSubModel = () => {
    dispatch({ type: 'removeSubModel' })
  }

  return (
    <ConfigProvider>
      <SubModelsSection
        subModels={{
          subModels: model.subModels,
        }}
        parameters={model.parameters}
        onClickSubModelParameters={handleClickSubModelParameters}
        onChangeSubModelOrder={handleChangeSubModelOrder}
        onAddSubModel={handleAddSubModel}
        onRemoveSubModel={handleRemoveSubModel}
      />
    </ConfigProvider>
  )
}

describe('SubModelArea', () => {
  let screen: Awaited<ReturnType<typeof render>>

  beforeEach(async () => {
    screen = await render(<SubModelsSectionWrapper />)
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
        screen
          .getByRole('spinbutton', { name: 'Sub-Model 1 Order', exact: true })
          .nth(0),
      )
      .toBeInTheDocument()
    await expect
      .element(
        screen
          .getByRole('spinbutton', { name: 'Sub-Model 2 Order', exact: true })
          .nth(0),
      )
      .not.toBeInTheDocument()
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

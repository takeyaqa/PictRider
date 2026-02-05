import { PictRunner } from '@takeyaqa/pict-wasm'
import { OptionsSection } from '../features/config'
import { MenuSection } from '../features/menu'
import { ConstraintsSection } from '../features/constraints'
import { ParametersSection } from '../features/parameters'
import { SubModelsSection } from '../features/sub-models'
import type {
  ConstraintsState,
  ParametersState,
  Result,
  SubModelsState,
} from '../types'

interface TopPanelProps {
  pictRunnerInjection?: PictRunner // use for testing
  result: Result | null
  setResult: (result: Result | null) => void

  // State (read-only)
  parameters: ParametersState
  constraints: ConstraintsState
  subModels: SubModelsState

  // Parameter handlers
  handleAddRow: (id: string, target: 'above' | 'below') => void
  handleRemoveRow: (id: string) => void
  handleClear: () => void
  handleChangeParameter: (
    id: string,
    field: 'name' | 'values',
    value: string,
  ) => void

  // Constraint handlers
  handleAddConstraint: () => void
  handleRemoveConstraint: () => void
  handleChangeCondition: (
    constraintId: string,
    parameterId: string,
    value: string,
  ) => void
  handleToggleCondition: (constraintId: string, parameterId: string) => void
  handleChangeConstraintFormula: (value: string) => void
  handleToggleConstraintDirectEditMode: () => void
  handleResetConstraints: () => void

  // SubModel handlers
  handleAddSubModel: () => void
  handleRemoveSubModel: () => void
  handleClickSubModelParameters: (
    subModelId: string,
    parameterId: string,
    checked: boolean,
  ) => void
  handleChangeSubModelOrder: (id: string, order: number) => void
}

function TopPanel({
  pictRunnerInjection,
  result,
  setResult,
  parameters,
  constraints,
  subModels,
  handleAddRow,
  handleRemoveRow,
  handleClear,
  handleChangeParameter,
  handleAddConstraint,
  handleRemoveConstraint,
  handleChangeCondition,
  handleToggleCondition,
  handleChangeConstraintFormula,
  handleToggleConstraintDirectEditMode,
  handleResetConstraints,
  handleAddSubModel,
  handleRemoveSubModel,
  handleClickSubModelParameters,
  handleChangeSubModelOrder,
}: TopPanelProps) {
  return (
    <div>
      <MenuSection
        pictRunnerInjection={pictRunnerInjection} // use for testing
        canClearResult={result !== null}
        handleClearResult={() => {
          setResult(null)
        }}
        setResult={setResult}
        parameters={parameters}
        constraints={constraints}
        subModels={subModels}
        handleClickClear={handleClear}
      />
      <ParametersSection
        parameters={parameters}
        handleAddRow={handleAddRow}
        handleRemoveRow={handleRemoveRow}
        handleChangeParameter={handleChangeParameter}
      />
      <ConstraintsSection
        constraints={constraints}
        parameters={parameters.parameters}
        handleAddConstraint={handleAddConstraint}
        handleRemoveConstraint={handleRemoveConstraint}
        handleChangeCondition={handleChangeCondition}
        handleToggleCondition={handleToggleCondition}
        handleChangeConstraintFormula={handleChangeConstraintFormula}
        handleToggleConstraintDirectEditMode={
          handleToggleConstraintDirectEditMode
        }
        handleResetConstraints={handleResetConstraints}
      />
      <SubModelsSection
        subModels={subModels}
        parameters={parameters.parameters}
        handleAddSubModel={handleAddSubModel}
        handleRemoveSubModel={handleRemoveSubModel}
        handleClickSubModelParameters={handleClickSubModelParameters}
        handleChangeSubModelOrder={handleChangeSubModelOrder}
      />
      <OptionsSection />
    </div>
  )
}

export default TopPanel

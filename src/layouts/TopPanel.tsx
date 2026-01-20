import { PictRunner } from '@takeyaqa/pict-wasm'
import { OptionsSection } from '../features/config/components'
import { MenuSection } from '../features/menu/components'
import type { ModelHandlers } from '../features/model'
import {
  ConstraintsSection,
  ParametersSection,
  SubModelsSection,
} from '../features/model/components'
import type { Model, Result } from '../types'

interface TopPanelProps {
  pictRunnerInjection?: PictRunner // use for testing
  result: Result | null
  setResult: (result: Result | null) => void
  model: Model
  handlers: ModelHandlers
}

function TopPanel({
  pictRunnerInjection,
  result,
  setResult,
  model,
  handlers,
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
        model={model}
        handlers={handlers}
      />
      <ParametersSection model={model} handlers={handlers} />
      <ConstraintsSection model={model} handlers={handlers} />
      <SubModelsSection model={model} handlers={handlers} />
      <OptionsSection />
    </div>
  )
}

export default TopPanel

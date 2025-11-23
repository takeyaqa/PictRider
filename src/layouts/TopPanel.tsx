import { PictRunner } from '@takeyaqa/pict-wasm'
import { OptionsSection } from '../features/config/components'
import { MenuSection } from '../features/menu/components'
import {
  ConstraintsSection,
  ParametersSection,
  SubModelsSection,
} from '../features/model/components'
import type { Result } from '../types'

interface TopPanelProps {
  pictRunnerInjection?: PictRunner // use for testing
  result: Result | null
  setResult: (result: Result | null) => void
}

function TopPanel({ pictRunnerInjection, result, setResult }: TopPanelProps) {
  return (
    <div>
      <MenuSection
        pictRunnerInjection={pictRunnerInjection} // use for testing
        canClearResult={result !== null}
        handleClearResult={() => {
          setResult(null)
        }}
        setResult={setResult}
      />
      <ParametersSection />
      <ConstraintsSection />
      <SubModelsSection />
      <OptionsSection />
    </div>
  )
}

export default TopPanel

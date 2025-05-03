import { Result } from '../types'
import {
  MenuSection,
  ParametersSection,
  ConstraintsSection,
  SubModelsSection,
  OptionsSection,
} from '../sections'
import { PictRunner } from '@takeyaqa/pict-browser'

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

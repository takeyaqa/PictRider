import { PictRunner } from '@takeyaqa/pict-browser'
import { Result } from '../types'
import {
  MenuSection,
  ParametersSection,
  ConstraintsSection,
  SubModelsSection,
  OptionsSection,
} from '../sections'

interface TopPanelProps {
  pictRunnerLoaded: boolean
  pictRunner: React.RefObject<PictRunner | null>
  result: Result | null
  setResult: (result: Result | null) => void
}

function TopPanel({
  pictRunnerLoaded,
  pictRunner,
  result,
  setResult,
}: TopPanelProps) {
  return (
    <div>
      <MenuSection
        pictRunnerLoaded={pictRunnerLoaded}
        canClearResult={result !== null}
        pictRunner={pictRunner}
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

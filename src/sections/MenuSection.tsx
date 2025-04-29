import { Button, Section } from '../components'

interface MenuSectionProps {
  containsInvalidValues: boolean
  pictRunnerLoaded: boolean
  canClearResult: boolean
  handleClickRun: () => void
  handleClickClear: () => void
  handleClearResult: () => void
}

function MenuSection({
  containsInvalidValues,
  pictRunnerLoaded,
  canClearResult,
  handleClickRun,
  handleClickClear,
  handleClearResult,
}: MenuSectionProps) {
  return (
    <Section>
      <menu className="flex list-none items-center justify-start gap-5">
        <li>
          <Button type="warning" size="sm" onClick={handleClickClear}>
            Clear Input
          </Button>
        </li>
        <li>
          <Button
            type="warning"
            size="sm"
            disabled={!canClearResult}
            onClick={handleClearResult}
          >
            Clear Result
          </Button>
        </li>
        <li className="border-l border-l-black pl-5">
          <Button
            type="primary"
            size="sm"
            disabled={containsInvalidValues || !pictRunnerLoaded}
            onClick={handleClickRun}
          >
            Run
          </Button>
        </li>
      </menu>
    </Section>
  )
}

export default MenuSection

import { Checkbox, NumberInput, Section } from '../components'
import { Config } from '../types'

interface OptionsSectionProps {
  config: Config
  handleChangeConfigCheckbox: (
    type:
      | 'enableSubModels'
      | 'enableConstraints'
      | 'showModelFile'
      | 'randomizeGeneration',
    checked: boolean,
  ) => void
  handleChangeConfigInput: (
    type: 'orderOfCombinations' | 'randomizeSeed',
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void
}

function OptionsSection({
  config,
  handleChangeConfigCheckbox,
  handleChangeConfigInput,
}: OptionsSectionProps) {
  return (
    <Section>
      <h2 className="mb-5 text-lg font-bold">Options</h2>
      <div className="mb-5 flex items-center gap-5">
        <div>
          <Checkbox
            label="Show model file"
            checked={config.showModelFile}
            onChange={(checked) => {
              handleChangeConfigCheckbox('showModelFile', checked)
            }}
          />
        </div>
        <div>
          <NumberInput
            label="Order of combinations"
            value={config.orderOfCombinations}
            min={1}
            max={50}
            onChange={(e) => {
              handleChangeConfigInput('orderOfCombinations', e)
            }}
          />
        </div>
        <div>
          <Checkbox
            label="Randomize generation"
            checked={config.randomizeGeneration}
            onChange={(checked) => {
              handleChangeConfigCheckbox('randomizeGeneration', checked)
            }}
          />
        </div>
        <div>
          <NumberInput
            label="Seed"
            value={config.randomizeSeed}
            min={0}
            max={65535}
            disabled={!config.randomizeGeneration}
            onChange={(e) => {
              handleChangeConfigInput('randomizeSeed', e)
            }}
          />
        </div>
      </div>
    </Section>
  )
}

export default OptionsSection

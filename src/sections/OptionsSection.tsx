import { Checkbox, NumberInput, Section } from '../components'
import { useConfig } from '../features/config'

function OptionsSection() {
  const { config, handlers } = useConfig()
  return (
    <Section>
      <h2 className="mb-5 text-lg font-bold">Options</h2>
      <div className="mb-5 grid grid-cols-1 items-start gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-3">
        <div>
          <NumberInput
            label="Order of combinations"
            value={config.orderOfCombinations}
            min={1}
            max={50}
            onChange={(e) => {
              handlers.handleChangeConfigInput('orderOfCombinations', e)
            }}
          />
        </div>
        <div>
          <div>
            <Checkbox
              label="Randomize generation"
              checked={config.randomizeGeneration}
              onChange={(checked) => {
                handlers.handleChangeConfigCheckbox(
                  'randomizeGeneration',
                  checked,
                )
              }}
            />
          </div>
          <div className="mt-2 indent-6">
            <NumberInput
              label="Seed"
              value={config.randomizeSeed}
              min={0}
              max={65535}
              disabled={!config.randomizeGeneration}
              onChange={(e) => {
                handlers.handleChangeConfigInput('randomizeSeed', e)
              }}
            />
          </div>
        </div>
        <div>
          <Checkbox
            label="Show model file"
            checked={config.showModelFile}
            onChange={(checked) => {
              handlers.handleChangeConfigCheckbox('showModelFile', checked)
            }}
          />
        </div>
      </div>
    </Section>
  )
}

export default OptionsSection

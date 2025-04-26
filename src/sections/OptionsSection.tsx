import { Checkbox, NumberInput } from '../components'
import { Config } from '../types'

interface OptionsSectionProps {
  config: Config
  handleChangeConfig: (
    type:
      | 'enableSubModels'
      | 'enableConstraints'
      | 'showModelFile'
      | 'orderOfCombinations'
      | 'randomizeGeneration'
      | 'randomizeSeed',
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void
}

function OptionsSection({ config, handleChangeConfig }: OptionsSectionProps) {
  return (
    <section className="mx-2 mb-5 rounded-md border-2 bg-gray-50 p-7 shadow-md md:mx-10">
      <h2 className="mb-5 text-lg font-bold">Options</h2>
      <div className="mb-5 flex items-center gap-5">
        <div>
          <Checkbox
            id="enable-sub-models-button"
            label="Sub-models"
            checked={config.enableSubModels}
            onChange={(e) => {
              handleChangeConfig('enableSubModels', e)
            }}
          />
        </div>
        <div>
          <Checkbox
            id="enable-constraints-button"
            label="Constraints"
            checked={config.enableConstraints}
            onChange={(e) => {
              handleChangeConfig('enableConstraints', e)
            }}
          />
        </div>
        <div>
          <Checkbox
            id="show-model-file-button"
            label="Show model file"
            checked={config.showModelFile}
            onChange={(e) => {
              handleChangeConfig('showModelFile', e)
            }}
          />
        </div>
        <div>
          <label htmlFor="order-of-combinations">
            Order of combinations
            <NumberInput
              id="order-of-combinations"
              value={config.orderOfCombinations}
              min={1}
              max={50}
              onChange={(e) => {
                handleChangeConfig('orderOfCombinations', e)
              }}
            />
          </label>
        </div>
        <div>
          <Checkbox
            id="randomize-generation-button"
            label="Randomize generation"
            checked={config.randomizeGeneration}
            onChange={(e) => {
              handleChangeConfig('randomizeGeneration', e)
            }}
          />
        </div>
        <div>
          <label htmlFor="randomize-seed">
            Seed
            <NumberInput
              id="randomize-seed"
              value={config.randomizeSeed}
              min={0}
              max={65535}
              disabled={!config.randomizeGeneration}
              onChange={(e) => {
                handleChangeConfig('randomizeSeed', e)
              }}
            />
          </label>
        </div>
      </div>
    </section>
  )
}

export default OptionsSection

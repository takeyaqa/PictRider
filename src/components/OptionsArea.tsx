import { PictConfig } from '../types'

interface OptionsAreaProps {
  config: PictConfig
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

function OptionsArea({ config, handleChangeConfig }: OptionsAreaProps) {
  return (
    <section className="mx-2 mb-5 rounded-md border-2 bg-gray-50 p-7 shadow-md md:mx-10">
      <h2 className="mb-5 text-lg font-bold">Options</h2>
      <div className="mb-5 flex items-center gap-5">
        <div>
          <label className="cursor-pointer" htmlFor="enable-sub-models-button">
            <input
              type="checkbox"
              className="mr-1 cursor-pointer rounded"
              id="enable-sub-models-button"
              autoComplete="off"
              checked={config.enableSubModels}
              onChange={(e) => {
                handleChangeConfig('enableSubModels', e)
              }}
            />
            Sub-models
          </label>
        </div>
        <div>
          <label className="cursor-pointer" htmlFor="enable-constraints-button">
            <input
              type="checkbox"
              className="mr-1 cursor-pointer rounded"
              id="enable-constraints-button"
              autoComplete="off"
              checked={config.enableConstraints}
              onChange={(e) => {
                handleChangeConfig('enableConstraints', e)
              }}
            />
            Constraints
          </label>
        </div>
        <div>
          <label className="cursor-pointer" htmlFor="show-model-file-button">
            <input
              type="checkbox"
              className="mr-1 cursor-pointer rounded"
              id="show-model-file-button"
              autoComplete="off"
              checked={config.showModelFile}
              onChange={(e) => {
                handleChangeConfig('showModelFile', e)
              }}
            />
            Show model file
          </label>
        </div>
        <div>
          <label htmlFor="order-of-combinations">
            Order of combinations
            <input
              type="number"
              className="ml-3 rounded border border-black bg-white pl-2 text-right focus:border-transparent focus:ring-3 focus:ring-blue-500 focus:outline-none"
              id="order-of-combinations"
              autoComplete="off"
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
          <label
            className="cursor-pointer"
            htmlFor="randomize-generation-button"
          >
            <input
              type="checkbox"
              className="mr-1 cursor-pointer rounded"
              id="randomize-generation-button"
              autoComplete="off"
              checked={config.randomizeGeneration}
              onChange={(e) => {
                handleChangeConfig('randomizeGeneration', e)
              }}
            />
            Randomize generation
          </label>
        </div>
        <div>
          <label htmlFor="randomize-seed">
            Seed
            <input
              type="number"
              className="ml-3 rounded border border-black bg-white pl-2 text-right focus:border-transparent focus:ring-3 focus:ring-blue-500 focus:outline-none disabled:bg-gray-300"
              id="randomize-seed"
              autoComplete="off"
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

export default OptionsArea

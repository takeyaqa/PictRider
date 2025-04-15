import { PictConfig } from '../types'

interface OptionsAreaProps {
  config: PictConfig
  handleChangeConfig: (
    type: 'enableConstraints' | 'orderOfCombinations',
    e?: React.ChangeEvent<HTMLInputElement>,
  ) => void
}

function OptionsArea({ config, handleChangeConfig }: OptionsAreaProps) {
  return (
    <section className="mx-2 mb-5 rounded-md border-2 bg-gray-50 p-7 shadow-md md:mx-10">
      <h2 className="mb-5 text-lg font-bold">Options</h2>
      <div className="mb-5 flex items-center gap-5">
        <div>
          <label className="cursor-pointer" htmlFor="enable-constraints-button">
            <input
              type="checkbox"
              className="mr-1 cursor-pointer rounded"
              id="enable-constraints-button"
              autoComplete="off"
              checked={config.enableConstraints}
              onChange={() => {
                handleChangeConfig('enableConstraints')
              }}
            />
            Constraints
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
      </div>
    </section>
  )
}

export default OptionsArea

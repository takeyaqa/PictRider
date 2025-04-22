import { PictConfig, PictParameter, SubModel } from '../types'

interface SubModelsAreaProps {
  config: PictConfig
  parameters: PictParameter[]
  subModels: SubModel[]
  handleChangeSubModelParameters: (
    id: string,
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => void
  handleChangeSubModelOrder: (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void
}

function SubModelsArea({
  config,
  parameters,
  subModels,
  handleChangeSubModelParameters,
  handleChangeSubModelOrder,
}: SubModelsAreaProps) {
  if (!config.enableSubModels) {
    return null
  }
  return (
    <section className="mx-2 mt-5 mb-5 rounded-md border-2 bg-gray-50 p-7 shadow-md md:mx-10">
      <h2 className="mb-5 text-lg font-bold">Sub-Models</h2>
      {subModels.map((subModel) => (
        <div className="mb-5 grid grid-cols-12 gap-5" key={subModel.id}>
          <div className="col-span-3">
            <label htmlFor="sub-model-names" className="flex gap-2 align-top">
              Parameters
              <select
                multiple={true}
                value={subModel.parameterIds}
                className="col-span-3 rounded-md border-2 bg-white p-2 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                id="sub-model-names"
                autoComplete="off"
                onChange={(e) => {
                  handleChangeSubModelParameters(subModel.id, e)
                }}
              >
                {parameters.map((parameter) => (
                  <option key={parameter.id} value={parameter.id}>
                    {parameter.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="col-span-2">
            <label htmlFor="sub-model-order">
              Order
              <input
                type="number"
                className="ml-3 rounded border border-black bg-white pl-2 text-right focus:border-transparent focus:ring-3 focus:ring-blue-500 focus:outline-none disabled:bg-gray-300"
                id="sub-model-order"
                autoComplete="off"
                value={subModel.order}
                min={2}
                max={parameters.length}
                onChange={(e) => {
                  handleChangeSubModelOrder(subModel.id, e)
                }}
              />
            </label>
          </div>
        </div>
      ))}
    </section>
  )
}

export default SubModelsArea

import { NumberInput } from '../components'
import { Config, Parameter, SubModel } from '../types'

interface SubModelsSectionProps {
  config: Config
  parameters: Parameter[]
  subModels: SubModel[]
  handleClickSubModelParameters: (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void
  handleChangeSubModelOrder: (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void
}

function SubModelsSection({
  config,
  parameters,
  subModels,
  handleClickSubModelParameters,
  handleChangeSubModelOrder,
}: SubModelsSectionProps) {
  if (!config.enableSubModels) {
    return null
  }
  return (
    <section className="mx-2 mt-5 mb-5 rounded-md border-2 bg-gray-50 p-7 shadow-md md:mx-10">
      <h2 className="mb-5 text-lg font-bold">Sub-Models</h2>
      {subModels.map((subModel) => (
        <div className="mb-5 grid grid-cols-12 gap-5" key={subModel.id}>
          <div className="col-span-3">
            <div className="flex flex-col">
              <h3 className="mb-2">Parameters</h3>
              {parameters.map((parameter) => (
                <div key={parameter.id} className="mb-1 items-center">
                  <label
                    htmlFor={`${subModel.id}-${parameter.id}`}
                    className="text-sm"
                  >
                    <input
                      type="checkbox"
                      id={`${subModel.id}-${parameter.id}`}
                      value={parameter.id}
                      checked={subModel.parameterIds.includes(parameter.id)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
                      onChange={(e) => {
                        handleClickSubModelParameters(subModel.id, e)
                      }}
                    />
                    {parameter.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <label htmlFor="sub-model-order">
              Order
              <NumberInput
                id="sub-model-order"
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

export default SubModelsSection

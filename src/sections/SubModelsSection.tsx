import { Checkbox, NumberInput, Section } from '../components'
import { Config, Parameter, SubModel } from '../types'

interface SubModelsSectionProps {
  config: Config
  parameters: Parameter[]
  subModels: SubModel[]
  handleClickSubModelParameters: (
    subModelId: string,
    parameterId: string,
    checked: boolean,
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
    <Section>
      <h2 className="mb-5 text-lg font-bold">Sub-Models</h2>
      {subModels.map((subModel) => (
        <div className="mb-5 grid grid-cols-12 gap-5" key={subModel.id}>
          <div className="col-span-3">
            <div className="flex flex-col">
              <h3 className="mb-2">Parameters</h3>
              {parameters.map((parameter) => (
                <div
                  key={`${subModel.id}-${parameter.id}`}
                  className="mb-1 items-center"
                >
                  <Checkbox
                    label={parameter.name}
                    checked={subModel.parameterIds.includes(parameter.id)}
                    onChange={(checked) => {
                      handleClickSubModelParameters(
                        subModel.id,
                        parameter.id,
                        checked,
                      )
                    }}
                  />
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
    </Section>
  )
}

export default SubModelsSection

import {
  AugmentDiv,
  Checkbox,
  NumberInput,
  Section,
  Switch,
} from '../components'
import { useConfig } from '../features/config'
import { useModel } from '../features/model'

function SubModelsSection() {
  const { config, handlers: configHandlers } = useConfig()
  const { model, handlers: modelHandlers } = useModel()

  return (
    <Section>
      <div className="mb-5 flex items-center gap-5">
        <h2 className="w-30 text-lg font-bold">Sub-Models</h2>
        <div>
          <Switch
            label="Enable Sub-Models"
            checked={config.enableSubModels}
            onChange={(checked) => {
              configHandlers.handleChangeConfigCheckbox(
                'enableSubModels',
                checked,
              )
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-2">
        {config.enableSubModels &&
          model.subModels.map((subModel, i) => (
            <AugmentDiv
              key={subModel.id}
              title="Sub-Model"
              heading={`Sub-Model ${(i + 1).toString()}`}
              totalLength={model.subModels.length}
              maxLength={2}
              canRenderButtons={i + 1 === model.subModels.length}
              handleClickAdd={modelHandlers.handleClickAddSubModel}
              handleClickRemove={modelHandlers.handleClickRemoveSubModel}
            >
              <div className="grid grid-cols-2 items-center gap-5 border p-5 dark:border-gray-500">
                <div>
                  {model.parameters.map((parameter) => (
                    <div
                      key={`${subModel.id}-${parameter.id}`}
                      className="mb-1 items-center"
                    >
                      <Checkbox
                        label={parameter.name}
                        checked={subModel.parameterIds.includes(parameter.id)}
                        onChange={(checked) => {
                          modelHandlers.handleClickSubModelParameters(
                            subModel.id,
                            parameter.id,
                            checked,
                          )
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <NumberInput
                    label="Order"
                    value={subModel.order}
                    min={2}
                    max={model.parameters.length}
                    onChange={(e) => {
                      modelHandlers.handleChangeSubModelOrder(subModel.id, e)
                    }}
                  />
                </div>
              </div>
            </AugmentDiv>
          ))}
      </div>
    </Section>
  )
}

export default SubModelsSection

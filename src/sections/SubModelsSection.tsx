import { PlusIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { Button, Checkbox, NumberInput, Section, Switch } from '../components'
import { useConfig } from '../features/config'
import { useModel } from '../features/model'

function SubModelsSection() {
  const { config, handlers: configHandlers } = useConfig()
  const { model, handlers: modelHandlers } = useModel()
  const { parameters, subModels } = model
  const {
    handleClickSubModelParameters,
    handleChangeSubModelOrder,
    handleClickAddSubModel,
    handleClickRemoveSubModel,
  } = modelHandlers

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
          subModels.map((subModel, i) => (
            <div key={subModel.id} className="mb-5">
              <div className="flex h-10 border-collapse grid-cols-3 items-center justify-between border bg-gray-200 px-4 py-2 text-left font-bold dark:border-gray-500 dark:bg-gray-600 dark:text-white">
                <div>Sub-Model {i + 1}</div>
                {i + 1 === subModels.length ? (
                  <div className="flex gap-1">
                    <Button
                      type="secondary"
                      size="2xs"
                      disabled={subModels.length <= 1}
                      aria-label="Remove Sub-Model"
                      onClick={handleClickRemoveSubModel}
                    >
                      <XMarkIcon />
                    </Button>
                    <Button
                      type="secondary"
                      size="2xs"
                      disabled={subModels.length >= 2}
                      aria-label="Add Sub-Model"
                      onClick={handleClickAddSubModel}
                    >
                      <PlusIcon />
                    </Button>
                  </div>
                ) : (
                  ''
                )}
              </div>
              <div className="grid grid-cols-2 items-center gap-5 border p-5 dark:border-gray-500">
                <div>
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
                <div>
                  <NumberInput
                    label="Order"
                    value={subModel.order}
                    min={2}
                    max={parameters.length}
                    onChange={(e) => {
                      handleChangeSubModelOrder(subModel.id, e)
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </Section>
  )
}

export default SubModelsSection

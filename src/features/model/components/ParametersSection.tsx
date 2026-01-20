import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { AlertMessage, Section, TextInput } from '../../../shared/components'
import type { Model } from '../../../types'
import type { ModelHandlers } from '../types'

interface ParametersSectionProps {
  model: Model
  handlers: ModelHandlers
}

function ParametersSection({
  model,
  handlers: modelHandlers,
}: ParametersSectionProps) {
  return (
    <Section>
      <div className="mb-5 grid grid-cols-12 gap-1 sm:gap-5">
        <div className="col-span-12 sm:col-span-3">
          <h2 className="text-lg font-bold">Parameters</h2>
        </div>
        <div className="sm:col-span-2">
          <h2 className="text-lg font-bold">Values</h2>
        </div>
      </div>
      {model.parameters.map((parameter, i) => (
        <div
          className="mb-3 grid grid-cols-12 gap-0 sm:mb-1 sm:gap-5"
          key={parameter.id}
        >
          <div className="col-span-11 sm:col-span-3">
            <TextInput
              label={`Parameter ${(i + 1).toString()} Name`}
              value={parameter.name}
              isValid={parameter.isValidName}
              onChange={(e) => {
                modelHandlers.handleChangeParameter(parameter.id, 'name', e)
              }}
            />
          </div>
          <div className="col-span-11 sm:col-span-8">
            <TextInput
              label={`Parameter ${(i + 1).toString()} Values`}
              value={parameter.values}
              isValid={parameter.isValidValues}
              onChange={(e) => {
                modelHandlers.handleChangeParameter(parameter.id, 'values', e)
              }}
            />
          </div>
          <div className="col-span-1 flex gap-2">
            <ParameterMenu
              parameterId={parameter.id}
              parameterHeading={`Parameter ${(i + 1).toString()}`}
              parametersLength={model.parameters.length}
              handleClickAddRow={modelHandlers.handleClickAddRow}
              handleClickRemoveRow={modelHandlers.handleClickRemoveRow}
            />
          </div>
        </div>
      ))}
      <AlertMessage messages={model.parameterErrors} />
    </Section>
  )
}

interface ParameterMenuProps {
  parameterId: string
  parameterHeading: string
  parametersLength: number
  handleClickAddRow: (id: string, position: 'above' | 'below') => void
  handleClickRemoveRow: (id: string) => void
}

function ParameterMenu({
  parameterId,
  parameterHeading,
  parametersLength,
  handleClickAddRow,
  handleClickRemoveRow,
}: ParameterMenuProps) {
  return (
    <Menu>
      <MenuButton
        className="w-full cursor-pointer items-center rounded bg-gray-500 px-3 py-2 text-center text-white data-disabled:cursor-not-allowed data-disabled:opacity-50 data-hover:bg-gray-600 data-open:bg-gray-600"
        aria-label={`${parameterHeading} Edit Menu`}
      >
        ⋮
      </MenuButton>
      <MenuItems
        anchor="bottom start"
        className="mt-0.5 w-40 rounded border border-gray-400 bg-white py-2 dark:border-gray-500 dark:bg-gray-700 dark:text-white"
      >
        <MenuItem>
          <button
            type="button"
            disabled={parametersLength >= 50}
            className="w-full cursor-pointer px-4 py-1 text-left text-black hover:bg-gray-100 disabled:text-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-500"
            onClick={() => {
              handleClickAddRow(parameterId, 'above')
            }}
          >
            Insert Above
          </button>
        </MenuItem>
        <MenuItem>
          <button
            type="button"
            disabled={parametersLength >= 50}
            className="w-full cursor-pointer px-4 py-1 text-left text-black hover:bg-gray-100 disabled:text-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-500"
            onClick={() => {
              handleClickAddRow(parameterId, 'below')
            }}
          >
            Insert Below
          </button>
        </MenuItem>
        <MenuItem>
          <button
            type="button"
            disabled={parametersLength <= 1}
            className="w-full cursor-pointer px-4 py-1 text-left text-black hover:bg-gray-100 disabled:text-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-500"
            onClick={() => {
              handleClickRemoveRow(parameterId)
            }}
          >
            Delete Row
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  )
}

export default ParametersSection

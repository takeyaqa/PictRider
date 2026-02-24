import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import { QuestionMarkCircleIcon } from '@heroicons/react/16/solid'
import { AlertMessage, Section, TextInput } from '../../shared/components'
import type { Parameters } from '../../types'

interface ParametersSectionProps {
  parameters: Parameters
  onChangeParameter: (
    id: string,
    field: 'name' | 'values',
    value: string,
  ) => void
  onAddRow: (id: string, target: 'above' | 'below') => void
  onRemoveRow: (id: string) => void
}

function ParametersSection({
  parameters,
  onChangeParameter,
  onAddRow,
  onRemoveRow,
}: ParametersSectionProps) {
  return (
    <Section>
      <Disclosure>
        <div className="mb-5 grid grid-cols-12 gap-1 sm:gap-5">
          <div className="col-span-12 sm:col-span-3">
            <h2 className="text-lg font-bold">Parameters</h2>
          </div>
          <div className="sm:col-span-2">
            <h2 className="text-lg font-bold">Values</h2>
          </div>
          <div className="col-span-12 sm:col-span-7 sm:text-right">
            <DisclosureButton
              className="ml-auto flex cursor-pointer items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              aria-label="Toggle parameters help"
            >
              <QuestionMarkCircleIcon className="size-5" />
              <span>Help</span>
            </DisclosureButton>
          </div>
        </div>
        <DisclosurePanel className="mb-5 rounded border border-gray-300 bg-white p-4 text-sm dark:border-gray-500 dark:bg-gray-700">
          <h3 className="mb-2 font-bold">Parameter Input Format</h3>
          <p className="mb-2">Values delimited by commas.</p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <dt className="font-mono">Parameters</dt>
            <dd className="font-mono">Browser</dd>
            <dt className="font-mono">Values</dt>
            <dd className="font-mono">Firefox, Safari, Chrome</dd>
          </dl>
          <h4 className="mt-4 mb-2 font-bold">Aliasing</h4>
          <p>Aliasing lets you assign multiple names to one value.</p>
          <p>Aliases do not increase combinatorial complexity.</p>
          <p>
            Use <span className="font-mono">|</span> to separate names.
          </p>
          <p className="mb-2">
            Aliases are rotated across generated test cases.
          </p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <dt className="font-mono">Parameters</dt>
            <dd className="font-mono">Browser</dd>
            <dt className="font-mono">Values</dt>
            <dd className="font-mono">Firefox, Safari, Chrome | Chromium</dd>
          </dl>
        </DisclosurePanel>
      </Disclosure>
      {parameters.parameters.map((parameter, i) => (
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
                onChangeParameter(parameter.id, 'name', e.target.value)
              }}
            />
          </div>
          <div className="col-span-11 sm:col-span-8">
            <TextInput
              label={`Parameter ${(i + 1).toString()} Values`}
              value={parameter.values}
              isValid={parameter.isValidValues}
              onChange={(e) => {
                onChangeParameter(parameter.id, 'values', e.target.value)
              }}
            />
          </div>
          <div className="col-span-1 flex gap-2">
            <ParameterMenu
              parameterId={parameter.id}
              parameterHeading={`Parameter ${(i + 1).toString()}`}
              parametersLength={parameters.parameters.length}
              onAddRow={onAddRow}
              onRemoveRow={onRemoveRow}
            />
          </div>
        </div>
      ))}
      <AlertMessage messages={parameters.parameterErrors} />
    </Section>
  )
}

interface ParameterMenuProps {
  parameterId: string
  parameterHeading: string
  parametersLength: number
  onAddRow: (id: string, position: 'above' | 'below') => void
  onRemoveRow: (id: string) => void
}

function ParameterMenu({
  parameterId,
  parameterHeading,
  parametersLength,
  onAddRow,
  onRemoveRow,
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
        className="mt-0.5 w-40 rounded border border-gray-400 bg-white py-2 shadow-lg dark:border-gray-500 dark:bg-gray-700 dark:text-white"
      >
        <MenuItem>
          <button
            type="button"
            disabled={parametersLength >= 25}
            className="w-full cursor-pointer px-4 py-1 text-left text-black hover:bg-gray-100 disabled:text-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-500"
            onClick={() => {
              onAddRow(parameterId, 'above')
            }}
          >
            Insert Above
          </button>
        </MenuItem>
        <MenuItem>
          <button
            type="button"
            disabled={parametersLength >= 25}
            className="w-full cursor-pointer px-4 py-1 text-left text-black hover:bg-gray-100 disabled:text-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-500"
            onClick={() => {
              onAddRow(parameterId, 'below')
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
              onRemoveRow(parameterId)
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

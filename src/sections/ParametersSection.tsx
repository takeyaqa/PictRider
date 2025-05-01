import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { AlertMessage, Section, TextInput } from '../components'
import { Message, Parameter } from '../types'

interface ParametersSectionProps {
  parameters: Parameter[]
  messages: Message[]
  handleChangeParameter: (
    id: string,
    field: 'name' | 'values',
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void
  handleClickAddRow: (id: string, target: 'above' | 'below') => void
  handleClickRemoveRow: (id: string) => void
}

function ParametersSection({
  parameters,
  messages,
  handleChangeParameter,
  handleClickAddRow,
  handleClickRemoveRow,
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
      {parameters.map((p, index) => (
        <div
          className="mb-3 grid grid-cols-12 gap-0 sm:mb-1 sm:gap-5"
          key={p.id}
        >
          <div className="col-span-11 sm:col-span-3">
            <TextInput
              label={`Parameter ${(index + 1).toString()} Name`}
              value={p.name}
              isValid={p.isValidName}
              onChange={(e) => {
                handleChangeParameter(p.id, 'name', e)
              }}
            />
          </div>
          <div className="col-span-11 sm:col-span-8">
            <TextInput
              label={`Parameter ${(index + 1).toString()} Values`}
              value={p.values}
              isValid={p.isValidValues}
              onChange={(e) => {
                handleChangeParameter(p.id, 'values', e)
              }}
            />
          </div>
          <div className="col-span-1 flex gap-2">
            <Menu>
              <MenuButton
                className="w-full cursor-pointer items-center rounded bg-gray-500 px-3 py-2 text-center text-white data-disabled:cursor-not-allowed data-disabled:opacity-50 data-hover:bg-gray-600 data-open:bg-gray-600"
                aria-label={`Parameter ${(index + 1).toString()} Edit Menu`}
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
                    disabled={parameters.length >= 50}
                    className="w-full cursor-pointer px-4 py-1 text-left text-black hover:bg-gray-100 disabled:text-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-500"
                    onClick={() => {
                      handleClickAddRow(p.id, 'above')
                    }}
                  >
                    Insert Above
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    type="button"
                    disabled={parameters.length >= 50}
                    className="w-full cursor-pointer px-4 py-1 text-left text-black hover:bg-gray-100 disabled:text-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-500"
                    onClick={() => {
                      handleClickAddRow(p.id, 'below')
                    }}
                  >
                    Insert Below
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    type="button"
                    disabled={parameters.length <= 1}
                    className="w-full cursor-pointer px-4 py-1 text-left text-black hover:bg-gray-100 disabled:text-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-500"
                    onClick={() => {
                      handleClickRemoveRow(p.id)
                    }}
                  >
                    Delete Row
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      ))}
      <AlertMessage messages={messages} />
    </Section>
  )
}

export default ParametersSection

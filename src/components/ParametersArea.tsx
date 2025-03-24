import { PictParameter } from '../types'

interface ParametersAreaProps {
  parameters: PictParameter[]
  enabledConstraints: boolean
  onEnableConstraintsArea: () => void
  onInputChange: (
    id: string,
    field: 'name' | 'values',
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void
  onAddRow: () => void
  onRemoveRow: () => void
  onClearValues: () => void
}

function ParametersArea({
  parameters,
  enabledConstraints,
  onEnableConstraintsArea,
  onInputChange,
  onAddRow,
  onRemoveRow,
  onClearValues,
}: ParametersAreaProps) {
  return (
    <>
      <div className="flex flex-wrap -mx-2">
        <div className="w-1/6 px-2">
          <h5 className="text-lg font-medium">Parameters</h5>
        </div>
        <div className="w-1/2 px-2">
          <h5 className="text-lg font-medium">Values</h5>
        </div>
        <div className="w-1/3 px-2 flex space-x-2">
          <div className="relative inline-block">
            <input
              type="checkbox"
              className="sr-only peer"
              id="enable-constraints-button"
              autoComplete="off"
              checked={enabledConstraints}
              onChange={onEnableConstraintsArea}
            />
            <label
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 peer-checked:bg-blue-700"
              htmlFor="enable-constraints-button"
            >
              Constraints
            </label>
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={onAddRow}
          >
            Add Row
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onRemoveRow}
            disabled={parameters.length <= 1}
          >
            Remove Row
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            onClick={onClearValues}
          >
            Clear
          </button>
        </div>
      </div>
      {parameters.map((p) => (
        <div className="flex flex-wrap -mx-2 mt-2" key={p.id}>
          <div className="w-1/6 px-2">
            <input
              type="text"
              name="parameter_name"
              className={
                p.isValid
                  ? 'w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  : 'w-full px-3 py-2 border border-red-500 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
              }
              value={p.name}
              autoComplete="off"
              onChange={(e) => {
                onInputChange(p.id, 'name', e)
              }}
            />
          </div>
          <div className="w-5/6 px-2">
            <input
              type="text"
              name="parameter_values"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={p.values}
              autoComplete="off"
              onChange={(e) => {
                onInputChange(p.id, 'values', e)
              }}
            />
          </div>
        </div>
      ))}
    </>
  )
}

export default ParametersArea

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
      <div className="-mx-2 flex flex-wrap">
        <div className="w-1/6 px-2">
          <h5 className="text-lg font-medium">Parameters</h5>
        </div>
        <div className="w-1/2 px-2">
          <h5 className="text-lg font-medium">Values</h5>
        </div>
        <div className="flex w-1/3 space-x-2 px-2">
          <div className="relative inline-block">
            <input
              type="checkbox"
              className="peer sr-only"
              id="enable-constraints-button"
              autoComplete="off"
              checked={enabledConstraints}
              onChange={onEnableConstraintsArea}
            />
            <label
              className="inline-flex cursor-pointer items-center rounded bg-blue-500 px-4 py-2 text-white peer-checked:bg-blue-700 hover:bg-blue-600"
              htmlFor="enable-constraints-button"
            >
              Constraints
            </label>
          </div>
          <button
            type="button"
            className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            onClick={onAddRow}
          >
            Add Row
          </button>
          <button
            type="button"
            className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onRemoveRow}
            disabled={parameters.length <= 1}
          >
            Remove Row
          </button>
          <button
            type="button"
            className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
            onClick={onClearValues}
          >
            Clear
          </button>
        </div>
      </div>
      {parameters.map((p) => (
        <div className="-mx-2 mt-2 flex flex-wrap" key={p.id}>
          <div className="w-1/6 px-2">
            <input
              type="text"
              name="parameter_name"
              className={
                p.isValid
                  ? 'w-full rounded border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  : 'w-full rounded border border-red-500 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500 focus:outline-none'
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
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

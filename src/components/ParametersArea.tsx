import { PictParameter } from '../types'

interface ParametersAreaProps {
  parameters: PictParameter[]
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
  onInputChange,
  onAddRow,
  onRemoveRow,
  onClearValues,
}: ParametersAreaProps) {
  return (
    <section className="mx-2 mt-5 mb-5 rounded-md border-2 bg-gray-50 p-7 shadow-md md:mx-10">
      <div className="mb-5 grid grid-cols-12 gap-5">
        <div className="col-span-3">
          <h2 className="text-lg font-bold" id="parameters_label">
            Parameters
          </h2>
        </div>
        <div className="col-span-2">
          <h2 className="text-lg font-bold" id="values_label">
            Values
          </h2>
        </div>
        <div className="col-span-7 flex items-center justify-end gap-5">
          <button
            type="button"
            className="w-20 cursor-pointer rounded bg-gray-500 px-3 py-2 text-white hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 lg:w-30"
            onClick={onAddRow}
            disabled={parameters.length >= 50}
          >
            Add Row
          </button>
          <button
            type="button"
            className="w-20 cursor-pointer rounded bg-gray-500 px-3 py-2 text-white hover:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 lg:w-30"
            onClick={onRemoveRow}
            disabled={parameters.length <= 1}
          >
            Remove Row
          </button>
          <button
            type="button"
            className="w-20 cursor-pointer rounded bg-yellow-500 px-3 py-2 text-white hover:bg-yellow-600"
            onClick={onClearValues}
          >
            Clear
          </button>
        </div>
      </div>
      {parameters.map((p) => (
        <div className="mb-1 grid grid-cols-12 gap-5" key={p.id}>
          <div className="col-span-3">
            <input
              type="text"
              name="parameter_name"
              className={
                p.isValid
                  ? 'w-full rounded border border-black bg-white px-3 py-2 focus:border-transparent focus:ring-3 focus:ring-blue-500 focus:outline-none'
                  : 'w-full rounded border border-red-500 bg-white px-3 py-2 focus:border-transparent focus:ring-3 focus:ring-red-500 focus:outline-none'
              }
              value={p.name}
              autoComplete="off"
              aria-labelledby="parameters_label"
              onChange={(e) => {
                onInputChange(p.id, 'name', e)
              }}
            />
          </div>
          <div className="col-span-9">
            <input
              type="text"
              name="parameter_values"
              className="w-full rounded border border-black bg-white px-3 py-2 focus:border-transparent focus:ring-3 focus:ring-blue-500 focus:outline-none"
              value={p.values}
              autoComplete="off"
              aria-labelledby="values_label"
              onChange={(e) => {
                onInputChange(p.id, 'values', e)
              }}
            />
          </div>
        </div>
      ))}
    </section>
  )
}

export default ParametersArea

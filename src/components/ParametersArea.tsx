import { PictParameter } from '../pict/pict-types'

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
      <div className="row">
        <div className="col-2">
          <h5>Parameters</h5>
        </div>
        <div className="col-6">
          <h5>Values</h5>
        </div>
        <div className="col-4">
          <input
            type="checkbox"
            className="btn-check"
            id="enable-constraints-button"
            autoComplete="off"
            checked={enabledConstraints}
            onChange={onEnableConstraintsArea}
          />
          <label
            className="btn btn-primary"
            htmlFor="enable-constraints-button"
          >
            Constraints
          </label>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onAddRow}
          >
            Add Row
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onRemoveRow}
            disabled={parameters.length <= 1}
          >
            Remove Row
          </button>
          <button
            type="button"
            className="btn btn-warning"
            onClick={onClearValues}
          >
            Clear
          </button>
        </div>
      </div>
      {parameters.map((m) => (
        <div className="row" key={m.id}>
          <div className="col-2">
            <input
              type="text"
              name="parameter_name"
              className={m.isValid ? 'form-control' : 'form-control is-invalid'}
              value={m.name}
              autoComplete="off"
              onChange={(e) => {
                onInputChange(m.id, 'name', e)
              }}
            />
          </div>
          <div className="col-10">
            <input
              type="text"
              name="parameter_values"
              className="form-control"
              value={m.values}
              autoComplete="off"
              onChange={(e) => {
                onInputChange(m.id, 'values', e)
              }}
            />
          </div>
        </div>
      ))}
    </>
  )
}

export default ParametersArea

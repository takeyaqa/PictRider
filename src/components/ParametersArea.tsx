import { PictParameter } from '../pict/pict-types'

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
    <>
      <div className="row">
        <div className="col-2">
          <h5>パラメータ</h5>
        </div>
        <div className="col-7">
          <h5>値の並び</h5>
        </div>
        <div className="col-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onAddRow}
          >
            行を追加
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onRemoveRow}
            disabled={parameters.length <= 1}
          >
            行を削除
          </button>
          <button
            type="button"
            className="btn btn-warning"
            onClick={onClearValues}
          >
            クリア
          </button>
        </div>
      </div>
      {parameters.map((m) => (
        <div className="row" key={m.id}>
          <div className="col-2">
            <input
              type="text"
              className="form-control"
              value={m.name}
              onChange={(e) => {
                onInputChange(m.id, 'name', e)
              }}
            />
          </div>
          <div className="col-10">
            <input
              type="text"
              className="form-control"
              value={m.values}
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

import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { PictParameter } from './pict/pict-types'

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

export function ParametersArea({
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

function App() {
  const INITIAL_PARAMETERS = [
    {
      id: uuidv4(),
      name: 'Type',
      values: 'Single, Span, Stripe, Mirror, RAID-5',
    },
    {
      id: uuidv4(),
      name: 'Size',
      values: '10, 100, 500, 1000, 5000, 10000, 40000',
    },
    { id: uuidv4(), name: 'Format method', values: 'Quick, Slow' },
    { id: uuidv4(), name: 'File system', values: 'FAT, FAT32, NTFS' },
    { id: uuidv4(), name: 'Cluster size', values: 'Quick, Slow' },
    { id: uuidv4(), name: 'Compression', values: 'ON, OFF' },
  ]

  const [parameters, setParameters] = useState(INITIAL_PARAMETERS)

  function handleParameterInputChange(
    id: string,
    field: 'name' | 'values',
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const newParameters = [...parameters]
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    newParameters.find((p) => p.id === id)![field] = e.target.value
    setParameters(newParameters)
  }

  function addParameterInputRow() {
    setParameters([...parameters, { id: uuidv4(), name: '', values: '' }])
  }

  function removeParameterInputRow() {
    if (parameters.length > 1) {
      const newParameters = [...parameters]
      newParameters.pop()
      setParameters(newParameters)
    }
  }

  function clearAllParameterValues() {
    const emptyParameters = parameters.map(() => ({
      id: uuidv4(),
      name: '',
      values: '',
    }))
    setParameters(emptyParameters)
  }

  return (
    <div className="container">
      <h1>PictRider</h1>
      <ParametersArea
        parameters={parameters}
        onInputChange={handleParameterInputChange}
        onAddRow={addParameterInputRow}
        onRemoveRow={removeParameterInputRow}
        onClearValues={clearAllParameterValues}
      />
    </div>
  )
}

export default App

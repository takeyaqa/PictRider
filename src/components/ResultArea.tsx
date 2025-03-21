import { PictOutput } from '../types'

interface ResultAreaProps {
  output: PictOutput | null
}

function ResultArea({ output }: ResultAreaProps) {
  if (!output) {
    return null
  }
  return (
    <div className="row mt-3">
      <div className="col-12">
        <h4>Result</h4>
        <table className="table">
          <thead>
            <tr>
              {output.header.map((h) => (
                <th key={h.id}>{h.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {output.body.map((row) => (
              <tr key={row.id}>
                {row.values.map((col) => (
                  <td key={col.id}>{col.value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ResultArea

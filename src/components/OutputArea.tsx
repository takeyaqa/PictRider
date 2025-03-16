import { PictOutput } from '../pict/pict-types'

interface OutputAreaProps {
  output: PictOutput | null
}

function OutputArea({ output }: OutputAreaProps) {
  if (!output) {
    return null
  }
  return (
    <div className="row mt-3">
      <div className="col-12">
        <h4>出力</h4>
        <table className="table">
          <thead>
            <tr>
              {output.header.map((h, i) => (
                // eslint-disable-next-line react-x/no-array-index-key
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {output.body.map((b, i) => (
              // eslint-disable-next-line react-x/no-array-index-key
              <tr key={i}>
                {b.map((b, j) => (
                  // eslint-disable-next-line react-x/no-array-index-key
                  <td key={j}>{b}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OutputArea

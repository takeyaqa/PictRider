import { PictOutput } from '../types'

interface ResultAreaProps {
  output: PictOutput | null
}

function ResultArea({ output }: ResultAreaProps) {
  if (!output) {
    return null
  }

  return (
    <div className="mt-6">
      <div className="w-full">
        <h4 className="text-xl font-medium mb-3">Result</h4>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">#</th>
                {output.header.map((h) => (
                  <th key={h.id} className="border px-4 py-2 text-left">
                    {h.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {output.body.map((row, index) => (
                <tr
                  key={row.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <th className="border px-4 py-2 text-left font-medium">
                    {row.id}
                  </th>
                  {row.values.map((col) => (
                    <td key={col.id} className="border px-4 py-2">
                      {col.value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ResultArea

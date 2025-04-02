import { PictOutput } from '../types'

interface ResultAreaProps {
  output: PictOutput | null
}

function ResultArea({ output }: ResultAreaProps) {
  if (!output) {
    return null
  }

  return (
    <section className="mx-2 mb-10 rounded-md border-2 bg-gray-50 p-7 shadow-md md:mx-10">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <caption className="mb-3 text-left text-xl font-bold">Result</caption>
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black px-4 py-2 text-left font-bold">
                #
              </th>
              {output.header.map((h) => (
                <th
                  key={h.id}
                  className="border border-black px-4 py-2 text-left"
                >
                  {h.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {output.body.map((row) => (
              <tr key={row.id} className="bg-white">
                <th className="border border-black px-4 py-2 text-left font-bold">
                  {row.id}
                </th>
                {row.values.map((col) => (
                  <td key={col.id} className="border border-black px-4 py-2">
                    {col.value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default ResultArea

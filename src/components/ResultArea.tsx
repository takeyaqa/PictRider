import { PictOutput } from '../types'

interface ResultAreaProps {
  output: PictOutput | null
}

function ResultArea({ output }: ResultAreaProps) {
  function handleDownloadCSV() {
    if (!output) {
      return
    }

    // Create CSV content
    const headerRow = output.header.map((h) => `"${h.name}"`).join(',')
    const bodyRows = output.body.map((row) =>
      row.values.map((col) => `"${col.value}"`).join(','),
    )
    const csvContent = [headerRow, ...bodyRows].join('\n')

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'result.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  if (!output) {
    return null
  }

  return (
    <section className="mx-2 mb-10 rounded-md border-2 bg-gray-50 p-7 shadow-md md:mx-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold" id="result_heading">
          Result
        </h2>
        <button
          type="button"
          className="cursor-pointer rounded bg-green-600 px-3 py-2 text-white hover:bg-green-700"
          onClick={handleDownloadCSV}
        >
          CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table
          className="w-full table-fixed border-collapse"
          aria-labelledby="result_heading"
        >
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

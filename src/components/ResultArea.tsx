import { PictConfig, PictOutput } from '../types'

function createCsvContent(output: PictOutput) {
  const headerRow = output.header.map((h) => `"${h.name}"`).join(',')
  const bodyRows = output.body.map((row) =>
    row.values.map((col) => `"${col.value}"`).join(','),
  )
  return [headerRow, ...bodyRows].join('\n')
}

function createTsvContent(output: PictOutput) {
  const headerRow = output.header.map((h) => h.name).join('\t')
  const bodyRows = output.body.map((row) =>
    row.values.map((col) => col.value).join('\t'),
  )
  return [headerRow, ...bodyRows].join('\n')
}

interface ResultAreaProps {
  config: PictConfig
  output: PictOutput | null
}

function ResultArea({ config, output }: ResultAreaProps) {
  function handleDownload(type: 'csv' | 'tsv') {
    if (!output) {
      return
    }

    const content =
      type === 'csv' ? createCsvContent(output) : createTsvContent(output)
    const mimeType = type === 'csv' ? 'text/csv' : 'text/tab-separated-values'
    const fileName = type === 'csv' ? 'result.csv' : 'result.tsv'

    // Create a blob and download link
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!output) {
    return null
  }

  let modelFile = <></>
  if (config.showModelFile) {
    modelFile = (
      <div>
        <h2 className="text-xl font-bold" id="model_label">
          Model File
        </h2>
        <div>
          <pre className="my-3 rounded-md border-2 bg-white p-4 font-mono">
            {output.modelFile}
          </pre>
        </div>
      </div>
    )
  }

  return (
    <section className="mx-2 mb-10 rounded-md border-2 bg-gray-50 p-7 shadow-md md:mx-10">
      {modelFile}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold" id="result_heading">
          Result
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            className="cursor-pointer rounded bg-green-600 px-3 py-2 text-white hover:bg-green-700"
            onClick={() => {
              handleDownload('csv')
            }}
          >
            CSV
          </button>
          <button
            type="button"
            className="cursor-pointer rounded bg-green-600 px-3 py-2 text-white hover:bg-green-700"
            onClick={() => {
              handleDownload('tsv')
            }}
          >
            TSV
          </button>
        </div>
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

import { AlertMessage, Button, Section } from '../components'
import { Config, Result } from '../types'

function createCsvContent(result: Result) {
  const headerRow = result.header.map((h) => `"${h.name}"`).join(',')
  const bodyRows = result.body.map((row) =>
    row.values.map((col) => `"${col.value}"`).join(','),
  )
  return [headerRow, ...bodyRows].join('\n')
}

function createTsvContent(result: Result) {
  const headerRow = result.header.map((h) => h.name).join('\t')
  const bodyRows = result.body.map((row) =>
    row.values.map((col) => col.value).join('\t'),
  )
  return [headerRow, ...bodyRows].join('\n')
}

interface ResultSectionProps {
  config: Config
  result: Result | null
}

function ResultSection({ config, result }: ResultSectionProps) {
  function handleDownload(type: 'csv' | 'tsv') {
    if (!result) {
      return
    }

    const content =
      type === 'csv' ? createCsvContent(result) : createTsvContent(result)
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

  if (!result) {
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
            {result.modelFile}
          </pre>
        </div>
      </div>
    )
  }

  return (
    <Section>
      {modelFile}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold" id="result_heading">
          Result
        </h2>
        <div className="flex gap-2">
          <Button
            type="success"
            label="CSV"
            size="sm"
            onClick={() => {
              handleDownload('csv')
            }}
          />
          <Button
            type="success"
            label="TSV"
            size="sm"
            onClick={() => {
              handleDownload('tsv')
            }}
          />
        </div>
      </div>
      <AlertMessage messages={result.messages} />
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
              {result.header.map((h) => (
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
            {result.body.map((row) => (
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
    </Section>
  )
}

export default ResultSection

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { AlertMessage, Section } from '../../../shared/components'
import { useConfig } from '../../config'
import type { Result } from '../../../types'

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
  result: Result | null
}

function ResultSection({ result }: ResultSectionProps) {
  const { config } = useConfig()

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

  return (
    <Section>
      {config.showModelFile && <ModelFile modelFile={result.modelFile} />}
      <div className="mb-4 grid grid-cols-2 items-center">
        <h2
          className="justify-self-start text-xl font-bold"
          id="result_heading"
        >
          Result
        </h2>
        <div className="justify-self-end">
          <DownloadMenu handleDownload={handleDownload} />
        </div>
      </div>
      <AlertMessage messages={result.messages} />
      <div className="overflow-x-auto">
        <table
          className="min-w-full border-collapse text-left"
          aria-labelledby="result_heading"
        >
          <thead>
            <tr className="bg-gray-100 font-bold dark:bg-gray-600">
              <th className="border border-black px-1 py-2 sm:px-4 dark:border-gray-500">
                #
              </th>
              {result.header.map((h) => (
                <th
                  key={h.id}
                  className="border border-black px-1 py-2 sm:px-4 dark:border-gray-500"
                >
                  {h.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.body.map((row, i) => (
              <tr key={row.id} className="bg-white dark:bg-gray-600">
                <th className="border border-black px-1 py-2 font-bold sm:px-4 dark:border-gray-500">
                  {i + 1}
                </th>
                {row.values.map((col) => (
                  <td
                    key={col.id}
                    className="border border-black px-1 py-2 sm:px-4 dark:border-gray-500"
                  >
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

interface ModelFileProps {
  modelFile: string
}

function ModelFile({ modelFile }: ModelFileProps) {
  return (
    <div>
      <h2 className="text-xl font-bold">Model File</h2>
      <div>
        <pre className="my-3 overflow-x-auto rounded-md border-2 bg-white p-4 font-mono dark:border-gray-500 dark:bg-gray-600 dark:text-white">
          {modelFile}
        </pre>
      </div>
    </div>
  )
}

interface DownloadMenuProps {
  handleDownload: (type: 'csv' | 'tsv') => void
}

function DownloadMenu({ handleDownload }: DownloadMenuProps) {
  return (
    <Menu>
      <MenuButton className="center flex w-30 cursor-pointer items-center justify-center rounded bg-green-700 px-3 py-2 text-white data-disabled:cursor-not-allowed data-disabled:opacity-50 data-hover:bg-green-800 data-open:bg-green-800">
        Download
        <ChevronDownIcon className="ml-1 inline size-5 fill-white" />
      </MenuButton>
      <MenuItems
        anchor="bottom start"
        className="mt-0.5 rounded border border-gray-400 bg-white py-2 dark:border-gray-500 dark:bg-gray-700 dark:text-white"
      >
        <MenuItem>
          <button
            type="button"
            className="w-full cursor-pointer px-4 py-1 text-left text-black hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-500"
            onClick={() => {
              handleDownload('csv')
            }}
          >
            CSV
          </button>
        </MenuItem>
        <MenuItem>
          <button
            type="button"
            className="w-full cursor-pointer px-4 py-1 text-left text-black hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-500"
            onClick={() => {
              handleDownload('tsv')
            }}
          >
            TSV
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  )
}

export default ResultSection

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/unbound-method */
import { PictRunner } from '@takeyaqa/pict-wasm'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import App from './App'

describe('App', () => {
  describe('Run Pict', () => {
    let screen: ReturnType<typeof render>
    let pictRunnerMock: PictRunner

    beforeEach(() => {
      const PictRunnerMock = vi.fn()
      PictRunnerMock.prototype.init = vi.fn()
      PictRunnerMock.prototype.run = vi.fn(() => ({
        header: ['Type', 'Size', 'Format method'],
        body: [
          ['Single', '10', 'Quick'],
          ['Span', '100', 'Slow'],
        ],
      }))
      pictRunnerMock = new PictRunnerMock()
      screen = render(<App pictRunnerInjection={pictRunnerMock} />)
    })

    afterEach(() => {
      vi.clearAllMocks()
    })

    it('Should display result table', async () => {
      // act - click the run button
      await screen.getByRole('button', { name: 'Run' }).click()

      // assert - check result table
      await expect.element(screen.getByRole('alert')).not.toBeInTheDocument()
      await expect
        .element(screen.getByRole('table', { name: 'Result' }))
        .toBeInTheDocument()
      // await expect
      //   .element(screen.getByRole('columnheader', { name: 'Type' }))
      //   .toBeInTheDocument()
      await expect
        .element(screen.getByRole('cell', { name: '100' }))
        .toBeInTheDocument()

      // Check that the Download buttons are present
      await expect
        .element(screen.getByRole('button', { name: 'Download' }))
        .toBeInTheDocument()
    })

    it('Should have Download buttons that are enabled after running PICT', async () => {
      // Run PICT to get results
      await screen.getByRole('button', { name: 'Run' }).click()

      // Get the Download button and verify it exists and is enabled
      const csvButton = screen.getByRole('button', { name: 'Download' })
      await expect.element(csvButton).toBeInTheDocument()
      await expect.element(csvButton).not.toBeDisabled()
    })

    it('Should clear results when clicking the Clear Result button', async () => {
      // Run PICT to get results
      await screen.getByRole('button', { name: 'Run' }).click()

      // Verify result table is displayed
      await expect
        .element(screen.getByRole('table', { name: 'Result' }))
        .toBeInTheDocument()

      // Click the Clear Result button
      await screen.getByRole('button', { name: 'Clear Result' }).click()

      // Verify result table is no longer displayed
      await expect
        .element(screen.getByRole('table', { name: 'Result' }))
        .not.toBeInTheDocument()
    })

    it('Should call with parameters when input default value', async () => {
      // act - click the run button
      await screen.getByRole('button', { name: 'Run' }).click()

      // assert - check result table
      expect(pictRunnerMock.run).toHaveBeenCalledWith(
        [
          {
            name: 'Type',
            values: 'Single, Span, Stripe, Mirror, RAID-5',
          },
          {
            name: 'Size',
            values: '10, 100, 500, 1000, 5000, 10000, 40000',
          },
          {
            name: 'Format method',
            values: 'Quick, Slow',
          },
          {
            name: 'File system',
            values: 'FAT, FAT32, NTFS',
          },
          {
            name: 'Cluster size',
            values: '512, 1024, 2048, 4096, 8192, 16384, 32768, 65536',
          },
          { name: 'Compression', values: 'ON, OFF' },
        ],
        expect.anything(),
      )
    })

    it('Should call with parameters when add empty row', async () => {
      // arrange - add empty row
      await screen
        .getByRole('button', { name: 'Parameter 6 Edit Menu' })
        .click()
      await screen.getByRole('menuitem', { name: 'Insert Below' }).click()

      // act - click the run button
      await screen.getByRole('button', { name: 'Run' }).click()

      // assert - check result table
      expect(pictRunnerMock.run).toHaveBeenCalledWith(
        [
          {
            name: 'Type',
            values: 'Single, Span, Stripe, Mirror, RAID-5',
          },
          {
            name: 'Size',
            values: '10, 100, 500, 1000, 5000, 10000, 40000',
          },
          {
            name: 'Format method',
            values: 'Quick, Slow',
          },
          {
            name: 'File system',
            values: 'FAT, FAT32, NTFS',
          },
          {
            name: 'Cluster size',
            values: '512, 1024, 2048, 4096, 8192, 16384, 32768, 65536',
          },
          { name: 'Compression', values: 'ON, OFF' },
          // empty row is ignored
        ],
        expect.anything(),
      )
    })

    it('Should call with parameters when delete existing row', async () => {
      // arrange - delete existing row
      await screen
        .getByRole('button', { name: 'Parameter 6 Edit Menu' })
        .click()
      await screen.getByRole('menuitem', { name: 'Delete Row' }).click()

      // act - click the run button
      await screen.getByRole('button', { name: 'Run' }).click()

      // assert - check result table
      expect(pictRunnerMock.run).toHaveBeenCalledWith(
        [
          {
            name: 'Type',
            values: 'Single, Span, Stripe, Mirror, RAID-5',
          },
          {
            name: 'Size',
            values: '10, 100, 500, 1000, 5000, 10000, 40000',
          },
          {
            name: 'Format method',
            values: 'Quick, Slow',
          },
          {
            name: 'File system',
            values: 'FAT, FAT32, NTFS',
          },
          {
            name: 'Cluster size',
            values: '512, 1024, 2048, 4096, 8192, 16384, 32768, 65536',
          },
        ],
        expect.anything(),
      )
    })

    it('Should call with parameters when editing value', async () => {
      // arrange - edit existing value
      const input = screen.getByRole('textbox', { name: 'Parameter 1 Values' })
      await input.clear()
      await input.fill('Double, Span, Stripe, Mirror, RAID-5000')

      // act - click the run button
      await screen.getByRole('button', { name: 'Run' }).click()

      // assert - check result table
      expect(pictRunnerMock.run).toHaveBeenCalledWith(
        [
          {
            name: 'Type',
            values: 'Double, Span, Stripe, Mirror, RAID-5000',
          },
          {
            name: 'Size',
            values: '10, 100, 500, 1000, 5000, 10000, 40000',
          },
          {
            name: 'Format method',
            values: 'Quick, Slow',
          },
          {
            name: 'File system',
            values: 'FAT, FAT32, NTFS',
          },
          {
            name: 'Cluster size',
            values: '512, 1024, 2048, 4096, 8192, 16384, 32768, 65536',
          },
          { name: 'Compression', values: 'ON, OFF' },
        ],
        expect.anything(),
      )
    })

    it('Should call with parameters when editing parameter to empty', async () => {
      // arrange - edit existing value
      const input = screen.getByRole('textbox', { name: 'Parameter 2 Name' })
      await input.clear()

      // act - click the run button
      await screen.getByRole('button', { name: 'Run' }).click()

      // assert - check result table
      expect(pictRunnerMock.run).toHaveBeenCalledWith(
        [
          {
            name: 'Type',
            values: 'Single, Span, Stripe, Mirror, RAID-5',
          },
          // empty parameter is ignored
          {
            name: 'Format method',
            values: 'Quick, Slow',
          },
          {
            name: 'File system',
            values: 'FAT, FAT32, NTFS',
          },
          {
            name: 'Cluster size',
            values: '512, 1024, 2048, 4096, 8192, 16384, 32768, 65536',
          },
          { name: 'Compression', values: 'ON, OFF' },
        ],
        expect.anything(),
      )
    })

    it('Should call with parameters when editing values to empty', async () => {
      // arrange - edit existing value
      const input = screen.getByRole('textbox', { name: 'Parameter 3 Values' })
      await input.clear()

      // act - click the run button
      await screen.getByRole('button', { name: 'Run' }).click()

      // assert - check result table
      expect(pictRunnerMock.run).toHaveBeenCalledWith(
        [
          {
            name: 'Type',
            values: 'Single, Span, Stripe, Mirror, RAID-5',
          },
          {
            name: 'Size',
            values: '10, 100, 500, 1000, 5000, 10000, 40000',
          },
          // empty values is ignored
          {
            name: 'File system',
            values: 'FAT, FAT32, NTFS',
          },
          {
            name: 'Cluster size',
            values: '512, 1024, 2048, 4096, 8192, 16384, 32768, 65536',
          },
          { name: 'Compression', values: 'ON, OFF' },
        ],
        expect.anything(),
      )
    })

    it('Should call with sub-models when enable sub-models', async () => {
      // arrange - enable sub-models
      await screen.getByRole('switch', { name: 'Enable Sub-Models' }).click()

      await screen.getByRole('checkbox', { name: 'Type' }).nth(0).click()
      await screen.getByRole('checkbox', { name: 'Size' }).nth(0).click()
      await screen
        .getByRole('checkbox', { name: 'Format method' })
        .nth(0)
        .click()
      await screen.getByRole('spinbutton', { name: 'Order' }).nth(0).clear()
      await screen.getByRole('spinbutton', { name: 'Order' }).nth(0).fill('3')

      // act - click the run button
      await screen.getByRole('button', { name: 'Run' }).click()

      // assert - check result table
      expect(pictRunnerMock.run).toHaveBeenCalledWith(
        [
          {
            name: 'Type',
            values: 'Single, Span, Stripe, Mirror, RAID-5',
          },
          {
            name: 'Size',
            values: '10, 100, 500, 1000, 5000, 10000, 40000',
          },
          {
            name: 'Format method',
            values: 'Quick, Slow',
          },
          {
            name: 'File system',
            values: 'FAT, FAT32, NTFS',
          },
          {
            name: 'Cluster size',
            values: '512, 1024, 2048, 4096, 8192, 16384, 32768, 65536',
          },
          { name: 'Compression', values: 'ON, OFF' },
        ],
        {
          subModels: [
            {
              parameterNames: ['Type', 'Size', 'Format method'],
              order: 3,
            },
          ],
          options: expect.anything(),
        },
      )
    })

    it('Should call with sub-models when enable sub-models and delete parameter rows', async () => {
      // arrange - enable sub-models
      await screen.getByRole('switch', { name: 'Enable Sub-Models' }).click()

      await screen.getByRole('checkbox', { name: 'Type' }).nth(0).click()
      await screen.getByRole('checkbox', { name: 'Size' }).nth(0).click()
      await screen
        .getByRole('checkbox', { name: 'Format method' })
        .nth(0)
        .click()
      await screen.getByRole('spinbutton', { name: 'Order' }).nth(0).clear()
      await screen.getByRole('spinbutton', { name: 'Order' }).nth(0).fill('3')

      // act - click the run button
      await screen
        .getByRole('button', { name: 'Parameter 6 Edit Menu' })
        .click()

      await screen.getByRole('menuitem', { name: 'Delete Row' }).click()
      await screen.getByRole('button', { name: 'Run' }).click()

      // assert - check result table
      expect(pictRunnerMock.run).toHaveBeenCalledWith(
        [
          {
            name: 'Type',
            values: 'Single, Span, Stripe, Mirror, RAID-5',
          },
          {
            name: 'Size',
            values: '10, 100, 500, 1000, 5000, 10000, 40000',
          },
          {
            name: 'Format method',
            values: 'Quick, Slow',
          },
          {
            name: 'File system',
            values: 'FAT, FAT32, NTFS',
          },
          {
            name: 'Cluster size',
            values: '512, 1024, 2048, 4096, 8192, 16384, 32768, 65536',
          },
        ],
        {
          subModels: [
            {
              parameterNames: ['Type', 'Size', 'Format method'],
              order: 3,
            },
          ],
          options: expect.anything(),
        },
      )
    })

    it('Should call with constraints when constraints direct editing mode', async () => {
      // arrange
      await screen.getByRole('switch', { name: 'Enable Constraints' }).click()
      await screen.getByRole('button', { name: 'Edit Directly' }).click()

      // act
      await screen
        .getByRole('textbox', { name: 'Constraint Formula' })
        .fill('IF [Type] = "RAID-5" THEN [Size] > 1000;')
      await screen.getByRole('button', { name: 'Run' }).click()

      // assert
      expect(pictRunnerMock.run).toHaveBeenCalledWith(
        [
          {
            name: 'Type',
            values: 'Single, Span, Stripe, Mirror, RAID-5',
          },
          {
            name: 'Size',
            values: '10, 100, 500, 1000, 5000, 10000, 40000',
          },
          {
            name: 'Format method',
            values: 'Quick, Slow',
          },
          {
            name: 'File system',
            values: 'FAT, FAT32, NTFS',
          },
          {
            name: 'Cluster size',
            values: '512, 1024, 2048, 4096, 8192, 16384, 32768, 65536',
          },
          { name: 'Compression', values: 'ON, OFF' },
        ],
        {
          constraintsText: 'IF [Type] = "RAID-5" THEN [Size] > 1000;',
          options: expect.anything(),
        },
      )
    })
  })
})

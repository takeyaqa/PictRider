/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import '@testing-library/jest-dom/vitest'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App.tsx'
import { PictRunner } from '../src/pict/pict-runner.ts'

describe('App', () => {
  describe('ParametersArea', () => {
    let user: any

    beforeEach(() => {
      user = userEvent.setup()
      render(<App />)
    })

    afterEach(() => {
      cleanup()
    })

    it('Should display PictRider title and default parameter values', () => {
      // assert - only checking default text and values
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'PictRider',
      )
      expect(screen.getAllByRole('textbox')).toHaveLength(12)
      expect(screen.getAllByRole('textbox')[0]).toHaveValue('Type')
      expect(screen.getAllByRole('textbox')[1]).toHaveValue(
        'Single, Span, Stripe, Mirror, RAID-5',
      )
      expect(screen.getAllByRole('textbox')[10]).toHaveValue('Compression')
      expect(screen.getAllByRole('textbox')[11]).toHaveValue('ON, OFF')
    })

    it('Should add a new parameter row when clicking the add row button', async () => {
      // act
      await user.click(screen.getByText('行を追加'))

      // assert - check count and default values (new row should be empty)
      expect(screen.getAllByRole('textbox')).toHaveLength(14)
      expect(screen.getAllByRole('textbox')[0]).toHaveValue('Type')
      expect(screen.getAllByRole('textbox')[1]).toHaveValue(
        'Single, Span, Stripe, Mirror, RAID-5',
      )
      expect(screen.getAllByRole('textbox')[10]).toHaveValue('Compression')
      expect(screen.getAllByRole('textbox')[11]).toHaveValue('ON, OFF')
      expect(screen.getAllByRole('textbox')[12]).toHaveValue('')
      expect(screen.getAllByRole('textbox')[13]).toHaveValue('')
    })

    it('Should remove a parameter row when clicking the delete row button', async () => {
      // act
      await user.click(screen.getByText('行を削除'))

      // assert - check count and default values
      expect(screen.getAllByRole('textbox')).toHaveLength(10)
      expect(screen.getAllByRole('textbox')[0]).toHaveValue('Type')
      expect(screen.getAllByRole('textbox')[1]).toHaveValue(
        'Single, Span, Stripe, Mirror, RAID-5',
      )
      expect(screen.getAllByRole('textbox')[8]).toHaveValue('Cluster size')
      expect(screen.getAllByRole('textbox')[9]).toHaveValue('Quick, Slow')
    })

    it('Should disable delete row button when only one low', async () => {
      // act - delete rows until only one row is left
      await user.click(screen.getByText('行を削除'))
      await user.click(screen.getByText('行を削除'))
      await user.click(screen.getByText('行を削除'))
      await user.click(screen.getByText('行を削除'))
      await user.click(screen.getByText('行を削除'))

      // assert
      expect(screen.getByText('行を削除')).toBeDisabled()
    })

    it('Should clear all parameter values when clicking the clear button', async () => {
      // act
      await user.click(screen.getByText('クリア'))

      // assert - check count is not changed but values is empty
      expect(screen.getAllByRole('textbox')).toHaveLength(12)
      expect(screen.getAllByRole('textbox')[0]).toHaveValue('')
      expect(screen.getAllByRole('textbox')[1]).toHaveValue('')
      expect(screen.getAllByRole('textbox')[10]).toHaveValue('')
      expect(screen.getAllByRole('textbox')[11]).toHaveValue('')
    })

    it('Should handle adding and removing multiple parameter rows', async () => {
      // Initial state - 12 textbox (6 parameter rows)
      expect(screen.getAllByRole('textbox')).toHaveLength(12)

      // Add 3 rows
      // act - add first row
      await user.click(screen.getByText('行を追加'))
      // assert
      expect(screen.getAllByRole('textbox')).toHaveLength(14)

      // act - add second row
      await user.click(screen.getByText('行を追加'))
      // assert
      expect(screen.getAllByRole('textbox')).toHaveLength(16)

      // act - add third row
      await user.click(screen.getByText('行を追加'))
      // assert
      expect(screen.getAllByRole('textbox')).toHaveLength(18)

      // Now remove 2 rows
      // act - remove first row
      await user.click(screen.getByText('行を削除'))
      // assert
      expect(screen.getAllByRole('textbox')).toHaveLength(16)

      // act - remove second row
      await user.click(screen.getByText('行を削除'))
      // assert
      expect(screen.getAllByRole('textbox')).toHaveLength(14)

      // Verify we still have the correct values in the remaining textbox
      expect(screen.getAllByRole('textbox')[0]).toHaveValue('Type')
      expect(screen.getAllByRole('textbox')[1]).toHaveValue(
        'Single, Span, Stripe, Mirror, RAID-5',
      )
      expect(screen.getAllByRole('textbox')[12]).toHaveValue('')
      expect(screen.getAllByRole('textbox')[13]).toHaveValue('')
    })
  })

  describe('OutputArea', () => {
    let user: any
    let pictRunner: PictRunner

    beforeEach(() => {
      vi.mock('../src/pict/pict-runner.ts', () => {
        const PictRunner = vi.fn()
        PictRunner.prototype.init = vi.fn()
        PictRunner.prototype.run = vi.fn(() => ({
          header: ['Type', 'Size', 'Format method'],
          body: [
            ['Single', '10', 'Quick'],
            ['Span', '100', 'Slow'],
          ],
        }))

        return { PictRunner }
      })
      pictRunner = new PictRunner()
      user = userEvent.setup()
      render(<App />)
    })

    afterEach(() => {
      cleanup()
      vi.clearAllMocks()
    })

    it('Should display result table when input default value', async () => {
      // act - click the run button
      await user.click(screen.getByText('実行'))

      // assert - check result table
      expect(pictRunner.run).toHaveBeenCalledWith([
        {
          id: expect.any(String),
          name: 'Type',
          values: 'Single, Span, Stripe, Mirror, RAID-5',
        },
        {
          id: expect.any(String),
          name: 'Size',
          values: '10, 100, 500, 1000, 5000, 10000, 40000',
        },
        {
          id: expect.any(String),
          name: 'Format method',
          values: 'Quick, Slow',
        },
        {
          id: expect.any(String),
          name: 'File system',
          values: 'FAT, FAT32, NTFS',
        },
        { id: expect.any(String), name: 'Cluster size', values: 'Quick, Slow' },
        { id: expect.any(String), name: 'Compression', values: 'ON, OFF' },
      ])
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
        '出力',
      )
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: 'Type' }),
      ).toBeInTheDocument()
      expect(screen.getByRole('cell', { name: '100' })).toBeInTheDocument()
    })

    it('Should display result table when add empty row', async () => {
      // arrange - add empty row
      await user.click(screen.getByText('行を追加'))

      // act - click the run button
      await user.click(screen.getByText('実行'))

      // assert - check result table
      expect(pictRunner.run).toHaveBeenCalledWith([
        {
          id: expect.any(String),
          name: 'Type',
          values: 'Single, Span, Stripe, Mirror, RAID-5',
        },
        {
          id: expect.any(String),
          name: 'Size',
          values: '10, 100, 500, 1000, 5000, 10000, 40000',
        },
        {
          id: expect.any(String),
          name: 'Format method',
          values: 'Quick, Slow',
        },
        {
          id: expect.any(String),
          name: 'File system',
          values: 'FAT, FAT32, NTFS',
        },
        { id: expect.any(String), name: 'Cluster size', values: 'Quick, Slow' },
        { id: expect.any(String), name: 'Compression', values: 'ON, OFF' },
        { id: expect.any(String), name: '', values: '' },
      ])
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
        '出力',
      )
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: 'Type' }),
      ).toBeInTheDocument()
      expect(screen.getByRole('cell', { name: '100' })).toBeInTheDocument()
    })

    it('Should display result table when delete existing row', async () => {
      // arrange - delete existing row
      await user.click(screen.getByText('行を削除'))

      // act - click the run button
      await user.click(screen.getByText('実行'))

      // assert - check result table
      expect(pictRunner.run).toHaveBeenCalledWith([
        {
          id: expect.any(String),
          name: 'Type',
          values: 'Single, Span, Stripe, Mirror, RAID-5',
        },
        {
          id: expect.any(String),
          name: 'Size',
          values: '10, 100, 500, 1000, 5000, 10000, 40000',
        },
        {
          id: expect.any(String),
          name: 'Format method',
          values: 'Quick, Slow',
        },
        {
          id: expect.any(String),
          name: 'File system',
          values: 'FAT, FAT32, NTFS',
        },
        { id: expect.any(String), name: 'Cluster size', values: 'Quick, Slow' },
      ])
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
        '出力',
      )
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: 'Type' }),
      ).toBeInTheDocument()
      expect(screen.getByRole('cell', { name: '100' })).toBeInTheDocument()
    })

    it('Should display result table when editing value', async () => {
      // arrange - edit existing value
      const input = screen.getAllByRole('textbox')[1]
      await user.clear(input)
      await user.type(input, 'Double, Span, Stripe, Mirror, RAID-5000')

      // act - click the run button
      await user.click(screen.getByText('実行'))

      // assert - check result table
      expect(pictRunner.run).toHaveBeenCalledWith([
        {
          id: expect.any(String),
          name: 'Type',
          values: 'Double, Span, Stripe, Mirror, RAID-5000',
        },
        {
          id: expect.any(String),
          name: 'Size',
          values: '10, 100, 500, 1000, 5000, 10000, 40000',
        },
        {
          id: expect.any(String),
          name: 'Format method',
          values: 'Quick, Slow',
        },
        {
          id: expect.any(String),
          name: 'File system',
          values: 'FAT, FAT32, NTFS',
        },
        { id: expect.any(String), name: 'Cluster size', values: 'Quick, Slow' },
        { id: expect.any(String), name: 'Compression', values: 'ON, OFF' },
      ])
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
        '出力',
      )
      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: 'Type' }),
      ).toBeInTheDocument()
      expect(screen.getByRole('cell', { name: '100' })).toBeInTheDocument()
    })
  })
})

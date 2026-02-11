import fs from 'node:fs'
import { test, expect } from '@playwright/test'

test.describe('PictRider E2E Tests', () => {
  test.describe('Default State', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/')
    })

    test('Should display default state', async ({ page }) => {
      // assert - default state
      // page title
      await expect(page).toHaveTitle('PictRider: Pairwise testing on the web')

      // default menu state
      await expect(
        page.getByRole('button', { name: 'Clear Input' }),
      ).toBeEnabled()
      await expect(
        page.getByRole('button', { name: 'Clear Result' }),
      ).toBeDisabled()
      await expect(page.getByRole('button', { name: 'Run' })).toBeEnabled()

      // default parameter state
      await expect(
        page.getByRole('textbox', { name: /Parameter \d+ Name/ }),
      ).toHaveCount(6)
      await expect(
        page.getByRole('textbox', { name: /Parameter \d+ Values/ }),
      ).toHaveCount(6)
      await expect(
        page.getByRole('button', { name: /Parameter \d+ Edit Menu/ }),
      ).toHaveCount(6)
      await expect(
        page.getByRole('textbox', { name: 'Parameter 1 Name' }),
      ).toHaveValue('Type')
      await expect(
        page.getByRole('textbox', { name: 'Parameter 1 Values' }),
      ).toHaveValue('Single, Span, Stripe, Mirror, RAID-5')
      await expect(
        page.getByRole('textbox', { name: 'Parameter 2 Name' }),
      ).toHaveValue('Size')
      await expect(
        page.getByRole('textbox', { name: 'Parameter 2 Values' }),
      ).toHaveValue('10, 100, 500, 1000, 5000, 10000, 40000')
      await expect(
        page.getByRole('textbox', { name: 'Parameter 3 Name' }),
      ).toHaveValue('Format method')
      await expect(
        page.getByRole('textbox', { name: 'Parameter 3 Values' }),
      ).toHaveValue('Quick, Slow')
      await expect(
        page.getByRole('textbox', { name: 'Parameter 4 Name' }),
      ).toHaveValue('File system')
      await expect(
        page.getByRole('textbox', { name: 'Parameter 4 Values' }),
      ).toHaveValue('FAT, FAT32, NTFS')
      await expect(
        page.getByRole('textbox', { name: 'Parameter 5 Name' }),
      ).toHaveValue('Cluster size')
      await expect(
        page.getByRole('textbox', { name: 'Parameter 5 Values' }),
      ).toHaveValue('512, 1024, 2048, 4096, 8192, 16384, 32768, 65536')
      await expect(
        page.getByRole('textbox', { name: 'Parameter 6 Name' }),
      ).toHaveValue('Compression')
      await expect(
        page.getByRole('textbox', { name: 'Parameter 6 Values' }),
      ).toHaveValue('ON, OFF')

      // default constraint state
      await expect(
        page.getByRole('switch', { name: 'Enable Constraints' }),
      ).toBeEnabled()
      await expect(page.getByText('Constraint 1', { exact: true })).toBeHidden()
      await expect(
        page.getByText('Constraint Formula', { exact: true }),
      ).toBeHidden()

      // default sub-model state
      await expect(
        page.getByRole('switch', { name: 'Enable Sub-Models' }),
      ).toBeEnabled()
      await expect(page.getByText('Sub-Model 1', { exact: true })).toBeHidden()

      // default other options state
      await expect(
        page.getByRole('spinbutton', { name: 'Order of combinations' }),
      ).toHaveValue('2')
      await expect(
        page.getByRole('checkbox', { name: 'Randomize generation' }),
      ).not.toBeChecked()
      await expect(
        page.getByRole('spinbutton', { name: 'Seed' }),
      ).toBeDisabled()
      await expect(page.getByRole('spinbutton', { name: 'Seed' })).toHaveValue(
        '',
      )
      await expect(
        page.getByRole('checkbox', { name: 'Show model file' }),
      ).not.toBeChecked()

      // default result state
      await expect(page.getByRole('table', { name: 'Result' })).toBeHidden()
    })

    test('Should display default constraint state when enabled', async ({
      page,
    }) => {
      // act - enable constraints
      await page.getByRole('switch', { name: 'Enable Constraints' }).click()

      // assert - default constraint state
      // header and buttons
      await expect(
        page.getByText('Constraint 1', { exact: true }),
      ).toBeVisible()
      await expect(
        page.getByRole('button', { name: 'Remove Constraint' }),
      ).toBeDisabled()
      await expect(
        page.getByRole('button', { name: 'Add Constraint' }),
      ).toBeEnabled()

      // first constraint inputs
      await expect(
        page.getByRole('button', { name: /Constraint 1 .+ if/ }),
      ).toHaveCount(6)
      await expect(
        page.getByRole('textbox', {
          name: /Constraint 1 .+ Predicate/,
        }),
      ).toHaveCount(6)
      await expect(
        page.getByRole('button', { name: 'Constraint 1 Type if' }),
      ).toBeEnabled()
      await expect(
        page.getByRole('textbox', {
          name: 'Constraint 1 Type Predicate',
        }),
      ).toHaveValue('')
      await expect(
        page.getByRole('button', { name: 'Constraint 1 Size if' }),
      ).toBeEnabled()
      await expect(
        page.getByRole('textbox', {
          name: 'Constraint 1 Size Predicate',
        }),
      ).toHaveValue('')
      await expect(
        page.getByRole('button', { name: 'Constraint 1 Format method if' }),
      ).toBeEnabled()
      await expect(
        page.getByRole('textbox', {
          name: 'Constraint 1 Format method Predicate',
        }),
      ).toHaveValue('')
      await expect(
        page.getByRole('button', { name: 'Constraint 1 File system if' }),
      ).toBeEnabled()
      await expect(
        page.getByRole('textbox', {
          name: 'Constraint 1 File system Predicate',
        }),
      ).toHaveValue('')
      await expect(
        page.getByRole('button', { name: 'Constraint 1 Cluster size if' }),
      ).toBeEnabled()
      await expect(
        page.getByRole('textbox', {
          name: 'Constraint 1 Cluster size Predicate',
        }),
      ).toHaveValue('')
      await expect(
        page.getByRole('button', { name: 'Constraint 1 Compression if' }),
      ).toBeEnabled()
      await expect(
        page.getByRole('textbox', {
          name: 'Constraint 1 Compression Predicate',
        }),
      ).toHaveValue('')

      // second constraint is hidden
      await expect(page.getByText('Constraint 2', { exact: true })).toBeHidden()

      // formula display area
      await expect(
        page.getByText('Constraint Formula', { exact: true }),
      ).toBeVisible()
      await expect(
        page.getByRole('button', { name: 'Edit Directly' }),
      ).toBeEnabled()
      await expect(page.locator('pre')).toHaveText('')

      // direct edit mode elements are hidden
      await expect(
        page.getByRole('textbox', { name: 'Constraint Formula' }),
      ).toBeHidden()
      await expect(
        page.getByRole('button', { name: 'Reset Constraints' }),
      ).toBeHidden()
    })

    test('Should display default sub-model state when enabled', async ({
      page,
    }) => {
      // act - enable sub-models
      await page.getByRole('switch', { name: 'Enable Sub-Models' }).click()

      // assert - default sub-model state
      // header and buttons
      await expect(page.getByText('Sub-Model 1', { exact: true })).toBeVisible()
      await expect(
        page.getByRole('button', { name: 'Remove Sub-Model' }),
      ).toBeDisabled()
      await expect(
        page.getByRole('button', { name: 'Add Sub-Model' }),
      ).toBeEnabled()

      // TODO: sub-model's checkboxes has duplicated names, need to fix
    })
  })

  test.describe('Run with parameters and basic editing', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/')
    })

    test('Should display result after clicking Run (default values)', async ({
      page,
    }) => {
      // act - click the run button
      await page.getByRole('button', { name: 'Run' }).click()

      // assert - result table displayed
      // alert area is hidden
      await expect(page.getByRole('alert')).toBeHidden()

      // result table is visible
      const table = page.getByRole('table', { name: 'Result' })
      await expect(table).toBeVisible()

      // download button is enabled
      await expect(page.getByRole('button', { name: 'Download' })).toBeEnabled()

      // correct number of rows and columns
      const rows = table.getByRole('row')
      await expect(rows).toHaveCount(57) // 1 header + 56 data rows
      const headerRow = rows.first()
      await expect(headerRow.getByRole('columnheader')).toHaveCount(7)

      // correct header and data values
      await expect(headerRow.getByRole('columnheader').nth(0)).toHaveText('#')
      await expect(headerRow.getByRole('columnheader').nth(1)).toHaveText(
        'Type',
      )
      await expect(headerRow.getByRole('columnheader').nth(2)).toHaveText(
        'Size',
      )
      await expect(headerRow.getByRole('columnheader').nth(3)).toHaveText(
        'Format method',
      )
      await expect(headerRow.getByRole('columnheader').nth(4)).toHaveText(
        'File system',
      )
      await expect(headerRow.getByRole('columnheader').nth(5)).toHaveText(
        'Cluster size',
      )
      await expect(headerRow.getByRole('columnheader').nth(6)).toHaveText(
        'Compression',
      )
      const firstDataRow = rows.nth(1)
      await expect(firstDataRow.getByRole('rowheader')).toHaveText('1')
      await expect(firstDataRow.getByRole('cell').nth(0)).toHaveText('Span')
      await expect(firstDataRow.getByRole('cell').nth(1)).toHaveText('5000')
      await expect(firstDataRow.getByRole('cell').nth(2)).toHaveText('Slow')
      await expect(firstDataRow.getByRole('cell').nth(3)).toHaveText('NTFS')
      await expect(firstDataRow.getByRole('cell').nth(4)).toHaveText('16384')
      await expect(firstDataRow.getByRole('cell').nth(5)).toHaveText('OFF')
      const lastDataRow = rows.last()
      await expect(lastDataRow.getByRole('rowheader')).toHaveText('56')
      await expect(lastDataRow.getByRole('cell').nth(0)).toHaveText('Mirror')
      await expect(lastDataRow.getByRole('cell').nth(1)).toHaveText('5000')
      await expect(lastDataRow.getByRole('cell').nth(2)).toHaveText('Slow')
      await expect(lastDataRow.getByRole('cell').nth(3)).toHaveText('NTFS')
      await expect(lastDataRow.getByRole('cell').nth(4)).toHaveText('2048')
      await expect(lastDataRow.getByRole('cell').nth(5)).toHaveText('OFF')
    })

    test('Should display result after clicking Run (edited values)', async ({
      page,
    }) => {
      // arrange - edit parameter names and values with various characters
      await page.getByRole('button', { name: 'Clear Input' }).click()
      await page.getByRole('textbox', { name: 'Parameter 1 Name' }).fill('null')
      await page
        .getByRole('textbox', { name: 'Parameter 1 Values' })
        .fill('undefined, true, false, NaN, Infinity, eval')
      await page.getByRole('textbox', { name: 'Parameter 2 Name' }).fill('⅛⅜⅝⅞')
      await page
        .getByRole('textbox', { name: 'Parameter 2 Values' })
        .fill('Ω≈ç√∫˜µ≤≥÷, ٠١٢٣٤٥٦٧٨٩, ¡™£¢∞§¶•ªº–≠')
      await page
        .getByRole('textbox', { name: 'Parameter 3 Name' })
        .fill('社會科學院語學研究所')
      await page
        .getByRole('textbox', { name: 'Parameter 3 Values' })
        .fill('表ポあA鷗ŒéＢ逍Üßªąñ丂㐀𠀀, 캄사함니다')
      await page
        .getByRole('textbox', { name: 'Parameter 4 Name' })
        .fill('╯°□°）╯︵ ┻━┻')
      await page
        .getByRole('textbox', { name: 'Parameter 4 Values' })
        .fill('👾 🙇 💁 🙅 🙆 🙋 🙎 🙍, ✋🏿 💪🏿 👐🏿 🙌🏿 👏🏿 🙏🏿, 🇺🇸🇷🇺🇸🇦')
      await page
        .getByRole('textbox', { name: 'Parameter 5 Name' })
        .fill('script alert0 /script')
      await page
        .getByRole('textbox', { name: 'Parameter 5 Values' })
        .fill('مرحبًا, בְּרֵאשִׁית')
      // 6th parameter left empty to test ignoring empty parameter

      // act - click the run button
      await page.getByRole('button', { name: 'Run' }).click()

      // assert - result table displayed with correct header and data values
      const table = page.getByRole('table', { name: 'Result' })
      await expect(table).toBeVisible()
      const rows = table.getByRole('row')
      await expect(rows).toHaveCount(19) // 1 header + 18 data rows
      const headerRow = rows.first()
      await expect(headerRow.getByRole('columnheader')).toHaveCount(6)
      await expect(headerRow.getByRole('columnheader').nth(0)).toHaveText('#')
      await expect(headerRow.getByRole('columnheader').nth(1)).toHaveText(
        'null',
      )
      await expect(headerRow.getByRole('columnheader').nth(2)).toHaveText(
        '⅛⅜⅝⅞',
      )
      await expect(headerRow.getByRole('columnheader').nth(3)).toHaveText(
        '社會科學院語學研究所',
      )
      await expect(headerRow.getByRole('columnheader').nth(4)).toHaveText(
        '╯°□°）╯︵ ┻━┻',
      )
      await expect(headerRow.getByRole('columnheader').nth(5)).toHaveText(
        'script alert0 /script',
      )
      const firstDataRow = rows.nth(1)
      await expect(firstDataRow.getByRole('rowheader')).toHaveText('1')
      await expect(firstDataRow.getByRole('cell').nth(0)).toHaveText('false')
      await expect(firstDataRow.getByRole('cell').nth(1)).toHaveText(
        '¡™£¢∞§¶•ªº–≠',
      )
      await expect(firstDataRow.getByRole('cell').nth(2)).toHaveText(
        '캄사함니다',
      )
      await expect(firstDataRow.getByRole('cell').nth(3)).toHaveText('🇺🇸🇷🇺🇸🇦')
      await expect(firstDataRow.getByRole('cell').nth(4)).toHaveText('مرحبًا')
      const lastDataRow = rows.last()
      await expect(lastDataRow.getByRole('rowheader')).toHaveText('18')
      await expect(lastDataRow.getByRole('cell').nth(0)).toHaveText('false')
      await expect(lastDataRow.getByRole('cell').nth(1)).toHaveText(
        '٠١٢٣٤٥٦٧٨٩',
      )
      await expect(lastDataRow.getByRole('cell').nth(2)).toHaveText(
        '캄사함니다',
      )
      await expect(lastDataRow.getByRole('cell').nth(3)).toHaveText(
        '👾 🙇 💁 🙅 🙆 🙋 🙎 🙍',
      )
      await expect(lastDataRow.getByRole('cell').nth(4)).toHaveText('مرحبًا')
    })

    test('Should display result when adding on empty parameter row', async ({
      page,
    }) => {
      // arrange - insert a new parameter row and leave it empty
      await page.getByRole('button', { name: 'Parameter 6 Edit Menu' }).click()
      await page.getByRole('menuitem', { name: 'Insert Below' }).click()

      // act - run
      await page.getByRole('button', { name: 'Run' }).click()

      // assert - the empty parameter row is ignored
      await expect(
        page
          .getByRole('table', { name: 'Result' })
          .getByRole('row')
          .first()
          .getByRole('columnheader'),
      ).toHaveCount(7)
    })

    test('Should display result when deleting on existing parameter row', async ({
      page,
    }) => {
      // arrange - delete the last parameter row
      await page.getByRole('button', { name: 'Parameter 6 Edit Menu' }).click()
      await page.getByRole('menuitem', { name: 'Delete Row' }).click()

      // act - run
      await page.getByRole('button', { name: 'Run' }).click()

      // assert - the deleted parameter row is ignored
      await expect(
        page
          .getByRole('table', { name: 'Result' })
          .getByRole('row')
          .first()
          .getByRole('columnheader'),
      ).toHaveCount(6)
    })

    test('Should display result when editing parameter name to empty', async ({
      page,
    }) => {
      // arrange - clear parameter name
      await page.getByRole('textbox', { name: 'Parameter 2 Name' }).clear()

      // act - run
      await page.getByRole('button', { name: 'Run' }).click()

      // assert - the empty parameter is ignored
      await expect(
        page
          .getByRole('table', { name: 'Result' })
          .getByRole('row')
          .first()
          .getByRole('columnheader'),
      ).toHaveCount(6)
    })

    test('Should display result when editing parameter values to empty', async ({
      page,
    }) => {
      // arrange - clear parameter values
      await page.getByRole('textbox', { name: 'Parameter 3 Values' }).clear()

      // act - run
      await page.getByRole('button', { name: 'Run' }).click()

      // assert - the empty parameter is ignored
      await expect(
        page
          .getByRole('table', { name: 'Result' })
          .getByRole('row')
          .first()
          .getByRole('columnheader'),
      ).toHaveCount(6)
    })

    test('Should clear inputs when clicking the Clear Input button', async ({
      page,
    }) => {
      // act - click the clear input button
      await page.getByRole('button', { name: 'Clear Input' }).click()

      // assert - all parameter names and values are cleared
      await expect(
        page.getByRole('textbox', { name: /Parameter \d+ Name/ }),
      ).toHaveCount(6)
      await expect(
        page.getByRole('textbox', { name: /Parameter \d+ Values/ }),
      ).toHaveCount(6)
      await expect(
        page.getByRole('textbox', { name: 'Parameter 1 Name' }),
      ).toHaveValue('')
      await expect(
        page.getByRole('textbox', { name: 'Parameter 1 Values' }),
      ).toHaveValue('')
      await expect(
        page.getByRole('textbox', { name: 'Parameter 2 Name' }),
      ).toHaveValue('')
      await expect(
        page.getByRole('textbox', { name: 'Parameter 2 Values' }),
      ).toHaveValue('')
      await expect(
        page.getByRole('textbox', { name: 'Parameter 3 Name' }),
      ).toHaveValue('')
      await expect(
        page.getByRole('textbox', { name: 'Parameter 3 Values' }),
      ).toHaveValue('')
      await expect(
        page.getByRole('textbox', { name: 'Parameter 4 Name' }),
      ).toHaveValue('')
      await expect(
        page.getByRole('textbox', { name: 'Parameter 4 Values' }),
      ).toHaveValue('')
      await expect(
        page.getByRole('textbox', { name: 'Parameter 5 Name' }),
      ).toHaveValue('')
      await expect(
        page.getByRole('textbox', { name: 'Parameter 5 Values' }),
      ).toHaveValue('')
      await expect(
        page.getByRole('textbox', { name: 'Parameter 6 Name' }),
      ).toHaveValue('')
      await expect(
        page.getByRole('textbox', { name: 'Parameter 6 Values' }),
      ).toHaveValue('')

      // assert - constraints and sub-models sections remain hidden (toggles unchanged)
      await expect(page.getByText('Constraint 1', { exact: true })).toBeHidden()
      await expect(page.getByText('Sub-Model 1', { exact: true })).toBeHidden()

      // assert - menu buttons state unchanged
      await expect(
        page.getByRole('button', { name: 'Clear Result' }),
      ).toBeDisabled()
      await expect(page.getByRole('button', { name: 'Run' })).toBeEnabled()
    })

    test('Should clear results when clicking the Clear Result button', async ({
      page,
    }) => {
      // arrange - run to display results
      await page.getByRole('button', { name: 'Run' }).click()
      await expect(page.getByRole('table', { name: 'Result' })).toBeVisible()

      // act - click the clear result button
      await page.getByRole('button', { name: 'Clear Result' }).click()

      // assert - result table is hidden
      await expect(page.getByRole('table', { name: 'Result' })).toBeHidden()
    })
  })

  test.describe('Run with constraints edited in table mode', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/')
      await page.getByRole('switch', { name: 'Enable Constraints' }).click()
    })

    test('Should display result after clicking Run with constraints', async ({
      page,
    }) => {
      // arrange - input constraints
      // input first constraint
      await page
        .getByRole('textbox', { name: 'Constraint 1 File System Predicate' })
        .fill('FAT')
      await page.getByRole('button', { name: 'Constraint 1 Size if' }).click()
      await page
        .getByRole('textbox', { name: 'Constraint 1 Size Predicate' })
        .fill('<= 4096')
      // assert - first constraint displayed
      await expect(
        page.getByText('IF [File system] = "FAT" THEN [Size] <= 4096;'),
      ).toBeVisible()

      // input second constraint
      await page.getByRole('button', { name: 'Add Constraint' }).click()
      await page
        .getByRole('textbox', { name: 'Constraint 2 File System Predicate' })
        .fill('FAT32')
      await page.getByRole('button', { name: 'Constraint 2 Size if' }).click()
      await page
        .getByRole('textbox', { name: 'Constraint 2 Size Predicate' })
        .fill('<= 32000')
      // assert - both first and second constraints displayed
      await expect(
        page.getByText(
          `IF [File system] = "FAT" THEN [Size] <= 4096;
IF [File system] = "FAT32" THEN [Size] <= 32000;`,
        ),
      ).toBeVisible()

      // act - run
      await page.getByRole('button', { name: 'Run' }).click()

      // assert - result table displayed with correct data values
      const table = page.getByRole('table', { name: 'Result' })
      await expect(table).toBeVisible()
      const rows = table.getByRole('row')
      await expect(rows).toHaveCount(57) // 1 header + 56 data rows
      const firstDataRow = rows.nth(1)
      await expect(firstDataRow.getByRole('rowheader')).toHaveText('1')
      await expect(firstDataRow.getByRole('cell').nth(0)).toHaveText('Stripe')
      await expect(firstDataRow.getByRole('cell').nth(1)).toHaveText('5000')
      await expect(firstDataRow.getByRole('cell').nth(2)).toHaveText('Quick')
      await expect(firstDataRow.getByRole('cell').nth(3)).toHaveText('NTFS')
      await expect(firstDataRow.getByRole('cell').nth(4)).toHaveText('16384')
      await expect(firstDataRow.getByRole('cell').nth(5)).toHaveText('OFF')
      const lastDataRow = rows.last()
      await expect(lastDataRow.getByRole('rowheader')).toHaveText('56')
      await expect(lastDataRow.getByRole('cell').nth(0)).toHaveText('Mirror')
      await expect(lastDataRow.getByRole('cell').nth(1)).toHaveText('100')
      await expect(lastDataRow.getByRole('cell').nth(2)).toHaveText('Quick')
      await expect(lastDataRow.getByRole('cell').nth(3)).toHaveText('FAT')
      await expect(lastDataRow.getByRole('cell').nth(4)).toHaveText('65536')
      await expect(lastDataRow.getByRole('cell').nth(5)).toHaveText('OFF')
    })
  })

  test.describe('Run with constraints edited in direct edit mode', () => {
    // [!IMPORTANT] These dialogs are rendered outside of the app root,
    // so it is running on browser level.
    test.beforeEach(async ({ page }) => {
      await page.goto('/')
      await page.getByRole('switch', { name: 'Enable Constraints' }).click()
    })

    test('Should show confirmation dialog when Edit Directly is clicked', async ({
      page,
    }) => {
      // act - click edit directly
      await page.getByRole('button', { name: 'Edit Directly' }).click()

      // assert - confirmation dialog displayed
      await expect(
        page.getByRole('heading', { name: 'Switch to Direct Edit Mode?' }),
      ).toBeVisible()
      await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible()
    })

    test('Should not change to direct edit mode when confirmation is canceled', async ({
      page,
    }) => {
      // act - click edit directly and cancel
      await page.getByRole('button', { name: 'Edit Directly' }).click()
      await page.getByRole('button', { name: 'Cancel' }).click()

      // assert - still in table edit mode
      await expect(
        page.getByText('Constraint 1', { exact: true }),
      ).toBeVisible()
      await expect(
        page.getByRole('button', { name: 'Edit Directly' }),
      ).toBeEnabled()
    })

    test('Should change to direct edit mode when confirmed', async ({
      page,
    }) => {
      // act - click edit directly and continue
      await page.getByRole('button', { name: 'Edit Directly' }).click()
      await page.getByRole('button', { name: 'Continue' }).click()

      // assert - in direct edit mode
      await expect(page.getByText('Constraint 1', { exact: true })).toBeHidden()
      await expect(
        page.getByRole('button', { name: 'Edit Directly' }),
      ).toBeHidden()
      await expect(
        page.getByRole('button', { name: 'Reset Constraints' }),
      ).toBeEnabled()
    })

    test('Should display result after clicking Run with constraints in direct edit mode', async ({
      page,
    }) => {
      // arrange - input constraints in direct edit mode
      await page.getByRole('button', { name: 'Edit Directly' }).click()
      await page.getByRole('button', { name: 'Continue' }).click()

      // Click the formula display area to activate editing mode
      await page.locator('pre').click() // TODO: replace with testid
      await page
        .getByRole('textbox', { name: 'Constraint Formula' })
        .fill(
          'IF [File system] = "FAT" THEN [Size] <= 4096;\nIF [File system] = "FAT32" THEN [Size] <= 32000;',
        )

      // act - run
      await page.getByRole('button', { name: 'Run' }).click()

      // assert - result table displayed with correct data values
      const table = page.getByRole('table', { name: 'Result' })
      await expect(table).toBeVisible()
      const rows = table.getByRole('row')
      await expect(rows).toHaveCount(57) // 1 header + 56 data rows
      const firstDataRow = rows.nth(1)
      await expect(firstDataRow.getByRole('rowheader')).toHaveText('1')
      await expect(firstDataRow.getByRole('cell').nth(0)).toHaveText('Stripe')
      await expect(firstDataRow.getByRole('cell').nth(1)).toHaveText('5000')
      await expect(firstDataRow.getByRole('cell').nth(2)).toHaveText('Quick')
      await expect(firstDataRow.getByRole('cell').nth(3)).toHaveText('NTFS')
      await expect(firstDataRow.getByRole('cell').nth(4)).toHaveText('16384')
      await expect(firstDataRow.getByRole('cell').nth(5)).toHaveText('OFF')
      const lastDataRow = rows.last()
      await expect(lastDataRow.getByRole('rowheader')).toHaveText('56')
      await expect(lastDataRow.getByRole('cell').nth(0)).toHaveText('Mirror')
      await expect(lastDataRow.getByRole('cell').nth(1)).toHaveText('100')
      await expect(lastDataRow.getByRole('cell').nth(2)).toHaveText('Quick')
      await expect(lastDataRow.getByRole('cell').nth(3)).toHaveText('FAT')
      await expect(lastDataRow.getByRole('cell').nth(4)).toHaveText('65536')
      await expect(lastDataRow.getByRole('cell').nth(5)).toHaveText('OFF')
    })

    test('Should reset constraints when clicking the reset button', async ({
      page,
    }) => {
      // arrange - enter direct edit mode
      await page.getByRole('button', { name: 'Edit Directly' }).click()
      await page.getByRole('button', { name: 'Continue' }).click()
      await expect(
        page.getByRole('button', { name: 'Reset Constraints' }),
      ).toBeVisible()

      // act - click reset
      await page.getByRole('button', { name: 'Reset Constraints' }).click()
      await page.getByRole('button', { name: 'Reset' }).click()

      // assert - back to table edit mode with default state
      // header and buttons
      await expect(
        page.getByText('Constraint 1', { exact: true }),
      ).toBeVisible()
      await expect(
        page.getByRole('button', { name: 'Remove Constraint' }),
      ).toBeDisabled()
      await expect(
        page.getByRole('button', { name: 'Add Constraint' }),
      ).toBeEnabled()

      // first constraint inputs
      await expect(
        page.getByRole('button', { name: /Constraint 1 .+ if/ }),
      ).toHaveCount(6)
      await expect(
        page.getByRole('textbox', {
          name: /Constraint 1 .+ Predicate/,
        }),
      ).toHaveCount(6)
      await expect(
        page.getByRole('button', { name: 'Constraint 1 Type if' }),
      ).toBeEnabled()
      await expect(
        page.getByRole('textbox', {
          name: 'Constraint 1 Type Predicate',
        }),
      ).toHaveValue('')
      await expect(
        page.getByRole('button', { name: 'Constraint 1 Size if' }),
      ).toBeEnabled()
      await expect(
        page.getByRole('textbox', {
          name: 'Constraint 1 Size Predicate',
        }),
      ).toHaveValue('')
      await expect(
        page.getByRole('button', { name: 'Constraint 1 Format method if' }),
      ).toBeEnabled()
      await expect(
        page.getByRole('textbox', {
          name: 'Constraint 1 Format method Predicate',
        }),
      ).toHaveValue('')
      await expect(
        page.getByRole('button', { name: 'Constraint 1 File system if' }),
      ).toBeEnabled()
      await expect(
        page.getByRole('textbox', {
          name: 'Constraint 1 File system Predicate',
        }),
      ).toHaveValue('')
      await expect(
        page.getByRole('button', { name: 'Constraint 1 Cluster size if' }),
      ).toBeEnabled()
      await expect(
        page.getByRole('textbox', {
          name: 'Constraint 1 Cluster size Predicate',
        }),
      ).toHaveValue('')
      await expect(
        page.getByRole('button', { name: 'Constraint 1 Compression if' }),
      ).toBeEnabled()
      await expect(
        page.getByRole('textbox', {
          name: 'Constraint 1 Compression Predicate',
        }),
      ).toHaveValue('')

      // second constraint is hidden
      await expect(page.getByText('Constraint 2', { exact: true })).toBeHidden()

      // formula display area
      await expect(
        page.getByText('Constraint Formula', { exact: true }),
      ).toBeVisible()
      await expect(
        page.getByRole('button', { name: 'Edit Directly' }),
      ).toBeEnabled()
      await expect(page.locator('pre')).toHaveText('')

      // direct edit mode elements are hidden
      await expect(
        page.getByRole('textbox', { name: 'Constraint Formula' }),
      ).toBeHidden()
      await expect(
        page.getByRole('button', { name: 'Reset Constraints' }),
      ).toBeHidden()
    })
  })

  test.describe('Run with sub-models', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/')
      await page.getByRole('switch', { name: 'Enable Sub-Models' }).click()
    })

    test('Should run with sub-models when sub-models are enabled', async ({
      page,
    }) => {
      // arrange - select parameters for sub-models
      await page.getByRole('checkbox', { name: 'Type', exact: true }).click()
      await page.getByRole('checkbox', { name: 'Size', exact: true }).click()
      await page
        .getByRole('checkbox', { name: 'Format method', exact: true })
        .click()
      await page.getByRole('spinbutton', { name: 'Order', exact: true }).clear()
      await page
        .getByRole('spinbutton', { name: 'Order', exact: true })
        .fill('3')

      // enable show model file for assertion
      await page.getByRole('checkbox', { name: 'Show model file' }).click()

      // act - click the run button
      await page.getByRole('button', { name: 'Run' }).click()

      // assert - check model file and result table are displayed with correct content
      await expect(
        page.getByText('{ Type, Size, Format method } @ 3'),
      ).toBeVisible()
      const table = page.getByRole('table', { name: 'Result' })
      await expect(table).toBeVisible()
      await expect(table.getByRole('row')).toHaveCount(561) // 1 header + 560 data rows
    })
  })

  test.describe('Run with other options', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/')
    })

    test('Should display result after clicking Run (combination 3)', async ({
      page,
    }) => {
      // arrange - set order of combinations to 3
      await page
        .getByRole('spinbutton', { name: 'Order of combinations' })
        .fill('3')

      // act - click the run button
      await page.getByRole('button', { name: 'Run' }).click()

      // assert - result table displayed with correct number of rows
      const table = page.getByRole('table', { name: 'Result' })
      await expect(table).toBeVisible()
      await expect(table.getByRole('row')).toHaveCount(282) // 1 header + 281 data rows
    })

    test('Should display result after clicking Run (with randomized generation)', async ({
      page,
    }) => {
      // arrange - enable randomize generation
      await page.getByRole('checkbox', { name: 'Randomize generation' }).click()

      // act - click the run button
      await page.getByRole('button', { name: 'Run' }).click()

      // assert - alert displayed with used seed and result table displayed
      await expect(page.getByRole('alert')).toContainText(/Used seed: [0-9]+/)
      await expect(page.getByRole('table', { name: 'Result' })).toBeVisible()
      // data rows count may vary due to randomization, so not checking here
    })

    test('Should display result after clicking Run (with randomized generation and defined seed)', async ({
      page,
    }) => {
      // arrange - enable randomize generation and set seed
      await page.getByRole('checkbox', { name: 'Randomize generation' }).click()
      await page.getByRole('spinbutton', { name: 'Seed' }).fill('0')

      // act - click the run button
      await page.getByRole('button', { name: 'Run' }).click()

      // assert - alert displayed with used seed and result table displayed
      await expect(page.getByRole('alert')).toContainText('Used seed: 0')
      const table = page.getByRole('table', { name: 'Result' })
      await expect(table).toBeVisible()
      await expect(table.getByRole('row')).toHaveCount(57) // 1 header + 56 data rows
    })

    test('Should display result after clicking Run (with model file displayed)', async ({
      page,
    }) => {
      // arrange - enable show model file
      await page.getByRole('checkbox', { name: 'Show model file' }).click()

      // act - click the run button
      await page.getByRole('button', { name: 'Run' }).click()

      // assert - model file and result table displayed
      await expect(
        page.getByRole('heading', { name: 'Model File', level: 2 }),
      ).toBeVisible()
      await expect(
        page.getByText(`Type: Single, Span, Stripe, Mirror, RAID-5
Size: 10, 100, 500, 1000, 5000, 10000, 40000
Format method: Quick, Slow
File system: FAT, FAT32, NTFS
Cluster size: 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536
Compression: ON, OFF`),
      ).toBeVisible()
      await expect(page.getByRole('table', { name: 'Result' })).toBeVisible()
    })
  })

  test.describe('Download results', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/')
      await page.getByRole('button', { name: 'Run' }).click()
      await expect(page.getByRole('table', { name: 'Result' })).toBeVisible()
    })

    test('Should download result as CSV file when clicking Download button', async ({
      page,
    }) => {
      // act - click download CSV
      await page.getByRole('button', { name: 'Download' }).click()
      const downloadPromise = page.waitForEvent('download')
      await page.getByRole('menuitem', { name: 'CSV' }).click()
      const download = await downloadPromise

      // assert - file name
      expect(download.suggestedFilename()).toBe('result.csv')

      // assert - no BOM at the beginning of the file
      const csvBytes = fs.readFileSync(await download.path()!)
      expect(csvBytes.length).toBeGreaterThanOrEqual(3) // ensure file is long enough to meaningfully check for a BOM
      expect(csvBytes.subarray(0, 3)).not.toEqual(
        Buffer.from([0xef, 0xbb, 0xbf]),
      )

      // assert - file content
      const csvContent = csvBytes.toString('utf8')

      // assert - correct header and data
      const csvLines = csvContent.split('\n')
      expect(csvLines).toHaveLength(57) // 1 header + 56 data rows
      expect(csvLines[0]).toBe(
        '"Type","Size","Format method","File system","Cluster size","Compression"',
      )
      expect(csvLines[1]).toBe('"Span","5000","Slow","NTFS","16384","OFF"')
      expect(csvLines[56]).toBe('"Mirror","5000","Slow","NTFS","2048","OFF"')
    })

    test('Should download result as TSV file when clicking Download button', async ({
      page,
    }) => {
      // act - click download TSV
      await page.getByRole('button', { name: 'Download' }).click()
      const downloadPromise = page.waitForEvent('download')
      await page.getByRole('menuitem', { name: 'TSV' }).click()
      const download = await downloadPromise

      // assert - file name
      expect(download.suggestedFilename()).toBe('result.tsv')

      // assert - file content
      const tsvContent = fs.readFileSync(await download.path()!, 'utf8')
      const tsvLines = tsvContent.split('\n')
      expect(tsvLines).toHaveLength(57) // 1 header + 56 data rows
      expect(tsvLines[0]).toBe(
        'Type\tSize\tFormat method\tFile system\tCluster size\tCompression',
      )
      expect(tsvLines[1]).toBe('Span\t5000\tSlow\tNTFS\t16384\tOFF')
      expect(tsvLines[56]).toBe('Mirror\t5000\tSlow\tNTFS\t2048\tOFF')
    })
  })
})

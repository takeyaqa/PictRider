import { test, expect } from '@playwright/test'

test('should display default values', async ({ page }) => {
  // act
  await page.goto('/')

  // assert
  await expect(page).toHaveTitle('PictRider: Pairwise testing on the web')
  await expect(page.getByRole('button', { name: 'Clear Input' })).toBeEnabled()
  await expect(
    page.getByRole('button', { name: 'Clear Result' }),
  ).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Run' })).toBeEnabled()
  await expect(page.getByRole('table', { name: 'Result' })).toBeHidden()
})

test('should display result after clicking Run (default values)', async ({
  page,
}) => {
  // arrange
  await page.goto('/')

  // act
  await page.getByRole('button', { name: 'Run' }).click()

  // assert
  await expect(page.getByRole('alert')).toBeHidden()
  const table = page.getByRole('table', { name: 'Result' })
  await expect(table).toBeVisible()
  const downloadButton = page.getByRole('button', { name: 'Download' })
  await expect(downloadButton).toBeVisible()
  await expect(downloadButton).toBeEnabled()
  const headerRow = table.getByRole('row').first()
  await expect(headerRow.getByRole('columnheader').nth(1)).toHaveText('Type')
  await expect(headerRow.getByRole('columnheader').nth(4)).toHaveText(
    'File system',
  )
  const firstDataRow = table.getByRole('row').nth(1)
  await expect(firstDataRow.getByRole('cell').nth(0)).toHaveText('Span')
  await expect(firstDataRow.getByRole('cell').nth(5)).toHaveText('OFF')
  const lastDataRow = table.getByRole('row').nth(56)
  await expect(lastDataRow.getByRole('cell').nth(2)).toHaveText('Slow')
  await expect(lastDataRow.getByRole('cell').nth(3)).toHaveText('NTFS')
})

test('Should clear results when clicking the Clear Result button', async ({
  page,
}) => {
  // arrange
  await page.goto('/')
  await page.getByRole('button', { name: 'Run' }).click()
  await expect(page.getByRole('table', { name: 'Result' })).toBeVisible()

  // act
  await page.getByRole('button', { name: 'Clear Result' }).click()

  // assert
  await expect(page.getByRole('table', { name: 'Result' })).toBeHidden()
})

test('should display result after clicking Run (edit values)', async ({
  page,
}) => {
  // arrange
  await page.goto('/')
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

  // act
  await page.getByRole('button', { name: 'Run' }).click()

  // assert
  const table = page.getByRole('table', { name: 'Result' })
  await expect(table).toBeVisible()
  const headerRow = table.getByRole('row').first()
  await expect(headerRow.getByRole('columnheader').nth(1)).toHaveText('null')
  await expect(headerRow.getByRole('columnheader').nth(2)).toHaveText('⅛⅜⅝⅞')
  await expect(headerRow.getByRole('columnheader').nth(3)).toHaveText(
    '社會科學院語學研究所',
  )
  await expect(headerRow.getByRole('columnheader').nth(4)).toHaveText(
    '╯°□°）╯︵ ┻━┻',
  )
  await expect(headerRow.getByRole('columnheader').nth(5)).toHaveText(
    'script alert0 /script',
  )
  const row1 = table.getByRole('row').nth(1)
  await expect(row1.getByRole('cell').nth(0)).toHaveText('false')
  await expect(row1.getByRole('cell').nth(1)).toHaveText('¡™£¢∞§¶•ªº–≠')
  await expect(row1.getByRole('cell').nth(2)).toHaveText('캄사함니다')
  await expect(row1.getByRole('cell').nth(3)).toHaveText('🇺🇸🇷🇺🇸🇦')
  await expect(row1.getByRole('cell').nth(4)).toHaveText('مرحبًا')
  const row4 = table.getByRole('row').nth(4)
  await expect(row4.getByRole('cell').nth(0)).toHaveText('Infinity')
  await expect(row4.getByRole('cell').nth(1)).toHaveText('Ω≈ç√∫˜µ≤≥÷')
  await expect(row4.getByRole('cell').nth(2)).toHaveText(
    '表ポあA鷗ŒéＢ逍Üßªąñ丂㐀𠀀',
  )
  await expect(row4.getByRole('cell').nth(3)).toHaveText(
    '👾 🙇 💁 🙅 🙆 🙋 🙎 🙍',
  )
  await expect(row4.getByRole('cell').nth(4)).toHaveText('مرحبًا')
  const row12 = table.getByRole('row').nth(12)
  await expect(row12.getByRole('cell').nth(0)).toHaveText('Infinity')
  await expect(row12.getByRole('cell').nth(1)).toHaveText('٠١٢٣٤٥٦٧٨٩')
  await expect(row12.getByRole('cell').nth(2)).toHaveText('캄사함니다')
  await expect(row12.getByRole('cell').nth(3)).toHaveText('✋🏿 💪🏿 👐🏿 🙌🏿 👏🏿 🙏🏿')
  await expect(row12.getByRole('cell').nth(4)).toHaveText('בְּרֵאשִׁית')
})

test('Should call with parameters when add empty row', async ({ page }) => {
  // arrange
  await page.goto('/')

  // act - insert a new parameter row and leave it empty
  await page.getByRole('button', { name: 'Parameter 6 Edit Menu' }).click()
  await page.getByRole('menuitem', { name: 'Insert Below' }).click()
  await page.getByRole('button', { name: 'Run' }).click()

  // assert - ignore the empty parameter row
  await expect(
    page
      .getByRole('table', { name: 'Result' })
      .getByRole('row')
      .first()
      .getByRole('columnheader'),
  ).toHaveCount(7)
})

test('Should call with parameters when delete existing row', async ({
  page,
}) => {
  // arrange - delete the last parameter row
  await page.goto('/')
  await page.getByRole('button', { name: 'Parameter 6 Edit Menu' }).click()
  await page.getByRole('menuitem', { name: 'Delete Row' }).click()

  // act - run
  await page.getByRole('button', { name: 'Run' }).click()

  // assert - ignore the deleted parameter row
  await expect(
    page
      .getByRole('table', { name: 'Result' })
      .getByRole('row')
      .first()
      .getByRole('columnheader'),
  ).toHaveCount(6)
})

test('Should call with parameters when editing parameter to empty', async ({
  page,
}) => {
  // arrange - clear parameter name
  await page.goto('/')
  await page.getByRole('textbox', { name: 'Parameter 2 Name' }).clear()

  // act - run
  await page.getByRole('button', { name: 'Run' }).click()

  // assert - ignore the empty parameter
  await expect(
    page
      .getByRole('table', { name: 'Result' })
      .getByRole('row')
      .first()
      .getByRole('columnheader'),
  ).toHaveCount(6)
})

test('Should call with parameters when editing values to empty', async ({
  page,
}) => {
  // arrange - clear parameter values
  await page.goto('/')
  await page.getByRole('textbox', { name: 'Parameter 3 Values' }).clear()

  // act - run
  await page.getByRole('button', { name: 'Run' }).click()

  // assert - ignore the empty parameter
  await expect(
    page
      .getByRole('table', { name: 'Result' })
      .getByRole('row')
      .first()
      .getByRole('columnheader'),
  ).toHaveCount(6)
})

test('should display result after clicking Run with constraints', async ({
  page,
}) => {
  // arrange
  await page.goto('/')
  await page.getByRole('switch', { name: 'Enable Constraints' }).click()

  // input first constraint
  await page
    .getByRole('textbox', { name: 'Constraint 1 File System Predicate' })
    .fill('FAT')
  await page.getByRole('button', { name: 'Constraint 1 Size if' }).click()
  await page
    .getByRole('textbox', { name: 'Constraint 1 Size Predicate' })
    .fill('<= 4096')

  // input second constraint
  await page.getByRole('button', { name: 'Add Constraint' }).click()
  await page
    .getByRole('textbox', { name: 'Constraint 2 File System Predicate' })
    .fill('FAT32')
  await page.getByRole('button', { name: 'Constraint 2 Size if' }).click()
  await page
    .getByRole('textbox', { name: 'Constraint 2 Size Predicate' })
    .fill('<= 32000')

  // act
  await page.getByRole('button', { name: 'Run' }).click()

  // assert
  const table = page.getByRole('table', { name: 'Result' })
  await expect(table).toBeVisible()
  const headerRow = table.getByRole('row').first()
  await expect(headerRow.getByRole('columnheader').nth(1)).toHaveText('Type')
  await expect(headerRow.getByRole('columnheader').nth(4)).toHaveText(
    'File system',
  )
  const firstDataRow = table.getByRole('row').nth(1)
  await expect(firstDataRow.getByRole('cell').nth(0)).toHaveText('Stripe')
  await expect(firstDataRow.getByRole('cell').nth(5)).toHaveText('OFF')
  const lastDataRow = table.getByRole('row').nth(56)
  await expect(lastDataRow.getByRole('cell').nth(2)).toHaveText('Quick')
  await expect(lastDataRow.getByRole('cell').nth(3)).toHaveText('FAT')
})

test('should display result after clicking Run (combination 3)', async ({
  page,
}) => {
  // arrange
  await page.goto('/')

  // act
  await page
    .getByRole('spinbutton', { name: 'Order of combinations' })
    .fill('3')
  await page.getByRole('button', { name: 'Run' }).click()

  // assert
  const table = page.getByRole('table', { name: 'Result' })
  await expect(table).toBeVisible()
  const lastDataRow = table.getByRole('row').nth(281)
  await expect(lastDataRow.getByRole('rowheader')).toHaveText('281')
  await expect(lastDataRow.getByRole('cell').nth(2)).toHaveText('Slow')
  await expect(lastDataRow.getByRole('cell').nth(3)).toHaveText('FAT32')
})

test('should display result after clicking Run (with display model file)', async ({
  page,
}) => {
  // arrange
  await page.goto('/')

  // act
  await page.getByRole('checkbox', { name: 'Show model file' }).click()
  await page.getByRole('button', { name: 'Run' }).click()

  // assert
  await expect(
    page.getByRole('heading', { name: 'Model File', level: 2 }),
  ).toBeVisible()
  await expect(page.getByRole('table', { name: 'Result' })).toBeVisible()
})

test('should display result after clicking Run (with randomize generation)', async ({
  page,
}) => {
  // arrange
  await page.goto('/')

  // act
  await page.getByRole('checkbox', { name: 'Randomize generation' }).click()
  await page.getByRole('button', { name: 'Run' }).click()

  // assert
  await expect(page.getByRole('alert')).toContainText(/Used seed: [0-9]+/)
})

test('should display result after clicking Run (with randomize generation and define seed)', async ({
  page,
}) => {
  // arrange
  await page.goto('/')

  // act
  await page.getByRole('checkbox', { name: 'Randomize generation' }).click()
  await page.getByRole('spinbutton', { name: 'Seed' }).fill('0')
  await page.getByRole('button', { name: 'Run' }).click()

  // assert
  await expect(page.getByRole('alert')).toContainText('Used seed: 0')
})

test('should show confirmation dialog when Edit Directly is clicked', async ({
  page,
}) => {
  // arrange
  await page.goto('/')
  await page.getByRole('switch', { name: 'Enable Constraints' }).click()

  // act
  await page.getByRole('button', { name: 'Edit Directly' }).click()

  // assert
  await expect(
    page.getByRole('heading', { name: 'Switch to Direct Edit Mode?' }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible()
})

test('should not change to direct edit mode when confirmation is canceled', async ({
  page,
}) => {
  // arrange
  await page.goto('/')
  await page.getByRole('switch', { name: 'Enable Constraints' }).click()

  // act
  await page.getByRole('button', { name: 'Edit Directly' }).click()
  await page.getByRole('button', { name: 'Cancel' }).click()

  // assert
  await expect(
    page.getByRole('button', { name: 'Edit Directly' }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Add Constraint' }),
  ).toBeVisible()
})

test('should change to direct edit mode when confirmed', async ({ page }) => {
  // arrange
  await page.goto('/')
  await page.getByRole('switch', { name: 'Enable Constraints' }).click()

  // act
  await page.getByRole('button', { name: 'Edit Directly' }).click()
  await page.getByRole('button', { name: 'Continue' }).click()

  // assert
  await expect(
    page.getByRole('button', { name: 'Reset Constraints' }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'Edit Directly' })).toBeHidden()
  await expect(
    page.getByRole('button', { name: 'Add Constraint' }),
  ).toBeHidden()
  await expect(
    page.getByRole('button', { name: 'Remove Constraint' }),
  ).toBeHidden()
})

test('should display result after clicking Run with constraints in direct edit mode', async ({
  page,
}) => {
  // arrange
  await page.goto('/')
  await page.getByRole('switch', { name: 'Enable Constraints' }).click()
  await page.getByRole('button', { name: 'Edit Directly' }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(
    page.getByRole('button', { name: 'Reset Constraints' }),
  ).toBeVisible()

  // Click the formula display area to activate editing mode
  await page.locator('pre').click()
  await page
    .getByRole('textbox', { name: 'Constraint Formula' })
    .fill(
      'IF [File system] = "FAT" THEN [Size] <= 4096;\nIF [File system] = "FAT32" THEN [Size] <= 32000;',
    )

  // act
  await page.getByRole('button', { name: 'Run' }).click()

  // assert
  const table = page.getByRole('table', { name: 'Result' })
  await expect(table).toBeVisible()
  const headerRow = table.getByRole('row').first()
  await expect(headerRow.getByRole('columnheader').nth(1)).toHaveText('Type')
  await expect(headerRow.getByRole('columnheader').nth(4)).toHaveText(
    'File system',
  )
  const firstDataRow = table.getByRole('row').nth(1)
  await expect(firstDataRow.getByRole('cell').nth(0)).toHaveText('Stripe')
  await expect(firstDataRow.getByRole('cell').nth(5)).toHaveText('OFF')
  const lastDataRow = table.getByRole('row').nth(56)
  await expect(lastDataRow.getByRole('cell').nth(2)).toHaveText('Quick')
  await expect(lastDataRow.getByRole('cell').nth(3)).toHaveText('FAT')
})

test('should reset constraints when clicking the reset button', async ({
  page,
}) => {
  // arrange
  await page.goto('/')
  await page.getByRole('switch', { name: 'Enable Constraints' }).click()
  await page.getByRole('button', { name: 'Edit Directly' }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(
    page.getByRole('button', { name: 'Reset Constraints' }),
  ).toBeVisible()

  // act
  await page.getByRole('button', { name: 'Reset Constraints' }).click()
  await page.getByRole('button', { name: 'Reset' }).click()

  // assert
  await expect(page.getByText('Constraint 1', { exact: true })).toBeVisible()
  await expect(page.getByText('Constraint 2', { exact: true })).toBeHidden()
})

test('Should call with sub-models when enable sub-models', async ({ page }) => {
  // arrange - enable sub-models
  await page.goto('/')
  await page.getByRole('switch', { name: 'Enable Sub-Models' }).click()
  await page.getByRole('checkbox', { name: 'Type', exact: true }).click()
  await page.getByRole('checkbox', { name: 'Size', exact: true }).click()
  await page
    .getByRole('checkbox', { name: 'Format method', exact: true })
    .click()
  await page.getByRole('spinbutton', { name: 'Order', exact: true }).clear()
  await page.getByRole('spinbutton', { name: 'Order', exact: true }).fill('3')

  // act - click the run button
  await page.getByRole('button', { name: 'Run' }).click()

  // assert - check result table
  await page.getByRole('checkbox', { name: 'Show model file' }).click()
  await expect(page.getByRole('table', { name: 'Result' })).toBeVisible()
  await expect(
    page.getByText('{ Type, Size, Format method } @ 3'),
  ).toBeVisible()
})

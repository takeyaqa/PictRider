import { test, expect } from '@playwright/test'

test('should display default values', async ({ page }) => {
  // act
  await page.goto('/')

  // assert
  await expect(page).toHaveTitle('PictRider: Pairwise Testing on the Web')
})

test('should display result after clicking Run (default values)', async ({
  page,
}) => {
  // arrange
  await page.goto('/')

  // act
  await page.getByRole('button', { name: 'Run' }).click()

  // assert
  const table = page.getByRole('table', { name: 'Result' })
  const headerRow = table.getByRole('row').first()
  await expect(headerRow.getByRole('cell').nth(1)).toHaveText('Type')
  await expect(headerRow.getByRole('cell').nth(4)).toHaveText('File system')
  const firstDataRow = table.getByRole('row').nth(1)
  await expect(firstDataRow.getByRole('cell').nth(1)).toHaveText('Span')
  await expect(firstDataRow.getByRole('cell').nth(6)).toHaveText('OFF')
  const lastDataRow = table.getByRole('row').nth(56)
  await expect(lastDataRow.getByRole('cell').nth(3)).toHaveText('Slow')
  await expect(lastDataRow.getByRole('cell').nth(4)).toHaveText('NTFS')
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
  const headerRow = table.getByRole('row').first()
  await expect(headerRow.getByRole('cell').nth(1)).toHaveText('null')
  await expect(headerRow.getByRole('cell').nth(2)).toHaveText('⅛⅜⅝⅞')
  await expect(headerRow.getByRole('cell').nth(3)).toHaveText(
    '社會科學院語學研究所',
  )
  await expect(headerRow.getByRole('cell').nth(4)).toHaveText('╯°□°）╯︵ ┻━┻')
  await expect(headerRow.getByRole('cell').nth(5)).toHaveText(
    'script alert0 /script',
  )
  const row1 = table.getByRole('row').nth(1)
  await expect(row1.getByRole('cell').nth(1)).toHaveText('false')
  await expect(row1.getByRole('cell').nth(2)).toHaveText('¡™£¢∞§¶•ªº–≠')
  await expect(row1.getByRole('cell').nth(3)).toHaveText('캄사함니다')
  await expect(row1.getByRole('cell').nth(4)).toHaveText('🇺🇸🇷🇺🇸🇦')
  await expect(row1.getByRole('cell').nth(5)).toHaveText('مرحبًا')
  const row4 = table.getByRole('row').nth(4)
  await expect(row4.getByRole('cell').nth(1)).toHaveText('Infinity')
  await expect(row4.getByRole('cell').nth(2)).toHaveText('Ω≈ç√∫˜µ≤≥÷')
  await expect(row4.getByRole('cell').nth(3)).toHaveText(
    '表ポあA鷗ŒéＢ逍Üßªąñ丂㐀𠀀',
  )
  await expect(row4.getByRole('cell').nth(4)).toHaveText(
    '👾 🙇 💁 🙅 🙆 🙋 🙎 🙍',
  )
  await expect(row4.getByRole('cell').nth(5)).toHaveText('مرحبًا')
  const row12 = table.getByRole('row').nth(12)
  await expect(row12.getByRole('cell').nth(1)).toHaveText('Infinity')
  await expect(row12.getByRole('cell').nth(2)).toHaveText('٠١٢٣٤٥٦٧٨٩')
  await expect(row12.getByRole('cell').nth(3)).toHaveText('캄사함니다')
  await expect(row12.getByRole('cell').nth(4)).toHaveText('✋🏿 💪🏿 👐🏿 🙌🏿 👏🏿 🙏🏿')
  await expect(row12.getByRole('cell').nth(5)).toHaveText('בְּרֵאשִׁית')
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
  const headerRow = table.getByRole('row').first()
  await expect(headerRow.getByRole('cell').nth(1)).toHaveText('Type')
  await expect(headerRow.getByRole('cell').nth(4)).toHaveText('File system')
  const firstDataRow = table.getByRole('row').nth(1)
  await expect(firstDataRow.getByRole('cell').nth(1)).toHaveText('Stripe')
  await expect(firstDataRow.getByRole('cell').nth(6)).toHaveText('OFF')
  const lastDataRow = table.getByRole('row').nth(56)
  await expect(lastDataRow.getByRole('cell').nth(3)).toHaveText('Quick')
  await expect(lastDataRow.getByRole('cell').nth(4)).toHaveText('FAT')
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
  const lastDataRow = table.getByRole('row').nth(281)
  await expect(lastDataRow.getByRole('cell').nth(0)).toHaveText('281')
  await expect(lastDataRow.getByRole('cell').nth(3)).toHaveText('Slow')
  await expect(lastDataRow.getByRole('cell').nth(4)).toHaveText('FAT32')
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

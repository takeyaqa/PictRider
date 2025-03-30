import { test, expect } from '@playwright/test'

test('should display default values', async ({ page }) => {
  // act
  await page.goto('/')

  // assert
  await expect(page).toHaveTitle('PictRider')
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
  await expect(firstDataRow.getByRole('cell').nth(1)).toHaveText('Mirror')
  await expect(firstDataRow.getByRole('cell').nth(6)).toHaveText('OFF')
  const lastDataRow = table.getByRole('row').nth(35)
  await expect(lastDataRow.getByRole('cell').nth(3)).toHaveText('Quick')
  await expect(lastDataRow.getByRole('cell').nth(4)).toHaveText('FAT')
})

test('should display result after clicking Run (edit values)', async ({
  page,
}) => {
  // arrange
  await page.goto('/')
  await page.getByRole('button', { name: 'Clear' }).click()
  await page.getByRole('textbox').nth(0).fill('null')
  await page
    .getByRole('textbox')
    .nth(1)
    .fill('undefined, true, false, NaN, Infinity, eval')
  await page.getByRole('textbox').nth(2).fill('⅛⅜⅝⅞')
  await page
    .getByRole('textbox')
    .nth(3)
    .fill('Ω≈ç√∫˜µ≤≥÷, ٠١٢٣٤٥٦٧٨٩, ¡™£¢∞§¶•ªº–≠')
  await page.getByRole('textbox').nth(4).fill('社會科學院語學研究所')
  await page
    .getByRole('textbox')
    .nth(5)
    .fill('表ポあA鷗ŒéＢ逍Üßªąñ丂㐀𠀀, 캄사함니다')
  await page.getByRole('textbox').nth(6).fill('(╯°□°）╯︵ ┻━┻)')
  await page
    .getByRole('textbox')
    .nth(7)
    .fill('👾 🙇 💁 🙅 🙆 🙋 🙎 🙍, ✋🏿 💪🏿 👐🏿 🙌🏿 👏🏿 🙏🏿, 🇺🇸🇷🇺🇸🇦')
  await page.getByRole('textbox').nth(8).fill('<script>alert(0)</script>')
  await page.getByRole('textbox').nth(9).fill('مرحبًا, בְּרֵאשִׁית')

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
  await expect(headerRow.getByRole('cell').nth(4)).toHaveText('(╯°□°）╯︵ ┻━┻)')
  await expect(headerRow.getByRole('cell').nth(5)).toHaveText(
    '<script>alert(0)</script>',
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
  await page.getByText('Constraints').click()
  const constraintTable = page.getByRole('table').first()

  // input first constraint
  const firstFileSystemCondition = constraintTable
    .getByRole('row')
    .nth(4)
    .getByRole('cell')
    .nth(1)
  const firstSizeCondition = constraintTable
    .getByRole('row')
    .nth(2)
    .getByRole('cell')
    .nth(1)
  await firstFileSystemCondition.getByRole('textbox').fill('FAT')
  await firstSizeCondition.getByRole('button', { name: 'if' }).click()
  await firstSizeCondition.getByRole('textbox').fill('<= 4096')

  // input second constraint
  await page.getByRole('button', { name: 'Add Constraint' }).click()
  const secondFileSystemCondition = constraintTable
    .getByRole('row')
    .nth(4)
    .getByRole('cell')
    .nth(2)
  const secondSizeCondition = constraintTable
    .getByRole('row')
    .nth(2)
    .getByRole('cell')
    .nth(2)
  await secondFileSystemCondition.getByRole('textbox').fill('FAT32')
  await secondSizeCondition.getByRole('button', { name: 'if' }).click()
  await secondSizeCondition.getByRole('textbox').fill('<= 32000')

  // act
  await page.getByRole('button', { name: 'Run' }).click()

  // assert
  const table = page.getByRole('table', { name: 'Result' })
  const headerRow = table.getByRole('row').first()
  await expect(headerRow.getByRole('cell').nth(1)).toHaveText('Type')
  await expect(headerRow.getByRole('cell').nth(4)).toHaveText('File system')
  const firstDataRow = table.getByRole('row').nth(1)
  await expect(firstDataRow.getByRole('cell').nth(1)).toHaveText('Mirror')
  await expect(firstDataRow.getByRole('cell').nth(6)).toHaveText('OFF')
  const lastDataRow = table.getByRole('row').nth(35)
  await expect(lastDataRow.getByRole('cell').nth(3)).toHaveText('Quick')
  await expect(lastDataRow.getByRole('cell').nth(4)).toHaveText('NTFS')
})

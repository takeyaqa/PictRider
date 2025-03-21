import { test, expect } from '@playwright/test'

test('should display default values', async ({ page }) => {
  // act
  await page.goto('/')

  // assert
  await expect(page).toHaveTitle('PictRider')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('PictRider')
})

test('should display result after clicking Run', async ({ page }) => {
  // arrange
  await page.goto('/')

  // act
  await page.getByRole('button', { name: 'Run' }).click()

  // assert
  await expect(page.getByRole('heading', { name: 'Result' })).toBeVisible()
  const table = page.getByRole('table')
  const headerRow = table.getByRole('row').first()
  await expect(headerRow.getByRole('cell').nth(0)).toHaveText('Type')
  await expect(headerRow.getByRole('cell').nth(3)).toHaveText('File system')
  const firstDataRow = table.getByRole('row').nth(1)
  await expect(firstDataRow.getByRole('cell').nth(0)).toHaveText('Mirror')
  await expect(firstDataRow.getByRole('cell').nth(5)).toHaveText('OFF')
  const lastDataRow = table.getByRole('row').nth(35)
  await expect(lastDataRow.getByRole('cell').nth(2)).toHaveText('Quick')
  await expect(lastDataRow.getByRole('cell').nth(3)).toHaveText('FAT')
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
  await expect(page.getByRole('heading', { name: 'Result' })).toBeVisible()
  const table = page.getByRole('table').nth(1)
  const headerRow = table.getByRole('row').first()
  await expect(headerRow.getByRole('cell').nth(0)).toHaveText('Type')
  await expect(headerRow.getByRole('cell').nth(3)).toHaveText('File system')
  const firstDataRow = table.getByRole('row').nth(1)
  await expect(firstDataRow.getByRole('cell').nth(0)).toHaveText('Mirror')
  await expect(firstDataRow.getByRole('cell').nth(5)).toHaveText('OFF')
  const lastDataRow = table.getByRole('row').nth(35)
  await expect(lastDataRow.getByRole('cell').nth(2)).toHaveText('Quick')
  await expect(lastDataRow.getByRole('cell').nth(3)).toHaveText('NTFS')
})

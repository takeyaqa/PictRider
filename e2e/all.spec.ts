import { test, expect } from '@playwright/test'

test('default view', async ({ page }) => {
  // act
  await page.goto('/')

  // assert
  await expect(page).toHaveTitle('PictRider')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('PictRider')
})

test('run under default values', async ({ page }) => {
  // arrange
  await page.goto('/')

  // act
  await page.getByRole('button', { name: 'Run' }).click()

  // assert
  await expect(page.getByRole('heading', { name: 'Result' })).toBeVisible()
})

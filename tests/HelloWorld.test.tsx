import { expect, test } from 'vitest'
import { render } from '@testing-library/react'
import HelloWorld from '../src/HelloWorld.js'

test('renders name', () => {
  const { getByText } = render(<HelloWorld name="Vitest" />)
  expect(getByText('Hello Vitest!')).not.toBeNull()
})

import { describe, expect, it } from 'vitest'
import { splitAlertHost } from './alert-util'
import { splitAlertHostCases } from '../../../test/fixtures/alert-util-cases'

describe('splitAlertHost (client)', () => {
  it.each(splitAlertHostCases)('$name', ({ input, expected }) => {
    expect(splitAlertHost(input)).toStrictEqual(expected)
  })
})

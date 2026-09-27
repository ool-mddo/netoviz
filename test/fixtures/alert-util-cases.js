/**
 * @file Shared table of {input, expected} cases for the two duplicated
 *   `splitAlertHost` implementations (server/api/common/alert-util.js and
 *   lib/diagram/common/alert-util.js). The implementations must stay
 *   duplicated (see CLAUDE.md), but their test cases don't have to be.
 */
export const splitAlertHostCases = [
  {
    name: '2-part layer__host',
    input: 'layer1__host1',
    expected: { layer: 'layer1', host: 'host1', tp: '' }
  },
  {
    name: '3-part layer__host__tp',
    input: 'layer1__host1__eth0',
    expected: { layer: 'layer1', host: 'host1', tp: 'eth0' }
  },
  {
    name: 'single segment (no __)',
    input: 'host1',
    expected: { layer: '', host: 'host1', tp: '' }
  },
  {
    name: '4+ segments (unexpected shape)',
    input: 'layer1__host1__eth0__extra',
    expected: { layer: '', host: 'layer1__host1__eth0__extra', tp: '' }
  },
  {
    name: 'empty string',
    input: '',
    expected: { layer: '', host: '', tp: '' }
  },
  {
    name: 'undefined',
    input: undefined,
    expected: { layer: '', host: '', tp: '' }
  }
]

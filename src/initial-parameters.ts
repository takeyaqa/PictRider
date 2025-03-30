import { uuidv4 } from './helpers'

export function getInitialParameters() {
  return [
    {
      id: uuidv4(),
      name: 'Type',
      values: 'Single, Span, Stripe, Mirror, RAID-5',
      isValid: true,
    },
    {
      id: uuidv4(),
      name: 'Size',
      values: '10, 100, 500, 1000, 5000, 10000, 40000',
      isValid: true,
    },
    {
      id: uuidv4(),
      name: 'Format method',
      values: 'Quick, Slow',
      isValid: true,
    },
    {
      id: uuidv4(),
      name: 'File system',
      values: 'FAT, FAT32, NTFS',
      isValid: true,
    },
    {
      id: uuidv4(),
      name: 'Cluster size',
      values: 'Quick, Slow',
      isValid: true,
    },
    { id: uuidv4(), name: 'Compression', values: 'ON, OFF', isValid: true },
  ]
}

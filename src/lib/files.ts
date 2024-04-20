type sizeUnit = 'Bi' | 'KiB' | 'MiB' | 'GiB'

function getNextSizeUnit(unit: sizeUnit) {
    if (unit === 'Bi') return 'KiB'
    if (unit === 'KiB') return 'MiB'
    if (unit === 'MiB') return 'GiB'
    throw new Error(`No size unit larger than '${unit}' is defined.`)
}

export function getReadableFileSize(size: number, unit: sizeUnit = 'Bi') {
    if (size < 1024 && unit != 'GiB') return `${size.toFixed(2)} ${unit}`
    return getReadableFileSize(size / 1024, getNextSizeUnit(unit))
}

const millisecondsInSecond = 1000
const millisecondsInMinute = millisecondsInSecond * 60
const millisecondsInHour = millisecondsInMinute * 60
const millisecondsInDay = millisecondsInHour * 24
const millisecondsInMonth = millisecondsInDay * 30
const millisecondsInYear = millisecondsInDay * 365

const awsTimeDeltaMs = 2 * 3600 * 1000

export function getHumanReadableDuration(date: Date) {
    const deltaMilliseconds = Date.now() - date.getTime() - awsTimeDeltaMs
    if (deltaMilliseconds < millisecondsInMinute) return 'Менше хвилини тому'
    if (deltaMilliseconds < millisecondsInHour) {
        const deltaMinutes = Math.floor(
            deltaMilliseconds / millisecondsInMinute
        )
        return `${deltaMinutes} хвилин${deltaMinutes === 1 ? 'y' : ''} тому`
    }
    if (deltaMilliseconds < millisecondsInDay) {
        const deltaHours = Math.floor(deltaMilliseconds / millisecondsInHour)
        return `${deltaHours} годин${deltaHours === 1 ? 'y' : ''} тому`
    }
    if (deltaMilliseconds < millisecondsInMonth) {
        const deltaDays = Math.floor(deltaMilliseconds / millisecondsInDay)
        return `${deltaDays} ${
            deltaDays === 1 ? 'день' : deltaDays < 5 ? 'дні' : 'днів'
        } тому`
    }
    if (deltaMilliseconds < millisecondsInYear) {
        const deltaMonths = Math.floor(deltaMilliseconds / millisecondsInMonth)
        return `${deltaMonths} ${
            deltaMonths === 1
                ? 'місяць'
                : deltaMonths < 5
                ? 'місяці'
                : 'місяців'
        } тому`
    }
    const deltaYears = Math.floor(deltaMilliseconds / millisecondsInYear)
    return `${deltaYears} ${
        deltaYears === 1 ? 'рік' : deltaYears < 5 ? 'роки' : 'років'
    } тому`
}

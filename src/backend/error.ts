import { AxiosError } from 'axios'

export interface IErrorData {
    status: number
}

export const handleError = (customHandler?: (_: IErrorData) => void) => (error: unknown) => {
    if (error instanceof AxiosError) {
        const status = error.response?.status
        if (status) customHandler?.({ status })
        throw new UnknownError(error.message)
    } else if (error instanceof Error) {
        throw new UnknownError(error.message)
    }
    throw new UnknownError()
}

export class BaseError extends Error {
    i18nMessage: string
    backendMessage?: string
    toastAutoCloseDelay?: number

    constructor(i18nMessage: string, backendMessage?: string) {
        super(i18nMessage + (backendMessage ?? ''))
        this.i18nMessage = i18nMessage
        this.backendMessage = backendMessage
    }
}

export class UnknownError extends BaseError {
    constructor(backendMessage?: string) {
        super('error.unknownError', backendMessage)
    }
}

export class EmailAlreadyExistsError extends BaseError {
    constructor() {
        super('error.userWithEmailExists')
    }
}

export class PasswordsDoNotMatchError extends BaseError {
    constructor() {
        super('error.credentialsDoNotMatch')
        this.toastAutoCloseDelay = 10_000
    }
}

export class WrongCredentialsError extends BaseError {
    constructor() {
        super('error.wrongCredentials')
    }
}

export class JWTExpiredError extends BaseError {
    constructor() {
        super('error.sessionExpiredAuthAgain')
    }
}

// 使某个type变成可选
export type PartialKey<T, U extends keyof T> = Pick<T, Exclude<keyof T, U>> & Pick<Partial<T>, U>

export const RoleEnum = {
    USER: 'user',
    ORGANIZER: 'organizer',
    ADMIN: 'admin'
} as const

export type Role = keyof typeof RoleEnum
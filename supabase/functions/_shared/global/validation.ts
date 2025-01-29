import { z } from "zod"

export const STATUS = z.enum(['NEW', 'OPEN', 'PENDING', 'ON_HOLD', 'SOLVED', 'REOPENED', 'CLOSED']);
export const PRIORITY = z.enum(['URGENT', 'HIGH', 'NORMAL', 'LOW']);
export const CHANNEL = z.enum(['EMAIL', 'WEB', 'CHAT', 'API']);
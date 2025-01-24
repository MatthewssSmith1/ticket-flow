import { Tables, Enums } from "./database";

export type Ticket = Tables<"tickets">
export type Member = Tables<"members">
export type Organization = Tables<"organizations">

export type Role = Enums<"member_role">
export type Status = Enums<"ticket_status">
export type Channel = Enums<"ticket_channel">
export type Priority = Enums<"ticket_priority">
export type FieldType = Enums<"field_types">
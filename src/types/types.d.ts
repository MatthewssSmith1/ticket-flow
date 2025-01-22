import { Tables, Enums } from "./database";

export type Ticket = Tables<"tickets">
export type Member = Tables<"members">
export type Organization = Tables<"organizations">

export type Role = Enums<"member_role">
export type Status = Enums<"ticket_status">

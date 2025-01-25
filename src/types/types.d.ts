import { Tables, Enums } from "./database";

export type Group = Tables<"groups">
export type Ticket = Tables<"tickets">
export type Member = Tables<"members">
export type Message = Tables<"messages">
export type Organization = Tables<"organizations">
export type GroupAssignment = Tables<"groups_members">
export type MemberAssignment = Tables<"tickets_members">

export type Role = Enums<"member_role">
export type Status = Enums<"ticket_status">
export type Channel = Enums<"ticket_channel">
export type Priority = Enums<"ticket_priority">

export type EnumKey = 'status' | 'priority' | 'channel' | 'role'
export type EnumInstance = Status | Priority | Channel | Role

export type FieldType = Enums<"field_types">
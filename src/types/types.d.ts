import { Tables, Enums } from "./database";

// Entities
export type Tag = Tables<"tags">
export type Group = Tables<"groups">
export type Ticket = Tables<"tickets">
export type Member = Tables<"members">
export type Message = Tables<"messages">
export type Organization = Tables<"organizations">

// Relationships
export type TagInstance = Tables<"tags_tickets">
export type GroupAssignment = Tables<"groups_members">
export type MemberAssignment = Tables<"tickets_members">

// Enums
export type Role = Enums<"member_role">
export type Status = Enums<"ticket_status">
export type Channel = Enums<"ticket_channel">
export type Priority = Enums<"ticket_priority">
export type FieldType = Enums<"field_types">

// Other
export type EnumKey = 'status' | 'priority' | 'channel' | 'role'
export type EnumInstance = Status | Priority | Channel | Role
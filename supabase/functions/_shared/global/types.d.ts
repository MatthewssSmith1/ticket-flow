import { Tables, Enums } from "./database.d.ts";

// Entities
export type Tag = Tables<"tags">
export type Group = Tables<"groups">
export type Ticket = Tables<"tickets">
export type Member = Tables<"members">
export type Message = Tables<"messages">
export type Organization = Tables<"organizations">
export type Field = Tables<"fields">

// Relationships
export type TagInstance = Tables<"tags_tickets">
export type FieldInstance = Tables<"tickets_fields">
export type GroupAssignment = Tables<"tickets_groups">
export type MemberAssignment = Tables<"tickets_members">

// Enums
export type Role = Enums<"member_role">
export type Status = Enums<"ticket_status">
export type Channel = Enums<"ticket_channel">
export type Priority = Enums<"ticket_priority">
export type FieldType = Enums<"field_type">
export type MessageType = Enums<"message_type">
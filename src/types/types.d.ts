import { Tables, Enums } from "./database";

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
// TODO: supabase typegen isn't including the assigned_by field
export type GroupAssignment = Tables<"groups_members"> & { assigned_by: number }
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

// TODO: infer type from query
export type TagWithRelationships = Ticket & { 
  tickets_members: MemberAssignment[], 
  tickets_groups: GroupAssignment[],
  tags_tickets: TagInstance[]
}


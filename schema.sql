-- create_organizations_table
CREATE TABLE IF NOT EXISTS "public"."organizations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

-- create_members_table
CREATE TYPE "public"."member_role" AS ENUM (
    'OWNER',
    'ADMIN',
    'AGENT',
    'CUSTOMER'
);
CREATE TABLE IF NOT EXISTS "public"."members" (
    "id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "org_id" "uuid" NOT NULL,
    "role" "public"."member_role" NOT NULL
);

-- create_tickets_table
CREATE TYPE "public"."ticket_status" AS ENUM (
    'NEW',
    'OPEN',
    'PENDING',
    'ON_HOLD',
    'SOLVED',
    'REOPENED',
    'CLOSED'
);
CREATE TABLE IF NOT EXISTS "public"."tickets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "org_id" "uuid" NOT NULL,
    "author_id" bigint,
    "assignee_id" bigint,
    "status" "public"."ticket_status" DEFAULT 'NEW'::"public"."ticket_status" NOT NULL,
    "subject" "text" NOT NULL,
    "description" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "email" "text",
    "name" "text",
    "verified_at" timestamp with time zone
);


ALTER TABLE ONLY "public"."members"
    ADD CONSTRAINT "members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."organizations"
    ADD CONSTRAINT "organizations_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."organizations"
    ADD CONSTRAINT "organizations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."members"
    ADD CONSTRAINT "members_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."members"
    ADD CONSTRAINT "members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."members"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."messages"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "public"."members"("id") ON DELETE SET NULL;


ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."members"("id") ON DELETE SET NULL;


ALTER TABLE ONLY "public"."tickets"
    ADD CONSTRAINT "tickets_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;
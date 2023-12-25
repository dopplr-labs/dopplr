DO $$ BEGIN
 CREATE TYPE "dashboard_invite_status" AS ENUM('CONFIRMED', 'NOT_CONFIRMED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "dashboard_user_role" AS ENUM('EDITOR', 'VIEWER', 'OWNER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dashboard_user_invite" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" time DEFAULT now(),
	"from" text NOT NULL,
	"to" text NOT NULL,
	"dashboard" integer NOT NULL,
	"role" "dashboard_user_role" NOT NULL,
	"status" "dashboard_invite_status" DEFAULT 'NOT_CONFIRMED' NOT NULL,
	"epries_on" time NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dashboard_user_invite" ADD CONSTRAINT "dashboard_user_invite_from_user_id_fk" FOREIGN KEY ("from") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dashboard_user_invite" ADD CONSTRAINT "dashboard_user_invite_to_user_id_fk" FOREIGN KEY ("to") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dashboard_user_invite" ADD CONSTRAINT "dashboard_user_invite_dashboard_dashboards_id_fk" FOREIGN KEY ("dashboard") REFERENCES "dashboards"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

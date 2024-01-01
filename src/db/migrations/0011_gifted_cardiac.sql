CREATE TABLE IF NOT EXISTS "dashboard_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" time DEFAULT now(),
	"user" text NOT NULL,
	"dashboard" integer NOT NULL,
	"role" "dashboard_user_role" NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dashboard_user" ADD CONSTRAINT "dashboard_user_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dashboard_user" ADD CONSTRAINT "dashboard_user_dashboard_dashboards_id_fk" FOREIGN KEY ("dashboard") REFERENCES "dashboards"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

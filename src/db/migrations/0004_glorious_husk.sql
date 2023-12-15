CREATE TABLE IF NOT EXISTS "charts" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" time DEFAULT now(),
	"query" text NOT NULL,
	"name" text NOT NULL,
	"config" json,
	"user_id" text,
	"resource_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "charts" ADD CONSTRAINT "charts_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "charts" ADD CONSTRAINT "charts_resource_id_resource_id_fk" FOREIGN KEY ("resource_id") REFERENCES "resource"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

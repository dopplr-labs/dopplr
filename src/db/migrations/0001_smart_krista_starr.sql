CREATE TABLE IF NOT EXISTS "resource" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" time DEFAULT now(),
	"created_by" text,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"connection_config" json NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resource" ADD CONSTRAINT "resource_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "history_type" AS ENUM('SAVED_QUERY', 'HISTORY');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "history" ADD COLUMN "type" "history_type" DEFAULT 'HISTORY';
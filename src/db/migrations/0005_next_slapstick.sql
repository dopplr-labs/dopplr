DO $$ BEGIN
 CREATE TYPE "chart_type" AS ENUM('BAR_CHART', 'COLUMN_CHART', 'PIE_CHART', 'LINE_CHART');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "charts" ADD COLUMN "chart_type" "chart_type";
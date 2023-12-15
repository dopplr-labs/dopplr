CREATE TABLE IF NOT EXISTS "charts_to_dashboards" (
	"chart_id" integer NOT NULL,
	"dashboard_id" integer NOT NULL,
	CONSTRAINT charts_to_dashboards_chart_id_dashboard_id PRIMARY KEY("chart_id","dashboard_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dashboards" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon" varchar,
	"color" varchar,
	"layout" json,
	"created_at" time DEFAULT now(),
	"user_id" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "charts_to_dashboards" ADD CONSTRAINT "charts_to_dashboards_chart_id_charts_id_fk" FOREIGN KEY ("chart_id") REFERENCES "charts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "charts_to_dashboards" ADD CONSTRAINT "charts_to_dashboards_dashboard_id_dashboards_id_fk" FOREIGN KEY ("dashboard_id") REFERENCES "dashboards"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dashboards" ADD CONSTRAINT "dashboards_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

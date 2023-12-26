ALTER TABLE "dashboard_user_invite" ADD COLUMN "expire_on" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "dashboard_user_invite" DROP COLUMN IF EXISTS "epries_on";
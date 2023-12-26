import { z } from 'zod'
import { createInvitationInput } from '@/server/routers/dashboard-user/input'

export const ROLE_LABEL_MAP: Record<z.infer<typeof createInvitationInput>['role'], string> = {
  EDITOR: 'can edit',
  VIEWER: 'can view',
  OWNER: 'owner',
}

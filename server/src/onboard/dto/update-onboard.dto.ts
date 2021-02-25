import { PartialType } from '@nestjs/mapped-types'
import { CreateOnboardDto } from './create-onboard.dto'

export class UpdateOnboardDto extends PartialType(CreateOnboardDto) {}

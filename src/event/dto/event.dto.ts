import { IsDate, IsString } from 'class-validator'

export class EventDto {
	@IsString()
	name: string

	@IsString()
	description: string

	@IsString()
	place: string

	@IsDate()
	date: Date

	@IsDate()
	time: Date
}

export type EventDtoForUpdate = {
	id: number
}

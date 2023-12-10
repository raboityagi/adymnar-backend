import {
	Body,
	Controller,
	Get,
	HttpCode,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common'
import { UserId } from 'src/auth/decorators/user-id.decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { EventDto, EventDtoForUpdate } from './dto/event.dto'
import { EventService } from './event.service'

@Controller('event')
export class EventController {
	constructor(private readonly eventService: EventService) {}

	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@Post('')
	create(@Body() dto: EventDto, @UserId() id: number) {
		return this.eventService.create(dto, id)
	}

	@UseGuards(JwtAuthGuard)
	@Patch('')
	update(@Body() dto: EventDto & EventDtoForUpdate, @UserId() id: number) {
		return this.eventService.update(dto, id)
	}

	@Get('')
	findAll() {
		return this.eventService.findMany()
	}

	@Get('/expired')
	findExpired() {
		return this.eventService.findExpired()
	}

	@Get('/today')
	findToday() {
		return this.eventService.findToday()
	}
}

import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { EventDto, EventDtoForUpdate } from './dto/event.dto'

@Injectable()
export class EventService {
	constructor(private prisma: PrismaService) {}

	async findMany() {
		return this.prisma.event.findMany()
	}

	async findToday() {
		const today = new Date().toISOString()

		return this.prisma.event.findMany({
			where: {
				date: {
					equals: today,
				},
			},
		})
	}

	async findExpired() {
		const today = new Date().toISOString()

		return this.prisma.event.findMany({
			where: {
				date: {
					lt: today,
				},
			},
		})
	}

	async findById(id: number) {
		return this.prisma.event.findUnique({
			where: {
				id: id,
			},
		})
	}

	async create(dto: EventDto, authorId: number) {
		if (
			await this.prisma.event.findUnique({
				where: {
					name: dto.name,
				},
			})
		)
			throw new BadRequestException('Event with this name already existed')

		return this.prisma.event.create({
			data: {
				name: dto.name,
				description: dto.description,
				place: dto.place,
				date: dto.date,
				time: dto.time,
				schoolEmployeeId: authorId,
			},
		})
	}

	async update(dto: EventDto & EventDtoForUpdate, id: number) {
		if (!id || id === undefined)
			throw new BadRequestException('You are not allowed to be here')

		return this.prisma.event.update({
			where: {
				id: dto.id,
			},
			data: {
				...dto,
				schoolEmployeeId: id,
			},
		})
	}
}

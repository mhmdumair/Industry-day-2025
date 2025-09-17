import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query, UseGuards, Req } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AudienceType } from './entities/announcement.entity';
import { JwtAuthGuard } from 'src/auth/utils/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
    user: {
        userID: string;
        email: string;
        role: string;
    };
}

@Controller('announcement')
@UseGuards(JwtAuthGuard)
export class AnnouncementController {
    constructor(private readonly announcementService: AnnouncementService) {}

    @Post()
    create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
        return this.announcementService.create(createAnnouncementDto);
    }

    @Get()
    findAll() {
        return this.announcementService.findAll();
    }

    @Get('students')
    findForStudents() {
        return this.announcementService.findForStudents();
    }

    @Get('companies')
    findForCompanies() {
        return this.announcementService.findForCompanies();
    }

    @Get('user')
    findByUserId(@Req() req: AuthenticatedRequest) {
        const userId = req.user.userID;
        return this.announcementService.findByUserId(userId);
    }

    @Get('count')
    async getAnnouncementCount(@Query('type') type: AudienceType) {
        if (!type || !Object.values(AudienceType).includes(type)) {
            throw new NotFoundException('Invalid or missing audience type provided');
        }
        return this.announcementService.getAnnouncementCount(type);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.announcementService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAnnouncementDto: UpdateAnnouncementDto) {
        return this.announcementService.update(id, updateAnnouncementDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.announcementService.remove(id);
    }
}
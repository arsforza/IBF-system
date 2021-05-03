import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '../../roles.guard';
import { UploadTriggerPerStationDto } from './dto/upload-trigger-per-station';
import { GlofasStationTriggerEntity } from './glofas-station-trigger.entity';
import { GlofasStationEntity } from './glofas-station.entity';
import { GlofasStationService } from './glofas-station.service';

@ApiBearerAuth()
@UseGuards(RolesGuard)
@ApiTags('glofasStations')
@Controller('glofasStations')
export class GlofasStationController {
  private readonly glofasStationService: GlofasStationService;

  public constructor(glofasStationService: GlofasStationService) {
    this.glofasStationService = glofasStationService;
  }

  @ApiOperation({ summary: 'Get Glofas stations by country' })
  @ApiParam({ name: 'countryCode', required: true, type: 'string' })
  @Get(':countryCode')
  public async getStations(@Param() params): Promise<GlofasStationEntity[]> {
    return await this.glofasStationService.getStationsByCountry(
      params.countryCode,
    );
  }

  @ApiOperation({ summary: 'Upload Glofas forecast data per station' })
  @Post('triggers')
  public async uploadTriggerDataPerStation(
    @Body() uploadTriggerPerStationArray: UploadTriggerPerStationDto[],
  ): Promise<GlofasStationTriggerEntity[]> {
    return await this.glofasStationService.uploadTriggerDataPerStation(
      uploadTriggerPerStationArray,
    );
  }
}

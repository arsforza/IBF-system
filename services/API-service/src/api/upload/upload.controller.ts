import { Body } from '@nestjs/common';
import { Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  ApiOperation,
  ApiConsumes,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '../../roles.guard';
import { UploadExposureDto } from './dto/upload-exposure.dto';
import { UploadTriggerPerLeadTimeDto } from './dto/upload-trigger-per-leadtime.dto';
import { UploadService } from './upload.service';

@ApiBearerAuth()
@ApiTags('upload')
@Controller('upload')
export class UploadController {
  private readonly uploadService: UploadService;
  public constructor(uploadService: UploadService) {
    this.uploadService = uploadService;
  }

  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Upload exposure data at a regular interval',
  })
  @Post('exposure')
  @ApiConsumes()
  @UseInterceptors()
  public async exposure(
    @Body() placeCodeExposure: UploadExposureDto,
  ): Promise<void> {
    await this.uploadService.exposure(placeCodeExposure);
  }

  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Upload trigger per leadtime data',
  })
  @Post('triggers-per-leadtime')
  @ApiConsumes()
  @UseInterceptors()
  public async uploadTriggersPerLeadTime(
    @Body() uploadTriggerPerLeadTimeDto: UploadTriggerPerLeadTimeDto,
  ): Promise<void> {
    await this.uploadService.uploadTriggerPerLeadTime(
      uploadTriggerPerLeadTimeDto,
    );
  }
}

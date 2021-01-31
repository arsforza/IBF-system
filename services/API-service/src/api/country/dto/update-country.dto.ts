import { ApiModelProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { LeadTimeEntity } from '../../lead-time/lead-time.entity';
import { AdminLevel } from '../admin-level.enum';
import { CountryStatus } from '../country-status.enum';

export class UpdateCountryDto {
  @ApiModelProperty({ example: 'UGA' })
  @IsNotEmpty()
  @Length(3, 3)
  public countryCodeISO3: string;

  @ApiModelProperty({ example: 'UG' })
  @IsNotEmpty()
  @Length(2, 2)
  public countryCodeISO2: string;

  @ApiModelProperty({ example: 'Uganda' })
  @IsString()
  @IsNotEmpty()
  public countryName: string;

  @ApiModelProperty({
    example: CountryStatus.Active,
    default: CountryStatus.Inactive,
  })
  @IsEnum(CountryStatus)
  @IsNotEmpty()
  public countryStatus: CountryStatus;

  @ApiModelProperty({
    example: AdminLevel.adm2,
    default: AdminLevel.adm1,
  })
  @IsEnum(AdminLevel)
  @IsNotEmpty()
  public defaultAdminLevel: AdminLevel;

  @ApiModelProperty()
  @IsArray()
  public adminRegionLabels: string[];

  @ApiModelProperty()
  @IsString()
  public eapLink: string;

  @ApiModelProperty()
  @IsArray()
  @IsEnum(LeadTimeEntity)
  public countryLeadTimes: LeadTimeEntity[];

  @ApiModelProperty()
  @IsArray()
  public countryLogos: string[];
}

import { Injectable } from '@nestjs/common';
import { AdminAreaDynamicDataService } from '../api/admin-area-dynamic-data/admin-area-dynamic-data.service';
import { DisasterType } from '../api/disaster/disaster-type.enum';
import { GlofasStationService } from '../api/glofas-station/glofas-station.service';
import { MockDynamic } from './scripts.controller';
import countries from './json/countries.json';
import fs from 'fs';
import { DynamicIndicator } from '../api/admin-area-dynamic-data/enum/dynamic-indicator';
import { LeadTime } from '../api/admin-area-dynamic-data/enum/lead-time.enum';
import { EventService } from '../api/event/event.service';

@Injectable()
export class ScriptsService {
  private readonly adminAreaDynamicDataService: AdminAreaDynamicDataService;
  private readonly glofasStationService: GlofasStationService;
  private readonly eventService: EventService;

  public constructor(
    adminAreaDynamicDataService: AdminAreaDynamicDataService,
    glofasStationService: GlofasStationService,
    eventService: EventService,
  ) {
    this.adminAreaDynamicDataService = adminAreaDynamicDataService;
    this.glofasStationService = glofasStationService;
    this.eventService = eventService;
  }

  public async mockCountry(mockInput: MockDynamic) {
    const selectedCountry = countries.find((country): any => {
      if (mockInput.countryCodeISO3 === country.countryCodeISO3) {
        return country;
      }
    });

    await this.mockExposure(selectedCountry, mockInput.triggered);

    if (selectedCountry.disasterType === DisasterType.Floods) {
      await this.mockGlofasStations(selectedCountry, mockInput.triggered);
      await this.mockTriggerPerLeadTime(selectedCountry, mockInput.triggered);
    }
  }

  private async mockExposure(selectedCountry, triggered: boolean) {
    let exposureIndicators;
    if (selectedCountry.countryCodeISO3 === 'PHL') {
      exposureIndicators = [
        DynamicIndicator.populationAffected,
        DynamicIndicator.potentialCases65,
        DynamicIndicator.potentialCasesU9,
      ];
    } else {
      exposureIndicators = [DynamicIndicator.populationAffected];
    }

    const exposureFileName = `./src/api/admin-area-dynamic-data/dto/example/upload-exposure-${
      selectedCountry.countryCodeISO3
    }${triggered ? '-triggered' : ''}.json`;
    const exposureRaw = fs.readFileSync(exposureFileName, 'utf-8');
    const exposure = JSON.parse(exposureRaw);

    for (const indicator of exposureIndicators) {
      for (const activeLeadTime of selectedCountry.countryActiveLeadTimes) {
        console.log(
          `Seeding exposure for leadtime: ${activeLeadTime} indicator: ${indicator} for country: ${selectedCountry.countryCodeISO3}`,
        );
        await this.adminAreaDynamicDataService.exposure({
          countryCodeISO3: selectedCountry.countryCodeISO3,
          exposurePlaceCodes: exposure,
          leadTime: activeLeadTime as LeadTime,
          dynamicIndicator: indicator,
          adminLevel: selectedCountry.defaultAdminLevel,
        });
      }
    }
  }

  private async mockGlofasStations(selectedCountry, triggered: boolean) {
    const stationsFileName = `./src/api/glofas-station/dto/example/glofas-stations-${
      selectedCountry.countryCodeISO3
    }${triggered ? '-triggered' : ''}.json`;
    const stationsRaw = fs.readFileSync(stationsFileName, 'utf-8');
    const stations = JSON.parse(stationsRaw);

    for (const activeLeadTime of selectedCountry.countryActiveLeadTimes) {
      console.log(
        `Seeding Glofas stations for leadtime: ${activeLeadTime} for country: ${selectedCountry.countryCodeISO3}`,
      );
      await this.glofasStationService.uploadTriggerDataPerStation({
        countryCodeISO3: selectedCountry.countryCodeISO3,
        stationForecasts: stations,
        leadTime: activeLeadTime as LeadTime,
      });
    }
  }

  private async mockTriggerPerLeadTime(selectedCountry, triggered: boolean) {
    const triggersFileName = `./src/api/event/dto/example/triggers-per-leadtime-${
      selectedCountry.countryCodeISO3
    }${triggered ? '-triggered' : ''}.json`;
    const triggersRaw = fs.readFileSync(triggersFileName, 'utf-8');
    const triggers = JSON.parse(triggersRaw);

    await this.eventService.uploadTriggerPerLeadTime({
      countryCodeISO3: selectedCountry.countryCodeISO3,
      triggersPerLeadTime: triggers,
    });
  }
}

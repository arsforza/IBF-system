import { DateTime } from 'luxon';
import adminAreaData from './admin-area-data.json';
import glofasStationData from './glofas-station-data.json';

export function getRecentDates() {
  return [
    {
      date: DateTime.now().toFormat('yyyy-LL-dd'),
    },
  ];
}

export function getEvent() {
  return {
    countryCodeISO3: 'UGA',
    startDate: DateTime.now().toFormat('yyyy-LL-dd'),
    endDate: DateTime.now().plus({ days: 7 }).toFormat('yyyy-LL-dd'),
    activeTrigger: true,
  };
}

export function getTriggerPerLeadTime() {
  return {
    1: '0',
    2: '0',
    3: '0',
    4: '0',
    5: '1',
    6: '1',
    7: '1',
    countryCodeISO3: 'UGA',
    date: DateTime.now().toFormat('yyyy-LL-dd'),
  };
}

export function getTriggeredAreas() {
  return [
    {
      placeCode: '21UGA013005',
      name: 'Katakwi',
      populationAffected: 4133.6044921875,
      eventPlaceCodeId: 'c5cf9a42-12d6-46c4-8d72-18019ae7c42a',
      activeTrigger: true,
    },
    {
      placeCode: '21UGA008008',
      name: 'Napak',
      populationAffected: 3501.15771484375,
      eventPlaceCodeId: '9a4d3f64-9547-42f9-878e-e0e96613c304',
      activeTrigger: true,
    },
    {
      placeCode: '21UGA013001',
      name: 'Amuria',
      populationAffected: 2047.373046875,
      eventPlaceCodeId: '5b7457cf-d1f9-4258-8469-bc3db90a4d44',
      activeTrigger: true,
    },
    {
      placeCode: '21UGA013004',
      name: 'Kapelebyong',
      populationAffected: 1561.43115234375,
      eventPlaceCodeId: '95f414a1-c3f3-425e-96f5-d3354cc04d5b',
      activeTrigger: true,
    },
    {
      placeCode: '21UGA008004',
      name: 'Kotido',
      populationAffected: 961.6905517578125,
      eventPlaceCodeId: '8286f5fe-e9a6-4ad2-afdc-9dc9af3c0f26',
      activeTrigger: true,
    },
    {
      placeCode: '21UGA008001',
      name: 'Abim',
      populationAffected: 401.5565185546875,
      eventPlaceCodeId: '07b26d41-abb0-4931-b4d4-a3fe7eeb9ff1',
      activeTrigger: true,
    },
  ];
}

export function getStations() {
  var stations = JSON.parse(JSON.stringify(glofasStationData)); // Hack to clone without reference
  stations.features.forEach((feature) => {
    if (feature.properties.stationCode === 'DWRM14') {
      feature.properties = {
        countryCodeISO3: 'UGA',
        lead_time: '5-day',
        stationCode: 'DWRM14',
        stationName: 'Akokoro at Uganda Gauge',
        triggerLevel: 100,
        forecastLevel: 147.0588235294,
        forecastTrigger: '1',
        fc_perc: 1.470588235294,
        forecastProbability: '1',
      };
    }
  });
  return stations;
}

export function getAdminRegions() {
  var areas = JSON.parse(JSON.stringify(adminAreaData)); // Hack to clone without reference
  var triggeredAreaProperties = [
    {
      pcode_level2: '21UGA008001',
      name: 'Abim',
      pcode_level1: '21UGA008',
      countryCodeISO3: 'UGA',
      pcode: '21UGA008001',
      date: '2021-03-19T00:00:00.000Z',
      lead_time: '5-day',
      forecastLevel: 147.0588235294,
      forecastTrigger: '1',
      fc_rp: 25,
      fc_perc: 1.470588235294,
      forecastProbability: '1',
      population_affected: 401.5565185546875,
    },
    {
      pcode_level2: '21UGA008004',
      name: 'Kotido',
      pcode_level1: '21UGA008',
      countryCodeISO3: 'UGA',
      pcode: '21UGA008004',
      date: '2021-03-19T00:00:00.000Z',
      lead_time: '5-day',
      forecastLevel: 147.0588235294,
      forecastTrigger: '1',
      fc_rp: 25,
      fc_perc: 1.470588235294,
      forecastProbability: '1',
      population_affected: 961.6905517578125,
    },
    {
      pcode_level2: '21UGA008008',
      name: 'Napak',
      pcode_level1: '21UGA008',
      countryCodeISO3: 'UGA',
      pcode: '21UGA008008',
      date: '2021-03-19T00:00:00.000Z',
      lead_time: '5-day',
      forecastLevel: 147.0588235294,
      forecastTrigger: '1',
      fc_rp: 25,
      fc_perc: 1.470588235294,
      forecastProbability: '1',
      population_affected: 3501.15771484375,
    },
    {
      pcode_level2: '21UGA013001',
      name: 'Amuria',
      pcode_level1: '21UGA013',
      countryCodeISO3: 'UGA',
      pcode: '21UGA013001',
      date: '2021-03-19T00:00:00.000Z',
      lead_time: '5-day',
      forecastLevel: 147.0588235294,
      forecastTrigger: '1',
      fc_rp: 25,
      fc_perc: 1.470588235294,
      forecastProbability: '1',
      population_affected: 2047.373046875,
    },
    {
      pcode_level2: '21UGA013004',
      name: 'Kapelebyong',
      pcode_level1: '21UGA013',
      countryCodeISO3: 'UGA',
      pcode: '21UGA013004',
      date: '2021-03-19T00:00:00.000Z',
      lead_time: '5-day',
      forecastLevel: 147.0588235294,
      forecastTrigger: '1',
      fc_rp: 25,
      fc_perc: 1.470588235294,
      forecastProbability: '1',
      population_affected: 1561.43115234375,
    },
    {
      pcode_level2: '21UGA013005',
      name: 'Katakwi',
      pcode_level1: '21UGA013',
      countryCodeISO3: 'UGA',
      pcode: '21UGA013005',
      date: '2021-03-19T00:00:00.000Z',
      lead_time: '5-day',
      forecastLevel: 147.0588235294,
      forecastTrigger: '1',
      fc_rp: 25,
      fc_perc: 1.470588235294,
      forecastProbability: '1',
      population_affected: 4133.6044921875,
    },
  ];
  var triggeredAreas = {
    type: 'FeatureCollection',
    features: [],
  };
  triggeredAreaProperties.forEach((areaProperties) => {
    areas.features.forEach((feature) => {
      if (feature.properties.pcode === areaProperties.pcode) {
        areaProperties['indicators'] = feature.properties.indicators;
        feature.properties = areaProperties;
        triggeredAreas.features.push(feature);
      }
    });
  });
  return triggeredAreas;
}

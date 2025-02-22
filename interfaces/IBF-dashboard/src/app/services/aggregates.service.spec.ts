import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AggregatesService } from './aggregates.service';

describe('AggregatesService', () => {
  let service: AggregatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
    });
    service = TestBed.inject(AggregatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

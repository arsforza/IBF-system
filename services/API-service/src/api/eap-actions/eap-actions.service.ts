import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { EapActionEntity } from './eap-action.entity';
import { EapActionStatusEntity } from './eap-action-status.entity';
import { EapActionDto } from './dto/eap-action.dto';
import { AreaOfFocusEntity } from './area-of-focus.entity';
import { EventPlaceCodeEntity } from '../event/event-place-code.entity';

@Injectable()
export class EapActionsService {
  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>;
  @InjectRepository(EapActionStatusEntity)
  private readonly eapActionStatusRepository: Repository<EapActionStatusEntity>;
  @InjectRepository(EapActionEntity)
  private readonly eapActionRepository: Repository<EapActionEntity>;
  @InjectRepository(AreaOfFocusEntity)
  private readonly areaOfFocusRepository: Repository<AreaOfFocusEntity>;
  @InjectRepository(EventPlaceCodeEntity)
  private readonly eventPlaceCodeRepository: Repository<EventPlaceCodeEntity>;

  public constructor() {}

  public async checkAction(
    userId: string,
    eapAction: EapActionDto,
  ): Promise<EapActionStatusEntity> {
    const actionId = await this.eapActionRepository.findOne({
      where: {
        countryCodeISO3: eapAction.countryCodeISO3,
        action: eapAction.action,
      },
    });
    if (!actionId) {
      const errors = 'Action not found';
      throw new HttpException({ errors }, HttpStatus.NOT_FOUND);
    }

    const eventPlaceCode = await this.eventPlaceCodeRepository.findOne({
      where: {
        closed: false,
        placeCode: eapAction.placeCode,
      },
    });

    const action = new EapActionStatusEntity();
    action.status = eapAction.status;
    action.placeCode = eapAction.placeCode;
    action.eventPlaceCode = eventPlaceCode;
    action.actionChecked = actionId;

    // If no user, take default user for now
    const user = await this.userRepository.findOne(userId);
    action.user = user;

    const newAction = await this.eapActionStatusRepository.save(action);
    return newAction;
  }

  public async getAreasOfFocus(): Promise<AreaOfFocusEntity[]> {
    return await this.areaOfFocusRepository.find();
  }

  public async getActionsWithStatus(
    countryCodeISO3: string,
    placeCode: string,
  ): Promise<EapActionEntity[]> {
    const mostRecentStatePerAction = await this.eapActionStatusRepository
      .createQueryBuilder('status')
      .select(['status."actionCheckedId"', 'status."placeCode"'])
      .groupBy('status."actionCheckedId"')
      .addGroupBy('status."placeCode"')
      .addSelect(['MAX(status.timestamp) AS "max_timestamp"']);

    const eapActionsStates = await this.eapActionStatusRepository
      .createQueryBuilder('status')
      .select([
        'status."actionCheckedId"',
        'status."placeCode"',
        'status."status"',
      ])
      .leftJoin(
        '(' + mostRecentStatePerAction.getQuery() + ')',
        'recent',
        'status."actionCheckedId" = recent."actionCheckedId"',
      )
      .setParameters(mostRecentStatePerAction.getParameters())
      .leftJoin('status.eventPlaceCode', 'event')
      .where('status.timestamp = recent.max_timestamp')
      .andWhere('event.closed = false');

    const eapActions = await this.eapActionRepository
      .createQueryBuilder('action')
      .select([
        'area."label" AS "aofLabel"',
        'area.id AS aof',
        'action."action"',
        'action."label"',
      ])
      .addSelect(
        'case when status."actionCheckedId" is null then false else status.status end AS checked',
      )
      .leftJoin(
        '(' + eapActionsStates.getQuery() + ')',
        'status',
        'action.id = status."actionCheckedId" AND status."placeCode" = :placeCode',
        { placeCode: placeCode },
      )
      .setParameters(eapActionsStates.getParameters())
      .leftJoin('action.areaOfFocus', 'area')
      .where('action."countryCodeISO3" = :countryCodeISO3', {
        countryCodeISO3: countryCodeISO3,
      })
      .getRawMany();

    eapActions.forEach(action => (action['placeCode'] = placeCode));

    return eapActions;
  }
}

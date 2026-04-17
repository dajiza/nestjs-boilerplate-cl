import { Injectable, Logger } from '@nestjs/common';
import { ClientsService } from '../clients/clients.service';
import { StaffService } from '../staff/staff.service';
import { ServicesService } from '../services/services.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { LocationService } from '../locations/location.service';
import { ServiceCategoryService } from '../service-categories/service-category.service';
import { BusinessService } from '../business/business.service';
import { ShiftService } from '../shifts/shift.service';
import { TimeblockService } from '../timeblocks/timeblock.service';
import { StaffRoleService } from '../staff-roles/staff-role.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { BOULEVARD_DEFAULT_ENDPOINT } from '../boulevard/boulevard.constants';

export interface SyncResult {
  entity: string;
  created: number;
  updated: number;
  failed: number;
  errors: string[];
}

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  private readonly businessId: string;
  private readonly apiKey: string;
  private readonly secretKey: string;
  private readonly apiEndpoint: string;

  constructor(
    private readonly clientsService: ClientsService,
    private readonly staffService: StaffService,
    private readonly servicesService: ServicesService,
    private readonly appointmentsService: AppointmentsService,
    private readonly locationService: LocationService,
    private readonly serviceCategoryService: ServiceCategoryService,
    private readonly businessService: BusinessService,
    private readonly shiftService: ShiftService,
    private readonly timeblockService: TimeblockService,
    private readonly staffRoleService: StaffRoleService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.businessId = this.configService.get<string>('BOULEVARD_BUSINESS_ID', { infer: true }) ?? '';
    this.apiKey = this.configService.get<string>('BOULEVARD_API_KEY', { infer: true }) ?? '';
    this.secretKey = this.configService.get<string>('BOULEVARD_SECRET_KEY', { infer: true }) ?? '';
    this.apiEndpoint = this.configService.get<string>('BOULEVARD_API_ENDPOINT', { infer: true }) ?? BOULEVARD_DEFAULT_ENDPOINT;
  }

  private generateAuthToken(): string {
    const prefix = 'blvd-admin-v1';
    const timestamp = Math.floor(Date.now() / 1000);
    const payload = `${prefix}${this.businessId}${timestamp}`;
    const rawKey = Buffer.from(this.secretKey, 'base64');
    const signature = crypto.createHmac('sha256', rawKey).update(payload, 'utf8').digest('base64');
    const token = `${signature}${payload}`;
    const credentials = Buffer.from(`${this.apiKey}:${token}`).toString('base64');
    return credentials;
  }

  private async executeGraphQL<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
    const credentials = this.generateAuthToken();
    const response = await firstValueFrom(
      this.httpService.post(
        this.apiEndpoint,
        { query, variables },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${credentials}`,
          },
        },
      ),
    );
    if (response.data.errors) {
      throw new Error(response.data.errors[0]?.message || 'GraphQL error');
    }
    return response.data.data;
  }

  /**
   * Sync all data from Boulevard
   */
  async syncAll(): Promise<SyncResult[]> {
    const results: SyncResult[] = [];

    // Sync in dependency order
    results.push(await this.syncBusiness());
    results.push(await this.syncLocations());
    results.push(await this.syncServiceCategories());
    results.push(await this.syncServices());
    results.push(await this.syncStaff());
    results.push(await this.syncStaffRoles());
    results.push(await this.syncClients());
    results.push(await this.syncAppointments());
    results.push(await this.syncShifts());
    results.push(await this.syncTimeblocks());

    return results;
  }

  /**
   * Sync business from Boulevard
   */
  async syncBusiness(): Promise<SyncResult> {
    const result: SyncResult = { entity: 'business', created: 0, updated: 0, failed: 0, errors: [] };

    try {
      const query = `
        query GetBusiness {
          business {
            id
            name
            address {
              line1
              line2
              city
              country
              province
              state
              zip
            }
            allowLoginWithMultipleClients
            billingContactEmail
            customBookingUrl
            phone
            showLocationHours
            tz
            website
          }
        }
      `;

      const data = await this.executeGraphQL<{
        business: any;
      }>(query);

      const b = data.business;
      try {
        const existing = await this.businessService.findById(b.id);
        const businessData = {
          name: b.name,
          address: b.address ?? null,
          allowLoginWithMultipleClients: b.allowLoginWithMultipleClients ?? null,
          billingContactEmail: b.billingContactEmail ?? null,
          customBookingUrl: b.customBookingUrl ?? null,
          phone: b.phone ?? null,
          showLocationHours: b.showLocationHours ?? null,
          tz: b.tz ?? null,
          website: b.website ?? null,
        };

        if (existing) {
          await this.businessService.update(b.id, businessData);
          result.updated++;
        } else {
          await this.businessService.create({
            id: b.id,
            ...businessData,
          });
          result.created++;
        }
      } catch (error) {
        result.failed++;
        result.errors.push(`Business ${b.id}: ${error.message}`);
      }

      this.logger.log(`Business sync complete: ${result.created} created, ${result.updated} updated, ${result.failed} failed`);
    } catch (error) {
      this.logger.error('Failed to sync business:', error);
      result.errors.push(error.message);
    }

    return result;
  }

  /**
   * Sync locations from Boulevard
   */
  async syncLocations(): Promise<SyncResult> {
    const result: SyncResult = { entity: 'locations', created: 0, updated: 0, failed: 0, errors: [] };

    try {
      const query = `
        query ListLocations($first: Int, $after: String) {
          locations(first: $first, after: $after) {
            edges {
              node {
                id
                name
                tz
                isRemote
                showLocationHours
                phone
                website
                contactEmail
                billingContactEmail
                businessName
                arrivalInstructions
                externalId
                googlePlaceId
                address {
                  line1
                  line2
                  city
                  country
                  province
                  state
                  zip
                }
                coordinates
                hours {
                  open
                  start {
                    hour
                    minute
                  }
                  finish {
                    hour
                    minute
                  }
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `;

      let hasNextPage = true;
      let after: string | undefined;

      while (hasNextPage) {
        const data = await this.executeGraphQL<{
          locations: {
            edges: Array<{ node: any }>;
            pageInfo: { hasNextPage: boolean; endCursor?: string };
          };
        }>(query, { first: 50, after });

        for (const edge of data.locations.edges) {
          const loc = edge.node;
          try {
            const existing = await this.locationService.findById(loc.id);
            const locationData = {
              name: loc.name,
              address: loc.address ?? null,
              arrivalInstructions: loc.arrivalInstructions ?? null,
              billingContactEmail: loc.billingContactEmail ?? null,
              businessName: loc.businessName ?? '',
              contactEmail: loc.contactEmail ?? null,
              coordinates: loc.coordinates ?? null,
              externalId: loc.externalId ?? null,
              googlePlaceId: loc.googlePlaceId ?? null,
              hours: loc.hours ?? null,
              isRemote: loc.isRemote ?? false,
              paymentOptions: null,
              phone: loc.phone ?? null,
              showLocationHours: loc.showLocationHours ?? false,
              tz: loc.tz ?? '',
              website: loc.website ?? null,
            };

            if (existing) {
              await this.locationService.update(loc.id, locationData);
              result.updated++;
            } else {
              await this.locationService.create({
                id: loc.id,
                ...locationData,
              });
              result.created++;
            }
          } catch (error) {
            result.failed++;
            result.errors.push(`Location ${loc.id}: ${error.message}`);
          }
        }

        hasNextPage = data.locations.pageInfo.hasNextPage;
        after = data.locations.pageInfo.endCursor;
      }

      this.logger.log(`Locations sync complete: ${result.created} created, ${result.updated} updated, ${result.failed} failed`);
    } catch (error) {
      this.logger.error('Failed to sync locations:', error);
      result.errors.push(error.message);
    }

    return result;
  }

  /**
   * Sync service categories from Boulevard
   */
  async syncServiceCategories(): Promise<SyncResult> {
    const result: SyncResult = { entity: 'serviceCategories', created: 0, updated: 0, failed: 0, errors: [] };

    try {
      const query = `
        query ListServiceCategories($first: Int, $after: String) {
          serviceCategories(first: $first, after: $after) {
            edges {
              node {
                id
                name
                active
                services(first: 100) {
                  edges {
                    node {
                      id
                    }
                  }
                }
                sortPath
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `;

      let hasNextPage = true;
      let after: string | undefined;

      while (hasNextPage) {
        const data = await this.executeGraphQL<{
          serviceCategories: {
            edges: Array<{ node: any }>;
            pageInfo: { hasNextPage: boolean; endCursor?: string };
          };
        }>(query, { first: 50, after });

        for (const edge of data.serviceCategories.edges) {
          const cat = edge.node;
          try {
            const existing = await this.serviceCategoryService.findById(cat.id);
            const categoryData = {
              name: cat.name,
              active: cat.active ?? true,
              services: cat.services ?? null,
              sortPath: cat.sortPath ?? null,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            if (existing) {
              await this.serviceCategoryService.update(cat.id, categoryData);
              result.updated++;
            } else {
              await this.serviceCategoryService.create({
                id: cat.id,
                ...categoryData,
              });
              result.created++;
            }
          } catch (error) {
            result.failed++;
            result.errors.push(`ServiceCategory ${cat.id}: ${error.message}`);
          }
        }

        hasNextPage = data.serviceCategories.pageInfo.hasNextPage;
        after = data.serviceCategories.pageInfo.endCursor;
      }

      this.logger.log(`ServiceCategories sync complete: ${result.created} created, ${result.updated} updated, ${result.failed} failed`);
    } catch (error) {
      this.logger.error('Failed to sync service categories:', error);
      result.errors.push(error.message);
    }

    return result;
  }

  /**
   * Sync services from Boulevard
   */
  async syncServices(): Promise<SyncResult> {
    const result: SyncResult = { entity: 'services', created: 0, updated: 0, failed: 0, errors: [] };

    try {
      // 获取 locations 用于 locationId 参数
      const locationsResult = await this.locationService.findManyWithPagination({
        paginationOptions: { page: 1, limit: 100 },
      });
      if (!locationsResult.data || locationsResult.data.length === 0) {
        this.logger.warn('No locations found, skipping services sync');
        result.errors.push('No locations found');
        return result;
      }

      const firstLocationId = locationsResult.data[0].id;

      const query = `
        query ListServices($first: Int, $after: String, $locationId: ID!) {
          services(first: $first, after: $after) {
            edges {
              node {
                id
                name
                description
                defaultDuration
                defaultPrice
                active
                addon
                createdAt
                updatedAt
                categoryId
                category {
                  id
                  name
                  active
                }
                externalId
                sortPath
                serviceOptionGroups {
                  description
                  id
                  maxLimit
                  minLimit
                  name
                  sortPath
                }
                addons(locationId: $locationId) {
                  id
                  alias
                  description
                  service {
                    id
                    name
                  }
                }
                serviceOverrides(locationId: $locationId) {
                  duration
                  finishDuration
                  postClientDuration
                  postStaffDuration
                  price
                }
                serviceStatus(locationId: $locationId) {
                  active
                  bookable
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `;

      let hasNextPage = true;
      let after: string | undefined;

      while (hasNextPage) {
        const data = await this.executeGraphQL<{
          services: {
            edges: Array<{ node: any }>;
            pageInfo: { hasNextPage: boolean; endCursor?: string };
          };
        }>(query, { first: 50, after, locationId: firstLocationId });

        for (const edge of data.services.edges) {
          const svc = edge.node;
          try {
            const existing = await this.servicesService.findById(svc.id);
            const serviceData = {
              name: svc.name,
              description: svc.description ?? null,
              defaultDuration: svc.defaultDuration ?? 60,
              defaultPrice: svc.defaultPrice ?? 0,
              active: svc.active ?? true,
              addon: svc.addon ?? false,
              categoryId: svc.categoryId ?? null,
              category: svc.category ?? null,
              externalId: svc.externalId ?? null,
              addons: svc.addons ?? null,
              serviceOptionGroups: svc.serviceOptionGroups ?? null,
              serviceOverrides: svc.serviceOverrides ?? null,
              serviceStatus: svc.serviceStatus ?? null,
              sortPath: svc.sortPath ?? null,
              createdAt: svc.createdAt ? new Date(svc.createdAt) : new Date(),
              updatedAt: svc.updatedAt ? new Date(svc.updatedAt) : new Date(),
            };

            if (existing) {
              await this.servicesService.update(svc.id, serviceData);
              result.updated++;
            } else {
              await this.servicesService.create({
                id: svc.id,
                ...serviceData,
              });
              result.created++;
            }
          } catch (error) {
            result.failed++;
            result.errors.push(`Service ${svc.id}: ${error.message}`);
          }
        }

        hasNextPage = data.services.pageInfo.hasNextPage;
        after = data.services.pageInfo.endCursor;
      }

      this.logger.log(`Services sync complete: ${result.created} created, ${result.updated} updated, ${result.failed} failed`);
    } catch (error) {
      this.logger.error('Failed to sync services:', error);
      result.errors.push(error.message);
    }

    return result;
  }

  /**
   * Sync staff from Boulevard
   */
  async syncStaff(): Promise<SyncResult> {
    const result: SyncResult = { entity: 'staff', created: 0, updated: 0, failed: 0, errors: [] };

    try {
      // 获取 locations 用于 locationId 参数
      const locationsResult = await this.locationService.findManyWithPagination({
        paginationOptions: { page: 1, limit: 100 },
      });
      if (!locationsResult.data || locationsResult.data.length === 0) {
        this.logger.warn('No locations found, skipping staff sync');
        result.errors.push('No locations found');
        return result;
      }

      const firstLocationId = locationsResult.data[0].id;

      const query = `
        query ListStaff($first: Int, $after: String, $locationId: ID!) {
          staff(first: $first, after: $after) {
            edges {
              node {
                id
                firstName
                lastName
                name
                email
                mobilePhone
                active
                displayName
                alternateId
                appRole {
                  id
                  name
                }
                appRoleId
                avatar
                bio
                createdAt
                updatedAt
                enabledForFutureLocations
                externalId
                externalNickname
                externallyBookable
                locationAbilities(locationId: $locationId) {
                  editLoyaltyPointHistory
                  viewLoyaltyPointHistory
                }
                locations {
                  id
                  name
                }
                nickname
                role {
                  id
                  name
                }
                staffRoleId
                suspended
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `;

      let hasNextPage = true;
      let after: string | undefined;

      while (hasNextPage) {
        const data = await this.executeGraphQL<{
          staff: {
            edges: Array<{ node: any }>;
            pageInfo: { hasNextPage: boolean; endCursor?: string };
          };
        }>(query, { first: 50, after, locationId: firstLocationId });

        for (const edge of data.staff.edges) {
          const s = edge.node;
          try {
            const existing = await this.staffService.findById(s.id);
            const staffData = {
              name: s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim(),
              email: s.email ?? null,
              mobilePhone: s.mobilePhone ?? null,
              active: s.active ?? true,
              firstName: s.firstName ?? null,
              lastName: s.lastName ?? null,
              displayName: s.displayName ?? null,
              alternateId: s.alternateId ?? null,
              appRole: s.appRole ?? null,
              appRoleId: s.appRoleId ?? null,
              avatar: s.avatar ?? null,
              bio: s.bio ?? null,
              enabledForFutureLocations: s.enabledForFutureLocations ?? null,
              externalId: s.externalId ?? null,
              externalNickname: s.externalNickname ?? null,
              externallyBookable: s.externallyBookable ?? null,
              locationAbilities: s.locationAbilities ?? ({} as any),
              locations: s.locations ?? null,
              nickname: s.nickname ?? null,
              role: s.role ?? null,
              staffRoleId: s.staffRoleId ?? null,
              suspended: s.suspended ?? null,
              createdAt: s.createdAt ? new Date(s.createdAt) : new Date(),
              updatedAt: s.updatedAt ? new Date(s.updatedAt) : new Date(),
            };

            if (existing) {
              await this.staffService.update(s.id, staffData);
              result.updated++;
            } else {
              await this.staffService.create({
                id: s.id,
                ...staffData,
              });
              result.created++;
            }
          } catch (error) {
            result.failed++;
            result.errors.push(`Staff ${s.id}: ${error.message}`);
          }
        }

        hasNextPage = data.staff.pageInfo.hasNextPage;
        after = data.staff.pageInfo.endCursor;
      }

      this.logger.log(`Staff sync complete: ${result.created} created, ${result.updated} updated, ${result.failed} failed`);
    } catch (error) {
      this.logger.error('Failed to sync staff:', error);
      result.errors.push(error.message);
    }

    return result;
  }

  /**
   * Sync clients from Boulevard
   */
  async syncClients(): Promise<SyncResult> {
    const result: SyncResult = { entity: 'clients', created: 0, updated: 0, failed: 0, errors: [] };

    try {
      const query = `
        query ListClients($first: Int, $after: String) {
          clients(first: $first, after: $after) {
            edges {
              node {
                id
                firstName
                lastName
                name
                email
                mobilePhone
                active
                appointmentCount
                createdAt
                updatedAt
                creditCardsOnFile {
                  brand
                  last4
                  expirationMonth
                  expirationYear
                }
                currentAccountBalance
                currentAccountUpdatedAt
                dob
                externalId
                hasCardOnFile
                marketingSettings {
                  email
                  push
                  sms
                  type
                }
                mergedIntoClientId
                notes {
                  id
                  text
                  createdAt
                }
                primaryLocation {
                  id
                  name
                }
                pronoun
                reminderSettings {
                  email
                  push
                  sms
                  type
                }
                schedulingAlert
                tags {
                  id
                  name
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `;

      let hasNextPage = true;
      let after: string | undefined;

      while (hasNextPage) {
        const data = await this.executeGraphQL<{
          clients: {
            edges: Array<{ node: any }>;
            pageInfo: { hasNextPage: boolean; endCursor?: string };
          };
        }>(query, { first: 50, after });

        for (const edge of data.clients.edges) {
          const c = edge.node;
          try {
            const existing = await this.clientsService.findById(c.id);
            const clientData = {
              firstName: c.firstName ?? null,
              lastName: c.lastName ?? null,
              name: c.name || `${c.firstName || ''} ${c.lastName || ''}`.trim(),
              email: c.email ?? null,
              mobilePhone: c.mobilePhone ?? null,
              active: c.active ?? true,
              appointmentCount: c.appointmentCount ?? 0,
              creditCardsOnFile: c.creditCardsOnFile ?? null,
              currentAccountBalance: c.currentAccountBalance ?? 0,
              currentAccountUpdatedAt: c.currentAccountUpdatedAt ? new Date(c.currentAccountUpdatedAt) : null,
              dob: c.dob ? new Date(c.dob) : null,
              externalId: c.externalId ?? null,
              hasCardOnFile: c.hasCardOnFile ?? false,
              marketingSettings: c.marketingSettings ?? null,
              mergedIntoClientId: c.mergedIntoClientId ?? null,
              notes: c.notes ?? null,
              primaryLocation: c.primaryLocation ?? null,
              pronoun: c.pronoun ?? null,
              reminderSettings: c.reminderSettings ?? null,
              schedulingAlert: c.schedulingAlert ?? null,
              tags: c.tags ?? null,
              createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
              updatedAt: c.updatedAt ? new Date(c.updatedAt) : new Date(),
            };

            if (existing) {
              await this.clientsService.update(c.id, clientData);
              result.updated++;
            } else {
              await this.clientsService.create({
                id: c.id,
                ...clientData,
              });
              result.created++;
            }
          } catch (error) {
            result.failed++;
            result.errors.push(`Client ${c.id}: ${error.message}`);
          }
        }

        hasNextPage = data.clients.pageInfo.hasNextPage;
        after = data.clients.pageInfo.endCursor;
      }

      this.logger.log(`Clients sync complete: ${result.created} created, ${result.updated} updated, ${result.failed} failed`);
    } catch (error) {
      this.logger.error('Failed to sync clients:', error);
      result.errors.push(error.message);
    }

    return result;
  }

  /**
   * Sync appointments from Boulevard with full details
   * 遍历所有 location 获取预约数据
   */
  async syncAppointments(): Promise<SyncResult> {
    const result: SyncResult = { entity: 'appointments', created: 0, updated: 0, failed: 0, errors: [] };

    try {
      // 获取所有 locations
      const locationsResult = await this.locationService.findManyWithPagination({
        paginationOptions: { page: 1, limit: 100 },
      });
      if (!locationsResult.data || locationsResult.data.length === 0) {
        this.logger.warn('No locations found, skipping appointments sync');
        result.errors.push('No locations found');
        return result;
      }

      const allLocations = locationsResult.data;
      this.logger.log(`Found ${allLocations.length} locations, will sync appointments for each`);

      const query = `
        query ListAppointments($first: Int, $after: String, $locationId: ID!) {
          appointments(first: $first, after: $after, locationId: $locationId) {
            edges {
              node {
                id
                startAt
                endAt
                duration
                state
                cancelled
                notes
                clientId
                locationId
                clientMessage
                bookedByType
                isGroupedAppointment
                isRecurring
                isRemote
                manageUrl
                notifyClientCancel
                notifyClientCreate
                orderId
                pendingFormCount
                cancellation {
                  cancelledAt
                  reason
                  notes
                }
                calendarLinks {
                  googleCalendar
                  icsDownload
                  microsoftOffice
                  microsoftOutlook
                  yahooCalendar
                }
                rating {
                  id
                  rating
                  text
                }
                remotePlatforms {
                  microsoftTeams {
                    url
                  }
                }
                tags {
                  id
                  name
                }
                client {
                  id
                  firstName
                  lastName
                  name
                  email
                  mobilePhone
                }
                location {
                  id
                  name
                }
                appointmentServices {
                  id
                  duration
                  price
                  staffRequested
                  startTimeOffset
                  totalDuration
                  finishDuration
                  postClientDuration
                  postStaffDuration
                  staff {
                    id
                    firstName
                    lastName
                    name
                    email
                  }
                  service {
                    id
                    name
                  }
                }
                appointmentServiceOptions {
                  id
                  appointmentServiceId
                  durationDelta
                  finishDurationDelta
                  postClientDurationDelta
                  postStaffDurationDelta
                  priceDelta
                  productId
                  productName
                  quantity
                  serviceOptionId
                }
                appointmentServiceResources {
                  id
                  resource {
                    id
                    name
                  }
                }
                createdAt
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `;

      // 用于去重，避免同一个预约被多次处理
      const processedAppointmentIds = new Set<string>();

      // 遍历每个 location 获取预约
      for (const location of allLocations) {
        this.logger.log(`Fetching appointments for location: ${location.name} (${location.id})`);

        let hasNextPage = true;
        let after: string | undefined;

        while (hasNextPage) {
          const data = await this.executeGraphQL<{
            appointments: {
              edges: Array<{ node: any }>;
              pageInfo: { hasNextPage: boolean; endCursor?: string };
            };
          }>(query, { first: 50, after, locationId: location.id });

          for (const edge of data.appointments.edges) {
            const apt = edge.node;

            // 跳过已处理的预约
            if (processedAppointmentIds.has(apt.id)) {
              continue;
            }
            processedAppointmentIds.add(apt.id);

            try {
              const existing = await this.appointmentsService.findById(apt.id);

              // 提取关联ID
              const clientId = apt.client?.id || apt.clientId || undefined;
              const locationId = apt.location?.id || apt.locationId || undefined;

              // 提取完整客户端对象
              const clientObj = apt.client ?? null;
              const locationObj = apt.location ?? null;

              // 提取服务信息（保留完整数据）
              const appointmentServices = apt.appointmentServices ?? null;

              // 计算总时长：优先使用预约的 duration，否则从服务列表累加
              let totalDuration = apt.duration ?? null;
              if (!totalDuration && apt.appointmentServices) {
                totalDuration = apt.appointmentServices.reduce((sum: number, s: any) => sum + (s.duration || 0), 0) || 3600;
              }

              const appointmentData = {
                clientId,
                locationId,
                startAt: new Date(apt.startAt),
                endAt: apt.endAt ? new Date(apt.endAt) : undefined,
                duration: totalDuration,
                state: apt.state ?? null,
                cancelled: apt.cancelled ?? false,
                notes: apt.notes ?? null,
                clientMessage: apt.clientMessage ?? null,
                bookedByType: apt.bookedByType ?? null,
                isGroupedAppointment: apt.isGroupedAppointment ?? null,
                isRecurring: apt.isRecurring ?? null,
                isRemote: apt.isRemote ?? null,
                manageUrl: apt.manageUrl ?? null,
                notifyClientCancel: apt.notifyClientCancel ?? null,
                notifyClientCreate: apt.notifyClientCreate ?? null,
                orderId: apt.orderId ?? null,
                pendingFormCount: apt.pendingFormCount ?? null,
                client: clientObj,
                location: locationObj,
                appointmentServices,
                appointmentServiceOptions: apt.appointmentServiceOptions ?? null,
                appointmentServiceResources: apt.appointmentServiceResources ?? null,
                cancellation: apt.cancellation ?? null,
                calendarLinks: apt.calendarLinks ?? null,
                rating: apt.rating ?? null,
                remotePlatforms: apt.remotePlatforms ?? null,
                tags: apt.tags ?? null,
                createdAt: apt.createdAt ? new Date(apt.createdAt) : new Date(),
              };

              if (existing) {
                await this.appointmentsService.update(apt.id, {
                  ...appointmentData,
                  createdAt: existing.createdAt,
                });
                result.updated++;
              } else {
                await this.appointmentsService.create({
                  id: apt.id,
                  ...appointmentData,
                });
                result.created++;
              }
            } catch (error) {
              result.failed++;
              result.errors.push(`Appointment ${apt.id}: ${error.message}`);
            }
          }

          hasNextPage = data.appointments.pageInfo.hasNextPage;
          after = data.appointments.pageInfo.endCursor;
        }
      }

      this.logger.log(`Appointments sync complete: ${result.created} created, ${result.updated} updated, ${result.failed} failed`);
    } catch (error) {
      this.logger.error('Failed to sync appointments:', error);
      result.errors.push(error.message);
    }

    return result;
  }

  /**
   * Sync shifts from Boulevard
   * 遍历所有 location + staff 获取班次数据
   */
  async syncShifts(): Promise<SyncResult> {
    const result: SyncResult = { entity: 'shifts', created: 0, updated: 0, failed: 0, errors: [] };

    try {
      // 获取所有 locations
      const locationsResult = await this.locationService.findManyWithPagination({
        paginationOptions: { page: 1, limit: 100 },
      });
      if (!locationsResult.data || locationsResult.data.length === 0) {
        this.logger.warn('No locations found, skipping shifts sync');
        result.errors.push('No locations found');
        return result;
      }

      const allLocations = locationsResult.data;

      // 获取所有 staff
      const staffResult = await this.staffService.findManyWithPagination({
        paginationOptions: { page: 1, limit: 500 },
      });
      if (!staffResult.data || staffResult.data.length === 0) {
        this.logger.warn('No staff found, skipping shifts sync');
        result.errors.push('No staff found');
        return result;
      }

      const allStaff = staffResult.data;
      this.logger.log(`Found ${allLocations.length} locations and ${allStaff.length} staff, will sync shifts`);

      const query = `
        query ListShifts($locationId: ID!, $staffIds: [ID!], $startIso8601: Date!, $endIso8601: Date!) {
          shifts(locationId: $locationId, staffIds: $staffIds, startIso8601: $startIso8601, endIso8601: $endIso8601) {
            shifts {
              available
              bookingInterval
              clockIn
              clockOut
              day
              locationId
              recurrence
              recurrenceEnd
              recurrenceInterval
              recurrenceStart
              resourceId
              staffId
              unavailableReason
            }
          }
        }
      `;

      // 查询未来 90 天的班次
      const now = new Date();
      const end = new Date(now);
      end.setDate(end.getDate() + 90);
      const startIso8601 = now.toISOString().split('T')[0];
      const endIso8601 = end.toISOString().split('T')[0];

      for (const location of allLocations) {
        const staffIds = allStaff.map((s) => s.id);

        try {
          const data = await this.executeGraphQL<{
            shifts: {
              shifts: Array<any>;
            };
          }>(query, { locationId: location.id, staffIds, startIso8601, endIso8601 });

          for (const shift of data.shifts.shifts) {
            try {
              // StaffShift 没有 id，用 staffId + locationId + day 作为复合标识
              const shiftId = `${shift.staffId}_${shift.locationId}_${shift.day}`;
              const existing = await this.shiftService.findById(shiftId);
              const shiftData = {
                available: shift.available ?? true,
                date: shift.day?.toString() ?? null,
                startTime: shift.clockIn ?? null,
                endTime: shift.clockOut ?? null,
                staffId: shift.staffId,
                locationId: shift.locationId ?? null,
                recurrence: shift.recurrence ?? null,
                unavailableReason: shift.unavailableReason ?? null,
                location: {} as any,
                staff: {} as any,
              };

              if (existing) {
                await this.shiftService.update(shiftId, shiftData);
                result.updated++;
              } else {
                await this.shiftService.create({
                  id: shiftId,
                  ...shiftData,
                });
                result.created++;
              }
            } catch (error) {
              result.failed++;
              result.errors.push(`Shift: ${error.message}`);
            }
          }
        } catch (error) {
          this.logger.warn(`Failed to sync shifts for location ${location.id}: ${error.message}`);
        }
      }

      this.logger.log(`Shifts sync complete: ${result.created} created, ${result.updated} updated, ${result.failed} failed`);
    } catch (error) {
      this.logger.error('Failed to sync shifts:', error);
      result.errors.push(error.message);
    }

    return result;
  }

  /**
   * Sync timeblocks from Boulevard
   * 遍历所有 location + staff 获取时间块数据
   */
  async syncTimeblocks(): Promise<SyncResult> {
    const result: SyncResult = { entity: 'timeblocks', created: 0, updated: 0, failed: 0, errors: [] };

    try {
      // 获取所有 locations
      const locationsResult = await this.locationService.findManyWithPagination({
        paginationOptions: { page: 1, limit: 100 },
      });
      if (!locationsResult.data || locationsResult.data.length === 0) {
        this.logger.warn('No locations found, skipping timeblocks sync');
        result.errors.push('No locations found');
        return result;
      }

      const allLocations = locationsResult.data;

      // 获取所有 staff
      const staffResult = await this.staffService.findManyWithPagination({
        paginationOptions: { page: 1, limit: 500 },
      });
      if (!staffResult.data || staffResult.data.length === 0) {
        this.logger.warn('No staff found, skipping timeblocks sync');
        result.errors.push('No staff found');
        return result;
      }

      const allStaff = staffResult.data;
      this.logger.log(`Found ${allLocations.length} locations and ${allStaff.length} staff, will sync timeblocks`);

      const query = `
        query ListTimeblocks($first: Int, $after: String, $locationId: ID!, $query: String) {
          timeblocks(first: $first, after: $after, locationId: $locationId, query: $query) {
            edges {
              node {
                id
                title
                startAt
                endAt
                duration
                cancelled
                staffId
                location {
                  id
                  name
                }
                staff {
                  id
                  name
                  firstName
                  lastName
                }
                reason
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `;

      const processedIds = new Set<string>();

      for (const location of allLocations) {
        for (const staff of allStaff) {
          let hasNextPage = true;
          let after: string | undefined;

          while (hasNextPage) {
            try {
              const data = await this.executeGraphQL<{
                timeblocks: {
                  edges: Array<{ node: any }>;
                  pageInfo: { hasNextPage: boolean; endCursor?: string };
                };
              }>(query, { first: 50, after, locationId: location.id, query: `staffId:${staff.id}` });

              for (const edge of data.timeblocks.edges) {
                const tb = edge.node;

                if (processedIds.has(tb.id)) {
                  continue;
                }
                processedIds.add(tb.id);

                try {
                  const existing = await this.timeblockService.findById(tb.id);
                  const timeblockData = {
                    title: tb.title ?? null,
                    startAt: new Date(tb.startAt),
                    endAt: new Date(tb.endAt),
                    duration: tb.duration,
                    cancelled: tb.cancelled ?? null,
                    staffId: tb.staffId,
                    location: tb.location ?? {},
                    staff: tb.staff ?? {},
                    reason: tb.reason ?? null,
                  };

                  if (existing) {
                    await this.timeblockService.update(tb.id, timeblockData);
                    result.updated++;
                  } else {
                    await this.timeblockService.create({
                      id: tb.id,
                      ...timeblockData,
                    });
                    result.created++;
                  }
                } catch (error) {
                  result.failed++;
                  result.errors.push(`Timeblock ${tb.id}: ${error.message}`);
                }
              }

              hasNextPage = data.timeblocks.pageInfo.hasNextPage;
              after = data.timeblocks.pageInfo.endCursor;
            } catch {
              hasNextPage = false;
            }
          }
        }
      }

      this.logger.log(`Timeblocks sync complete: ${result.created} created, ${result.updated} updated, ${result.failed} failed`);
    } catch (error) {
      this.logger.error('Failed to sync timeblocks:', error);
      result.errors.push(error.message);
    }

    return result;
  }

  /**
   * Sync staff roles from Boulevard
   */
  async syncStaffRoles(): Promise<SyncResult> {
    const result: SyncResult = { entity: 'staffRoles', created: 0, updated: 0, failed: 0, errors: [] };

    try {
      const query = `
        query ListStaffRoles($first: Int, $after: String) {
          staffRoles(first: $first, after: $after) {
            edges {
              node {
                id
                name
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `;

      let hasNextPage = true;
      let after: string | undefined;

      while (hasNextPage) {
        const data = await this.executeGraphQL<{
          staffRoles: {
            edges: Array<{ node: any }>;
            pageInfo: { hasNextPage: boolean; endCursor?: string };
          };
        }>(query, { first: 50, after });

        for (const edge of data.staffRoles.edges) {
          const role = edge.node;
          try {
            const existing = await this.staffRoleService.findById(role.id);
            const roleData = {
              name: role.name,
            };

            if (existing) {
              await this.staffRoleService.update(role.id, roleData);
              result.updated++;
            } else {
              await this.staffRoleService.create({
                id: role.id,
                name: role.name,
              });
              result.created++;
            }
          } catch (error) {
            result.failed++;
            result.errors.push(`StaffRole ${role.id}: ${error.message}`);
          }
        }

        hasNextPage = data.staffRoles.pageInfo.hasNextPage;
        after = data.staffRoles.pageInfo.endCursor;
      }

      this.logger.log(`StaffRoles sync complete: ${result.created} created, ${result.updated} updated, ${result.failed} failed`);
    } catch (error) {
      this.logger.error('Failed to sync staff roles:', error);
      result.errors.push(error.message);
    }

    return result;
  }
}

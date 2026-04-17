import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import * as crypto from 'crypto';
import { BOULEVARD_DEFAULT_ENDPOINT } from './boulevard.constants';

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export interface BoulevardAppointmentInput {
  staffId: string;
  startAt: Date;
  duration?: number;
  clientId?: string;
  services?: Array<{
    serviceId: string;
    variationId?: string;
    resources?: Array<{
      resourceId: string;
      resourceType: 'ROOM' | 'EQUIPMENT';
    }>;
  }>;
  notes?: string;
  locationId?: string;
}

export interface BoulevardTimeBlockInput {
  title: string;
  startTime: Date;
  endTime: Date;
  isAllDay?: boolean;
  staffId?: string;
  locationId?: string;
}

export interface BoulevardAppointment {
  id: string;
  staffId: string;
  startAt: string;
  endAt: string;
  duration: number;
  state: string;
  cancelled: boolean;
  clientId?: string;
  services?: any[];
  notes?: string;
  locationId?: string;
}

@Injectable()
export class BoulevardService {
  private readonly logger = new Logger(BoulevardService.name);
  private readonly businessId: string;
  private readonly apiKey: string;
  private readonly secretKey: string;
  private readonly apiEndpoint: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.businessId = this.configService.get<string>('BOULEVARD_BUSINESS_ID', { infer: true }) ?? '';
    this.apiKey = this.configService.get<string>('BOULEVARD_API_KEY', { infer: true }) ?? '';
    this.secretKey = this.configService.get<string>('BOULEVARD_SECRET_KEY', { infer: true }) ?? '';
    this.apiEndpoint = this.configService.get<string>('BOULEVARD_API_ENDPOINT', { infer: true }) ?? BOULEVARD_DEFAULT_ENDPOINT;
  }

  /**
   * Generate HMAC-SHA256 authentication token
   * Format: Basic base64(apiKey:signature+payload)
   * Payload: blvd-admin-v1 + businessId + timestamp(seconds)
   */
  private generateAuthToken(): string {
    const prefix = 'blvd-admin-v1';
    const timestamp = Math.floor(Date.now() / 1000);
    const payload = `${prefix}${this.businessId}${timestamp}`;

    // Decode base64 secret key
    const rawKey = Buffer.from(this.secretKey, 'base64');

    // Create HMAC-SHA256 signature
    const signature = crypto.createHmac('sha256', rawKey).update(payload, 'utf8').digest('base64');

    // Token = signature + payload
    const token = `${signature}${payload}`;

    // HTTP Basic: base64(apiKey:token)
    const credentials = Buffer.from(`${this.apiKey}:${token}`).toString('base64');

    return credentials;
  }

  /**
   * Execute GraphQL query/mutation against Boulevard API
   */
  private async executeGraphQL<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
    const token = this.generateAuthToken();

    try {
      const response = await firstValueFrom(
        this.httpService.post<GraphQLResponse<T>>(
          this.apiEndpoint,
          { query, variables },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${token}`,
            },
          },
        ),
      );

      if (response.data.errors) {
        this.logger.error('Boulevard GraphQL errors:', response.data.errors);
        throw new Error(response.data.errors[0]?.message || 'GraphQL error');
      }

      return response.data.data as T;
    } catch (error) {
      this.logger.error('Boulevard API request failed:', error);
      throw error;
    }
  }

  /**
   * Create appointment in Boulevard
   */
  async createAppointment(input: BoulevardAppointmentInput): Promise<BoulevardAppointment> {
    const mutation = `
      mutation CreateAppointment($input: CreateAppointmentInput!) {
        createAppointment(input: $input) {
          appointment {
            id
            staffId
            startAt
            endAt
            duration
            state
            cancelled
            clientId
            notes
            locationId
            appointmentServices {
              edges {
                node {
                  id
                  serviceId
                  variationId
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      input: {
        staffId: input.staffId,
        startAt: input.startAt.toISOString(),
        duration: input.duration || 3600,
        clientId: input.clientId,
        notes: input.notes,
        locationId: input.locationId,
        services: input.services?.map((s) => ({
          serviceId: s.serviceId,
          variationId: s.variationId,
          resources: s.resources,
        })),
      },
    };

    const result = await this.executeGraphQL<{ createAppointment: { appointment: BoulevardAppointment } }>(mutation, variables);

    return result.createAppointment.appointment;
  }

  /**
   * Update appointment in Boulevard
   */
  async updateAppointment(id: string, input: Partial<BoulevardAppointmentInput>): Promise<BoulevardAppointment> {
    const mutation = `
      mutation UpdateAppointment($id: ID!, $input: UpdateAppointmentInput!) {
        updateAppointment(id: $id, input: $input) {
          appointment {
            id
            staffId
            startAt
            endAt
            duration
            state
            cancelled
            clientId
            notes
            locationId
          }
        }
      }
    `;

    const variables = {
      id,
      input: {
        startAt: input.startAt?.toISOString(),
        duration: input.duration,
        notes: input.notes,
        locationId: input.locationId,
      },
    };

    const result = await this.executeGraphQL<{ updateAppointment: { appointment: BoulevardAppointment } }>(mutation, variables);

    return result.updateAppointment.appointment;
  }

  /**
   * Cancel appointment in Boulevard
   */
  async cancelAppointment(id: string, reason?: string): Promise<BoulevardAppointment> {
    const mutation = `
      mutation CancelAppointment($id: ID!, $input: CancelAppointmentInput!) {
        cancelAppointment(id: $id, input: $input) {
          appointment {
            id
            state
            cancelled
            cancellation {
              reason
              cancelledAt
            }
          }
        }
      }
    `;

    const variables = {
      id,
      input: { reason },
    };

    const result = await this.executeGraphQL<{ cancelAppointment: { appointment: BoulevardAppointment } }>(mutation, variables);

    return result.cancelAppointment.appointment;
  }

  /**
   * Get appointment by ID from Boulevard
   */
  async getAppointment(id: string): Promise<BoulevardAppointment | null> {
    const query = `
      query GetAppointment($id: ID!) {
        appointment(id: $id) {
          id
          staffId
          startAt
          endAt
          duration
          state
          cancelled
          clientId
          notes
          locationId
          appointmentServices {
            edges {
              node {
                id
                serviceId
                variationId
              }
            }
          }
        }
      }
    `;

    const result = await this.executeGraphQL<{ appointment: BoulevardAppointment | null }>(query, { id });
    return result.appointment;
  }

  /**
   * List appointments with filters
   */
  async listAppointments(filters?: {
    staffId?: string;
    locationId?: string;
    startAt?: Date;
    endAt?: Date;
    first?: number;
    after?: string;
  }): Promise<{ appointments: BoulevardAppointment[]; hasNextPage: boolean; endCursor?: string }> {
    const query = `
      query ListAppointments($filter: AppointmentFilterInput, $first: Int, $after: String) {
        appointments(filter: $filter, first: $first, after: $after) {
          edges {
            cursor
            node {
              id
              staffId
              startAt
              endAt
              duration
              state
              cancelled
              clientId
              notes
              locationId
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    const variables = {
      filter: {
        staffId: filters?.staffId,
        locationId: filters?.locationId,
        startAt: filters?.startAt ? { gte: filters.startAt.toISOString() } : undefined,
        endAt: filters?.endAt ? { lte: filters.endAt.toISOString() } : undefined,
      },
      first: filters?.first || 50,
      after: filters?.after,
    };

    const result = await this.executeGraphQL<{
      appointments: {
        edges: Array<{ cursor: string; node: BoulevardAppointment }>;
        pageInfo: { hasNextPage: boolean; endCursor?: string };
      };
    }>(query, variables);

    return {
      appointments: result.appointments.edges.map((e) => e.node),
      hasNextPage: result.appointments.pageInfo.hasNextPage,
      endCursor: result.appointments.pageInfo.endCursor,
    };
  }

  /**
   * Create time block in Boulevard
   */
  async createTimeBlock(input: BoulevardTimeBlockInput): Promise<any> {
    const mutation = `
      mutation CreateTimeBlock($input: CreateTimeBlockInput!) {
        createTimeBlock(input: $input) {
          timeBlock {
            id
            title
            startTime
            endTime
            isAllDay
            staffId
            locationId
          }
        }
      }
    `;

    const variables = {
      input: {
        title: input.title,
        startTime: input.startTime.toISOString(),
        endTime: input.endTime.toISOString(),
        isAllDay: input.isAllDay || false,
        staffId: input.staffId,
        locationId: input.locationId,
      },
    };

    const result = await this.executeGraphQL<{ createTimeBlock: { timeBlock: any } }>(mutation, variables);
    return result.createTimeBlock.timeBlock;
  }

  /**
   * Get client by ID from Boulevard
   */
  async getClient(id: string): Promise<any> {
    const query = `
      query GetClient($id: ID!) {
        client(id: $id) {
          id
          firstName
          lastName
          email
          phone
        }
      }
    `;

    const result = await this.executeGraphQL<{ client: any }>(query, { id });
    return result.client;
  }

  /**
   * Get staff by ID from Boulevard
   */
  async getStaff(id: string): Promise<any> {
    const query = `
      query GetStaff($id: ID!) {
        staff(id: $id) {
          id
          firstName
          lastName
          email
          isActive
        }
      }
    `;

    const result = await this.executeGraphQL<{ staff: any }>(query, { id });
    return result.staff;
  }

  /**
   * List all staff members
   */
  async listStaff(): Promise<any[]> {
    const query = `
      query ListStaff($first: Int) {
        staffs(first: $first) {
          edges {
            node {
              id
              firstName
              lastName
              email
              isActive
            }
          }
        }
      }
    `;

    const result = await this.executeGraphQL<{
      staffs: { edges: Array<{ node: any }> };
    }>(query, { first: 100 });

    return result.staffs.edges.map((e) => e.node);
  }

  /**
   * Health check - verify API connectivity
   */
  async healthCheck(): Promise<boolean> {
    try {
      const query = `
        query {
          business {
            id
            name
          }
        }
      `;
      await this.executeGraphQL(query);
      return true;
    } catch (error) {
      this.logger.error('Boulevard health check failed:', error);
      return false;
    }
  }
}

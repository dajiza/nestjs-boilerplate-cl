import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import type {
  ServiceAddon,
  ServiceCategorySummary,
  ServiceOptionGroup,
  ServiceOverride,
  ServiceStatus,
} from '../../../../../utils/types/boulevard.types';

@Entity({
  name: 'service',
})
export class ServiceEntity extends EntityRelationalHelper {
  @PrimaryColumn({ type: 'varchar', length: 255, comment: 'The ID of an object' })
  id: string;

  @Column({ type: 'boolean', comment: 'Active' })
  active: boolean;

  @Column({ type: 'boolean', comment: 'Addons can only booked alongside a standalone service and are not exposed in online booking' })
  addon: boolean;

  @Column({ type: 'jsonb', comment: 'Get any addons that are bookable at the given location' })
  addons: ServiceAddon[];

  @Column({ type: 'jsonb', comment: 'Service Category' })
  category: ServiceCategorySummary;

  @Index()
  @Column({ type: 'varchar', length: 255, comment: 'Service Category Id' })
  categoryId: string;

  @Column({ type: 'timestamp', comment: 'The date and time when the service was created' })
  createdAt: Date;

  @Column({ type: 'jsonb', comment: 'Custom field data wrapper' })
  custom: Record<string, any>;

  @Column({ type: 'jsonb', comment: 'Custom fields' })
  customFields: Record<string, any>[];

  @Column({ type: 'int', comment: 'Default duration in minutes' })
  defaultDuration: number;

  @Column({ type: 'int', comment: 'Default price in cents' })
  defaultPrice: number;

  @Column({ type: 'text', nullable: true, comment: 'Description' })
  description: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'External Id' })
  externalId: string | null;

  @Column({ type: 'varchar', length: 255, comment: 'Name' })
  name: string;

  @Column({ type: 'jsonb', comment: 'Service Option Groups' })
  serviceOptionGroups: ServiceOptionGroup[];

  @Column({ type: 'jsonb', comment: 'Get any service overrides that may be set' })
  serviceOverrides: ServiceOverride;

  @Column({ type: 'jsonb', comment: 'Get any service status overrides that may be set' })
  serviceStatus: ServiceStatus;

  @Column({ type: 'jsonb', comment: 'Order which this service is displayed alongside others' })
  sortPath: string;

  @Column({ type: 'timestamp', comment: 'The date and time when the service was last updated' })
  updatedAt: Date;
}

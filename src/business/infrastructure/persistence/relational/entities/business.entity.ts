import { Column, Entity, PrimaryColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import type { Address } from '../../../../../utils/types/boulevard.types';

@Entity({
  name: 'business',
})
export class BusinessEntity extends EntityRelationalHelper {
  @PrimaryColumn({ type: 'varchar', length: 255, comment: 'The ID of an object' })
  id: string;

  @Column({ type: 'jsonb', comment: 'Address of the business' })
  address: Address;

  @Column({
    type: 'boolean',
    nullable: true,
    comment: 'A setting to let a business decide if a person with multiple client profiles can log in to one of their profiles',
  })
  allowLoginWithMultipleClients: boolean | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Billing contact email for the business' })
  billingContactEmail: string | null;

  @Column({ type: 'jsonb', comment: 'Custom field data wrapper' })
  custom: Record<string, any>;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: "An optional URL to use to direct customers to a business's custom booking flow" })
  customBookingUrl: string | null;

  @Column({ type: 'jsonb', comment: 'Custom fields' })
  customFields: Record<string, any>[];

  @Column({ type: 'varchar', length: 255, comment: 'Name of the business' })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: 'Phone number for the business' })
  phone: string | null;

  @Column({ type: 'boolean', comment: 'A setting to enable/disable the ability to set and show the business location hours' })
  showLocationHours: boolean;

  @Column({ type: 'varchar', length: 100, comment: 'Timezone associated with the business' })
  tz: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Website for the business' })
  website: string | null;
}

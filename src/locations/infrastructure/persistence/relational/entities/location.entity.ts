import { Column, Entity, PrimaryColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import type { Address, LocationDays, PaymentOption } from '../../../../../utils/types/boulevard.types';

@Entity({
  name: 'location',
})
export class LocationEntity extends EntityRelationalHelper {
  @PrimaryColumn({ type: 'varchar', length: 255, comment: 'The ID of an object' })
  id: string;

  @Column({ type: 'jsonb', comment: 'Address of the location' })
  address: Address;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Instructions for a client upon arrival at the location' })
  arrivalInstructions: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Billing contact email for the location' })
  billingContactEmail: string | null;

  @Column({ type: 'varchar', length: 255, comment: "Name of the location's business" })
  businessName: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Contact email for the location' })
  contactEmail: string | null;

  @Column({ type: 'jsonb', nullable: true, comment: 'The coordinates of the location' })
  coordinates: Record<string, any> | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Location external id' })
  externalId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Google Place ID' })
  googlePlaceId: string | null;

  @Column({ type: 'jsonb', nullable: true, comment: "Stores the location's daily business hours" })
  hours: LocationDays[] | null;

  @Column({
    type: 'boolean',
    comment: 'Indicates that the location is a remote location, and that appointments for this location are carried out remotely',
  })
  isRemote: boolean;

  @Column({ type: 'varchar', length: 255, comment: 'Name of the location' })
  name: string;

  @Column({ type: 'jsonb', comment: 'Payment options for the location' })
  paymentOptions: PaymentOption[];

  @Column({ type: 'varchar', length: 50, nullable: true, comment: 'Phone number for the location' })
  phone: string | null;

  @Column({ type: 'boolean', comment: 'A setting to enable/disable the ability to set and show the location hours' })
  showLocationHours: boolean;

  @Column({ type: 'varchar', length: 100, comment: 'Timezone associated with the location' })
  tz: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Website for the location' })
  website: string | null;
}

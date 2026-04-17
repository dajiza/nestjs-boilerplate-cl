import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import type {
  CreditCard,
  MarketingSetting,
  ClientNote,
  BoulevardLocationSummary,
  ReminderSetting,
  BoulevardTag,
} from '../../../../../utils/types/boulevard.types';

@Entity({
  name: 'client',
})
export class ClientEntity extends EntityRelationalHelper {
  @PrimaryColumn({ type: 'varchar', length: 255, comment: 'The ID of an object' })
  id: string;

  @Column({
    type: 'boolean',
    comment: 'Whether the client is active internally in Boulevard. Deactivated clients are usually merged with other clients',
  })
  active: boolean;

  @Column({ type: 'int', default: 0, comment: 'The total number of appointments that this client has booked (excluding cancelled appointments)' })
  appointmentCount: number;

  @Column({ type: 'timestamp', comment: 'The date and time when the client was created' })
  createdAt: Date;

  @Column({ type: 'jsonb', comment: 'Credit cards on file for the client' })
  creditCardsOnFile: CreditCard[];

  @Column({ type: 'int', default: 0, comment: 'Account Balance associated with this client' })
  currentAccountBalance: number;

  @Column({ type: 'timestamp', nullable: true, comment: 'Account Balance updated at' })
  currentAccountUpdatedAt: Date | null;

  @Column({ type: 'jsonb', nullable: true, comment: 'Custom field data wrapper' })
  custom: Record<string, any> | null;

  @Column({ type: 'jsonb', comment: 'Custom fields' })
  customFields: Record<string, any>[];

  @Column({ type: 'date', nullable: true, comment: 'Date of birth' })
  dob: Date | null;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Email address' })
  email: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'External client ID' })
  externalId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'First name' })
  firstName: string | null;

  @Column({ type: 'boolean', default: false, comment: 'Whether the client has a credit card on file' })
  hasCardOnFile: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Last name' })
  lastName: string | null;

  @Column({ type: 'jsonb', comment: "The client's marketing settings" })
  marketingSettings: MarketingSetting[];

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'ID of the client this client was merged into, if inactive' })
  mergedIntoClientId: string | null;

  @Index()
  @Column({ type: 'varchar', length: 50, nullable: true, comment: 'Mobile phone number' })
  mobilePhone: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Full name' })
  name: string | null;

  @Column({ type: 'jsonb', comment: 'Notes that are available for the client' })
  notes: ClientNote[];

  @Column({ type: 'jsonb', nullable: true, comment: 'Primary location (based on last 3 appointments)' })
  primaryLocation: BoulevardLocationSummary | null;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: 'Pronoun' })
  pronoun: string | null;

  @Column({ type: 'jsonb', comment: "The client's reminder settings" })
  reminderSettings: ReminderSetting[];

  @Column({ type: 'text', nullable: true, comment: 'Scheduling alert' })
  schedulingAlert: string | null;

  @Column({ type: 'jsonb', comment: 'Tags that have been applied to the client' })
  tags: BoulevardTag[];

  @Column({ type: 'timestamp', comment: 'The date and time when the client was last updated' })
  updatedAt: Date;
}

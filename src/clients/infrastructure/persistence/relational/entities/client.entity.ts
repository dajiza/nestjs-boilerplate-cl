import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'client',
})
export class ClientEntity extends EntityRelationalHelper {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @Column({ type: 'boolean' })
  active: boolean;

  @Column({ type: 'int', default: 0 })
  appointmentCount: number;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  creditCardsOnFile: Record<string, any>[] | null;

  @Column({ type: 'int', default: 0 })
  currentAccountBalance: number;

  @Column({ type: 'timestamp', nullable: true })
  currentAccountUpdatedAt: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  custom: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  customFields: Record<string, any>[] | null;

  @Column({ type: 'text', array: true, nullable: true })
  keys: string[] | null;

  @Column({ type: 'date', nullable: true })
  dob: Date | null;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  externalId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  firstName: string | null;

  @Column({ type: 'boolean', default: false })
  hasCardOnFile: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName: string | null;

  @Column({ type: 'jsonb', nullable: true })
  marketingSettings: Record<string, any>[] | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mergedIntoClientId: string | null;

  @Index()
  @Column({ type: 'varchar', length: 50, nullable: true })
  mobilePhone: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string | null;

  @Column({ type: 'jsonb', nullable: true })
  notes: Record<string, any>[] | null;

  @Column({ type: 'jsonb', nullable: true })
  primaryLocation: Record<string, any> | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  pronoun: string | null;

  @Column({ type: 'jsonb', nullable: true })
  reminderSettings: Record<string, any>[] | null;

  @Column({ type: 'text', nullable: true })
  schedulingAlert: string | null;

  @Column({ type: 'jsonb', nullable: true })
  tags: Record<string, any>[] | null;

  @Column({ type: 'timestamp' })
  updatedAt: Date;
}

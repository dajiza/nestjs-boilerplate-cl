import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { AppRoleSummary, StaffLocationAbilities, BoulevardLocationSummary, StaffRoleSummary } from '../../../../../utils/types/boulevard.types';

@Entity({
  name: 'staff',
})
export class StaffEntity extends EntityRelationalHelper {
  @PrimaryColumn({ type: 'varchar', length: 255, comment: 'The ID of an object' })
  id: string;

  @Column({ type: 'boolean', nullable: true, comment: 'Active' })
  active: boolean | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Alternate Id' })
  alternateId: string | null;

  @Column({ type: 'jsonb', comment: 'App role' })
  appRole: AppRoleSummary;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'App role ID' })
  appRoleId: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: 'Avatar' })
  avatar: string | null;

  @Column({ type: 'text', nullable: true, comment: 'Friendly bio for the staff' })
  bio: string | null;

  @Column({ type: 'timestamp', comment: 'The date and time when the staff was created' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 255, comment: 'Display name, preferred over other name fields in client-facing features' })
  displayName: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Email address' })
  email: string | null;

  @Column({ type: 'boolean', comment: 'If the staff is enabled for future locations' })
  enabledForFutureLocations: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'External Id' })
  externalId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: "A staff member's client facing nickname" })
  externalNickname: string | null;

  @Column({ type: 'boolean', nullable: true, comment: 'External bookability' })
  externallyBookable: boolean | null;

  @Column({ type: 'varchar', length: 255, comment: 'First name' })
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Last name' })
  lastName: string | null;

  @Column({ type: 'jsonb', comment: 'Object describing what actions the current staff member can perform with a location' })
  locationAbilities: StaffLocationAbilities;

  @Column({ type: 'jsonb', nullable: true, comment: 'List of locations the staff is assigned to' })
  locations: BoulevardLocationSummary[] | null;

  @Index()
  @Column({ type: 'varchar', length: 50, nullable: true, comment: 'Mobile phone' })
  mobilePhone: string | null;

  @Column({ type: 'varchar', length: 255, comment: 'Full name' })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Nick name' })
  nickname: string | null;

  @Column({ type: 'jsonb', comment: 'Role' })
  role: StaffRoleSummary;

  @Column({ type: 'varchar', length: 255, comment: 'Role ID' })
  staffRoleId: string;

  @Column({ type: 'boolean', nullable: true, comment: 'Suspended' })
  suspended: boolean | null;

  @Column({ type: 'timestamp', comment: 'The date and time when the staff was last updated' })
  updatedAt: Date;
}

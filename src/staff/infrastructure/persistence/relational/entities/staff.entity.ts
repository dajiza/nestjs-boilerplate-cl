import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'staff',
})
export class StaffEntity extends EntityRelationalHelper {
  // ===== 必填字段 =====
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Index()
  @Column({ type: 'varchar', length: 50 })
  mobilePhone: string;

  @Column({ type: 'boolean' })
  active: boolean;

  // ===== 可选字段 =====
  @Column({ type: 'varchar', length: 255, nullable: true })
  displayName: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  firstName: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName: string | null;

  @Column({ type: 'timestamp', nullable: true })
  createdAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alternateId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  appRole: Record<string, any> | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  appRoleId: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar: string | null;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'boolean', nullable: true })
  enabledForFutureLocations: boolean | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  externalId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  externalNickname: string | null;

  @Column({ type: 'boolean', nullable: true })
  externallyBookable: boolean | null;

  @Column({ type: 'jsonb', nullable: true })
  locationAbilities: Record<string, any> | null;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  locationId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  locations: Record<string, any>[] | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nickname: string | null;

  @Column({ type: 'jsonb', nullable: true })
  role: Record<string, any> | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  staffRoleId: string | null;

  @Column({ type: 'boolean', nullable: true })
  suspended: boolean | null;
}

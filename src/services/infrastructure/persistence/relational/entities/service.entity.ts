import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'service',
})
export class ServiceEntity extends EntityRelationalHelper {
  // ===== 必填字段 =====
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'boolean' })
  active: boolean;

  @Column({ type: 'boolean' })
  addon: boolean;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'int' })
  defaultDuration: number;

  @Column({ type: 'int' })
  defaultPrice: number;

  // ===== 可选字段 =====
  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  locationId: string | null;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  categoryId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  custom: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  customFields: Record<string, any>[] | null;

  @Column({ type: 'text', array: true, nullable: true })
  keys: string[] | null;

  @Column({ type: 'jsonb', nullable: true })
  addons: Record<string, any>[] | null;

  @Column({ type: 'jsonb', nullable: true })
  category: Record<string, any> | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  externalId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  serviceOptionGroups: Record<string, any>[] | null;

  @Column({ type: 'jsonb', nullable: true })
  serviceOverrides: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  serviceStatus: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  sortPath: Record<string, any> | null;
}

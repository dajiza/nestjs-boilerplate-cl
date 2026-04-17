import { Column, Entity, PrimaryColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'service_category',
})
export class ServiceCategoryEntity extends EntityRelationalHelper {
  @PrimaryColumn({ type: 'varchar', length: 255, comment: 'The ID of an object' })
  id: string;

  @Column({ type: 'boolean', comment: 'Active' })
  active: boolean;

  @Column({ type: 'timestamp', comment: 'The date and time when the service category was created' })
  createdAt: Date;

  @Column({ type: 'varchar', length: 255, comment: 'Name' })
  name: string;

  @Column({ type: 'jsonb', nullable: true, comment: 'Services' })
  services: Record<string, any> | null;

  @Column({ type: 'jsonb', comment: 'Order which this service category is displayed alongside others' })
  sortPath: string;

  @Column({ type: 'timestamp', comment: 'The date and time when the service category was last updated' })
  updatedAt: Date;
}

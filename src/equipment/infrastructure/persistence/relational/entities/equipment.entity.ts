import { Column, Entity, Index, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { ServiceEntity } from '../../../../../services/infrastructure/persistence/relational/entities/service.entity';

@Entity({
  name: 'equipment',
})
export class EquipmentEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  serviceId: string | null;

  @ManyToOne(() => ServiceEntity)
  @JoinColumn({ name: 'serviceId' })
  service?: ServiceEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

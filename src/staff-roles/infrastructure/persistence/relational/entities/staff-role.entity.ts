import { Column, Entity, PrimaryColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'staff_role',
})
export class StaffRoleEntity extends EntityRelationalHelper {
  @PrimaryColumn({ type: 'varchar', length: 255, comment: 'The ID of an object' })
  id: string;

  @Column({ type: 'varchar', length: 255, comment: 'Name' })
  name: string;
}

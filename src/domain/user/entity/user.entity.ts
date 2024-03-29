import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { BlogEntity } from '../../blog/entity/blog.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: 255, select: true, unique: true })
  public email!: string;

  @Column({ type: 'varchar', length: 500 })
  @Exclude({ toPlainOnly: true })
  public password!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  public last_name!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  public first_name!: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  public name!: string;

  @Column({ type: 'varchar', nullable: true, select: false })
  public refresh_token!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  public profile_photo_url!: string;

  @OneToMany(() => BlogEntity, (b: BlogEntity) => b.admin, {
    cascade: true,
    eager: true,
  })
  public blogs!: BlogEntity[];

  @Column({ type: 'varchar', nullable: true })
  public permissions!: string;

  @Column({ type: 'jsonb', default: null })
  public passwordReset!: any;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    select: true,
  })
  @Exclude()
  public created_at!: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    select: true,
  })
  @Exclude()
  public updated_at!: Date;
}

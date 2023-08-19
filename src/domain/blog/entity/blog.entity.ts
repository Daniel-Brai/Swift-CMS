import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostEntity } from '../../post/entity/post.entity';
import { UserEntity } from '../../user/entity/user.entity';

@Entity('blogs')
export class BlogEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @ManyToOne(() => UserEntity, (u: UserEntity) => u.blogs)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public creator!: UserEntity;

  @Column({ type: 'varchar', length: 255 })
  public name!: string;

  @Column({ type: 'varchar', length: 500 })
  public description!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public blog_image_url!: string;

  @OneToMany(() => PostEntity, (p: PostEntity) => p.blog, {
    eager: true,
    cascade: true,
  })
  public posts!: Array<PostEntity>;

  @Column('jsonb', { array: true, default: [] })
  public assignees: Array<UserEntity>;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    select: true,
  })
  public created_at!: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    select: true,
  })
  public updated_at!: Date;
}

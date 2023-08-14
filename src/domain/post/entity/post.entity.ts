import {
  BaseEntity,
  Entity,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostImageEntity } from './post-image.entity';
import { BlogEntity } from '../../blog/entity/blog.entity';

@Entity('posts')
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  public title!: string;

  @Column({ type: 'text' })
  public content: string;

  @Column('jsonb', { array: true, default: [] })
  public category!: Array<string>;

  @ManyToOne(() => BlogEntity, (b: BlogEntity) => b.posts)
  @JoinColumn({ name: 'blog_name', referencedColumnName: 'name' })
  public blog!: BlogEntity;

  @OneToMany(() => PostImageEntity, (pi: PostImageEntity) => pi.post, {
    eager: true,
    cascade: true,
  })
  public images: Array<PostImageEntity>;

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

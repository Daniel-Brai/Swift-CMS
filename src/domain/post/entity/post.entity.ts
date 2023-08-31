import {
  BaseEntity,
  Entity,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BlogEntity } from '../../blog/entity/blog.entity';
import { PostCategory } from '../types/post-category';
import { PostComment } from '../types/post-comment';
import { PostImage } from '../types/post-image';

@Entity('posts')
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  public title!: string;

  @Column({ type: 'text' })
  public content: string;

  @ManyToOne(() => BlogEntity, (b: BlogEntity) => b.posts, { nullable: true })
  @JoinColumn({ name: 'blog_name', referencedColumnName: 'name' })
  public blog!: BlogEntity;

  @Column('jsonb', { array: true, default: [] })
  public category!: Array<PostCategory>;

  @Column('jsonb', { array: true, default: [] })
  public images: Array<PostImage>;

  @Column('jsonb', { array: true, default: [] })
  public comments: Array<PostComment>;

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

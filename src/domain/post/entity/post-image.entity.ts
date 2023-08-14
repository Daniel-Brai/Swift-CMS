import { 
  BaseEntity, 
  Entity, 
  Column, 
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn 
} from 'typeorm';
import { PostEntity } from './post.entity';

@Entity('post-images')
export class PostImageEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @ManyToOne(() => PostEntity, (p: PostEntity) => p.images)
  @JoinColumn({ name: 'post_name', referencedColumnName: 'name' })
  public post!: PostEntity;

  @Column({ type: 'varchar', nullable: true, length: 500 })
  public post_image_url: string;

  @Column({ type: 'varchar', nullable: true, length: 255 });
  public tag: string;
}

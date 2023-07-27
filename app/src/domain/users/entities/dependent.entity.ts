import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ROLE } from '../users.consts';
import { User } from './user.entity';
import { hash } from '../../auth/helpers/auth.helpers';

@Entity()
export class Dependent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  public username: string;

  @Column({ nullable: false, unique: true })
  public email: string;

  @Column({ nullable: false })
  @Exclude()
  public password: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: ['Owner', 'Editor', 'Viewer'],
    default: 'Viewer',
  })
  public role: ROLE;

  @ManyToOne(() => User, (user: User) => user.username, { onDelete: 'CASCADE' })
  public manager: User; 

  @CreateDateColumn()
  @Exclude()
  public createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  public updateAt: Date;

  @BeforeInsert()
  async Update() {
    this.password = await hash(this.password);
  }
}

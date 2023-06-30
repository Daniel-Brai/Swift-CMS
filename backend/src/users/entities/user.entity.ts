import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ROLE } from '../users.consts';
import { Dependent } from './dependent.entity';
import { hash } from '../../auth/helpers/auth.helpers';

@Entity()
export class User {
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
    default: 'Owner',
  })
  public role: ROLE;

  @OneToMany(() => Dependent, (dependent: Dependent) => dependent.username, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  public dependents: Dependent[]; 

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

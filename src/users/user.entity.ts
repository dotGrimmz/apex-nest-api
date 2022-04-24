import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  AfterLoad,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @Column()
  email: string;

  @Column()
  password: string;

  @PrimaryGeneratedColumn()
  id: number;

  @AfterInsert()
  logInsert() {
    console.log('inserted User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('updated user with id:', this.id);
  }

  @AfterRemove()
  logDelete() {
    console.log('removed user with id:', this.id);
  }

  @AfterLoad()
  logUserFound() {
    console.log('queried user with id:', this.id);
  }
}

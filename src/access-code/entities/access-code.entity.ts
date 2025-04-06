import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'access_code',
})
export class AccessCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;
}

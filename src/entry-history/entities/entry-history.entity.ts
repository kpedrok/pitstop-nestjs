import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'entry_history',
})
export class EntryHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  enteredAt: Date;
}

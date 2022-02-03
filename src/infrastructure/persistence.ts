import { DateTime } from "luxon";
import { createConnection, Entity, PrimaryGeneratedColumn, Column, ConnectionOptions, Repository } from "typeorm";

export interface PersistenceConfig {
  connectionConfig: ConnectionOptions;
}

export interface PersistenceBundle {
  birthdayRepository: Repository<Birthday>;
  selectedUsersRepository: Repository<SelectedUsers>;
}

export const createPersistent = async (config: PersistenceConfig): Promise<PersistenceBundle> => {
  const connection = await createConnection({
    ...config.connectionConfig,
    entities: [
      Birthday,
      SelectedUsers,
    ]
  });
  const birthdayRepository = connection.getRepository(Birthday);
  const selectedUsersRepository = connection.getRepository(SelectedUsers);
  return {
    birthdayRepository,
    selectedUsersRepository,
  }
}

@Entity()
export class Birthday {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    isToday(dateTime: DateTime): boolean {
      return true;
    }
}

@Entity()
export class SelectedUsers {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: string;

    @Column()
    select_key: string;
}

import * as Bree from 'bree';
import { join } from 'path';

export interface RunnerConfig {
  birthdayJob: {
    cron: string;
  }
}

export const setupRunner = async (config: RunnerConfig): Promise<void> => {
  const bree = new Bree({
    root: join(__dirname, 'jobs'),
    jobs: [
      {
        name: 'birthday-job',
        path: join(__dirname, 'jobs', 'notify-birthdays.js'),
        cron: config.birthdayJob.cron,
        cronValidate: {
          useBlankDay: true
        }
      }
    ]
  });
  bree.start();
};

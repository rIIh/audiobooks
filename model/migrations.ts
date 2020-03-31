import { addColumns, schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';
import Chapter from './Chapter';

export default schemaMigrations({
  migrations: [
    {
      // ⚠️ Set this to a number one larger than the current schema version
      toVersion: 2,
      steps: [
        // See "Migrations API" for more details
        addColumns({
          table: Chapter.table,
          columns: [{ name: 'duration', type: 'number' }],
        }),
      ],
    },
    {
      toVersion: 3,
      steps: [
        addColumns({
          table: Chapter.table,
          columns: [
            {
              name: 'complete',
              type: 'boolean',
            },
            {
              name: 'progress',
              type: 'number',
            },
          ],
        }),
      ],
    },
  ],
});

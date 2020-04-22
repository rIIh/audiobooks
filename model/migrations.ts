import { addColumns, schemaMigrations, createTable } from '@nozbe/watermelondb/Schema/migrations';
import Chapter from './Chapter';
import FilePath from "./FilePath";

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
    {
      toVersion: 4,
      steps: [
        createTable({
          name: FilePath.table,
          columns: [
            { name: 'book_id', type: 'string' },
            { name: 'path', type: 'string' },
            { name: 'url', type: 'string' },
            { name: 'remote_size', type: 'number', isOptional: true },
          ],
        }),
      ],
    },
  ],
});

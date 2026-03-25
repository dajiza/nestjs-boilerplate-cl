import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import { config } from 'dotenv';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'nestjs',
  entities: [__dirname + '/../../../src/**/*.entity{.ts,.js}'],
  synchronize: false,
});

interface BoulevardClient {
  node: {
    id: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    email?: string | null;
    mobilePhone?: string | null;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    externalId?: string | null;
    primaryLocation?: { id: string } | null;
  };
}

async function importClients() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('Usage: npx ts-node -r tsconfig-paths/register scripts/import/clients/import.ts <json-file-path>');
    console.error('Example: npx ts-node -r tsconfig-paths/register scripts/import/clients/import.ts /Users/cs/Downloads/clients.json');
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  console.log(`Reading file: ${filePath}`);

  const rawData = fs.readFileSync(filePath, 'utf-8');
  const clients: BoulevardClient[] = JSON.parse(rawData);

  console.log(`Found ${clients.length} clients to import`);

  await AppDataSource.initialize();
  console.log('Database connected');

  // Dynamic import after DataSource initialization
  const { ClientEntity } = await import(
    '../../../src/clients/infrastructure/persistence/relational/entities/client.entity'
  );

  const repository = AppDataSource.getRepository(ClientEntity);

  let imported = 0;
  let skipped = 0;
  let failed = 0;

  for (const item of clients) {
    const node = item.node;

    try {
      // Check if client already exists
      const existing = await repository.findOne({ where: { id: node.id } });
      if (existing) {
        skipped++;
        continue;
      }

      const client = new ClientEntity();
      client.id = node.id;
      client.active = node.active;
      client.createdAt = new Date(node.createdAt);
      client.updatedAt = new Date(node.updatedAt);
      client.email = node.email || null;
      client.mobilePhone = node.mobilePhone || null;
      client.name = node.name || null;
      client.firstName = node.firstName || null;
      client.lastName = node.lastName || null;
      client.externalId = node.externalId || null;
      client.primaryLocation = node.primaryLocation || null;

      // Set default values for required fields
      client.appointmentCount = 0;
      client.currentAccountBalance = 0;
      client.hasCardOnFile = false;

      await repository.save(client);
      imported++;
    } catch (error) {
      console.error(`Failed to import client ${node.id}:`, error);
      failed++;
    }
  }

  console.log(`\n========================================`);
  console.log(`Import completed!`);
  console.log(`========================================`);
  console.log(`  Imported: ${imported}`);
  console.log(`  Skipped (already exists): ${skipped}`);
  console.log(`  Failed: ${failed}`);
  console.log(`========================================`);

  await AppDataSource.destroy();
}

importClients().catch((error) => {
  console.error('Import failed:', error);
  process.exit(1);
});

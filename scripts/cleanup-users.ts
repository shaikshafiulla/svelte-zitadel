import { readFileSync, existsSync } from 'fs';

const ZITADEL_URL = process.env.ZITADEL_URL || 'http://localhost:8080';
let PAT = process.env.PAT;

if (!PAT) {
  if (existsSync('admin.pat')) {
    PAT = readFileSync('admin.pat', 'utf-8').trim();
    console.log('Found admin.pat file, using it for authentication.');
  } else {
    console.error('Error: PAT not found.');
    process.exit(1);
  }
}

const headers: Record<string, string> = {
  'Authorization': `Bearer ${PAT}`,
  'Content-Type': 'application/json',
};

async function api(method: string, path: string, body?: any) {
  const url = `${ZITADEL_URL}${path}`;
  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API Error ${response.status} ${path}: ${text}`);
  }

  return response.json();
}

async function main() {
  console.log('🧹 Cleaning up test users...\n');

  const testUsers = [
    'freelancer@solodev.local',
    'client@solodev.local'
  ];

  for (const email of testUsers) {
    try {
      console.log(`🔍 Searching for user: ${email}`);

      const userList = await api('POST', '/management/v1/users/_search', {
        queries: [{ userNameQuery: { userName: email, method: 'TEXT_QUERY_METHOD_EQUALS' } }]
      });

      if (userList.result && userList.result.length > 0) {
        const userId = userList.result[0].id;
        console.log(`   Found user ID: ${userId}`);

        console.log(`Deleting user...`);
        await api('DELETE', `/v2/users/${userId}`, {});
        console.log(`User ${email} deleted successfully\n`);
      } else {
        console.log(`User ${email} not found (already deleted or never created)\n`);
      }
    } catch (error: any) {
      console.error(` Error processing ${email}: ${error.message}\n`);
    }
  }

  console.log('CLEANUP COMPLETE!');
  console.log('Run "npm run setup:zitadel" to create fresh users');
}

main().catch((err) => {
  console.error('\nCleanup Failed:', err.message);
  process.exit(1);
});

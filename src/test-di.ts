import container from './core/infrastructure/di/container';

async function test() {
  const logger = container.resolve('logger');
  logger.info('Testing DI Container with Use Cases...');

  const getPublicProfile = container.resolve('getPublicProfile');
  const profile = await getPublicProfile.execute('1');
  logger.info('Public Profile Fetched:', profile.user.name);

  const getFreelancerDashboard = container.resolve('getFreelancerDashboard');
  const dashboard = await getFreelancerDashboard.execute('1');
  logger.info('Dashboard Data:', JSON.stringify(dashboard.stats));
}

test().catch(console.error);

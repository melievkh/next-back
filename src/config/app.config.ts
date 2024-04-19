import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: 'development',
  port: parseInt(process.env.API_PORT, 10) || 5000,
}));

import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  jwtSecret: process.env.JWT_SECRET || 'foodbridge_ai_super_secret_jwt_key_2026_secure',
  nodeEnv: process.env.NODE_ENV || 'development',
  aiMockMode: process.env.AI_MOCK_MODE !== 'false',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
};

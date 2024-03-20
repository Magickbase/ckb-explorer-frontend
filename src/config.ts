export default {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  CHAIN_TYPE: process.env.REACT_APP_CHAIN_TYPE || 'mainnet',
  BASE_URL: process.env.REACT_APP_BASE_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL,
  BACKUP_NODES: process.env.REACT_APP_BACKUP_NODES?.split(',') || [],
}

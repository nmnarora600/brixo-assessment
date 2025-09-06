export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/brixo_ifsc',
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD
  },
  business: {
    staleDays: parseInt(process.env.STALE_DAYS || '7', 10),
    redisTtlSeconds: parseInt(process.env.REDIS_TTL_SECONDS || '300', 10)
  },
  providers: {
    razorpayBase: process.env.RAZORPAY_IFSC_BASE || 'https://ifsc.razorpay.com'
  }
};

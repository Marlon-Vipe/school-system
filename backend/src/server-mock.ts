import 'reflect-metadata';
import app from './app-mock';
import { config } from './config';
import { initializeDatabase } from './config/database-mock';

const startServer = async (): Promise<void> => {
  try {
    // Initialize mock database connection
    await initializeDatabase();

    // Start the server
    const server = app.listen(config.port, () => {
      console.log(`
🚀 Server is running in MOCK mode!
📍 Environment: ${config.nodeEnv}
🌐 Port: ${config.port}
📊 Health Check: http://localhost:${config.port}/api/health
📚 API Base URL: http://localhost:${config.port}/api
⚠️  Note: Using mock database - no real data persistence
      `);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      console.log(`\n🛑 ${signal} received. Starting graceful shutdown...`);
      
      server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error('❌ Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { apiRouter } from './server/apiHandler.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes
app.use('/api', apiRouter);

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Jiya-Portfolio server listening on port ${PORT}`);
    console.log(`📧 Target notification email: ${process.env.NOTIFICATION_EMAIL || 'jiyab623@gmail.com'}`);
    console.log(`🔑 Resend status: ${process.env.RESEND_API_KEY ? 'Configured' : 'Awaiting RESEND_API_KEY'}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

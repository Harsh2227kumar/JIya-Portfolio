import { portfolioData } from '../server/portfolioData.ts';

export default function handler(_req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  return res.status(200).json(portfolioData);
}

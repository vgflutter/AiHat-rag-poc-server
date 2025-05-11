import express from 'express';
import ragRoute from './rag.route.js';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/',
    route: ragRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;

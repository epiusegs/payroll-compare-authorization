import { json, Router } from 'express';

const router = Router();
router.use(json());

router.use('/health', (_req, res) => {
  res.status(200).send({
    name: 'lifion-generic-entity-viewer',
    message: 'Service is running',
  });
});

export default router;

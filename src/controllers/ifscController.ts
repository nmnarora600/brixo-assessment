import { Router } from 'express';
import Joi from 'joi';
import { getIfsc } from '../services/ifscService';

const router = Router();

router.get('/ifsc/:code', async (req, res) => {
  const schema = Joi.object({
    code: Joi.string().uppercase().trim().required(),
    refresh: Joi.string().valid('true','false').optional()
  });
  const { error, value } = schema.validate({ code: req.params.code, refresh: req.query.refresh });
  if (error) return res.status(400).json({ error: error.message });

  try {
    const data = await getIfsc(value.code, value.refresh === 'true');
    return res.json(data);
  } catch (e: any) {
    const status = e.status || 500;
    return res.status(status).json({ error: e.message || 'Internal error' });
  }
});

export default router;

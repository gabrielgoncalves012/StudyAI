import { Router } from "express";

export const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Express server is running 🚀' })
});
import * as inference from './oci/generative-ai-inference';
import { Request, Response, NextFunction } from 'express';

interface ParseIngredientsRequest {
  recipeText: string;
}

export async function parseIngredients(req: Request, res: Response) {
  const { recipeText } = await req.body as ParseIngredientsRequest;

  try {
    const ingredients = await inference.parseIngredients(recipeText);
    res.status(200).json({ items: ingredients });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
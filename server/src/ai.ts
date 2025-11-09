import * as inference from './oci/generative-ai-inference';
import { Request, Response } from 'express';

interface ParseIngredientsRequest {
  recipeText: string;
}

export async function parseIngredients(req: Request, res: Response) {
  const { recipeText } = req.body as ParseIngredientsRequest;

  try {
    const ingredients = await inference.parseIngredients(recipeText);
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
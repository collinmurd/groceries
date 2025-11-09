import * as inference from './oci/generative-ai-inference';
import { pino } from 'pino';
import { Request, Response } from 'express';
import * as cheerio from 'cheerio';

const logger = pino();

interface ParseIngredientsRequest {
  recipeText: string;
  recipeUrl: string;
}

export async function parseIngredients(req: Request, res: Response) {
  const { recipeText, recipeUrl } = req.body as ParseIngredientsRequest;
  if (recipeText && recipeUrl) {
    res.status(400).json({ error: 'Provide either recipeText or recipeUrl, not both.' });
    return;
  }

  if (!recipeText && !recipeUrl) {
    res.status(400).json({ error: 'Either recipeText or recipeUrl must be provided.' });
    return;
  }

  const input = recipeText || await getRecipeTextFromUrl(recipeUrl);
  logger.info(`Received input for ingredient parsing. Tokens: ${input.length}`);

  try {
    const ingredients = await inference.parseIngredients(input);
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

async function getRecipeTextFromUrl(url: string): Promise<string> {
  // Fetch the HTML content from the URL
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();

  // Parse the HTML using Cheerio
  const $ = cheerio.load(html);

  // Remove unwanted elements including noscript tags
  $('script, style, noscript, img, svg, iframe, video, audio').remove();

  // Get the text content (similar to Ctrl+A copy)
  const text = $('body').text();

  // Clean up excessive whitespace and filter out any remaining HTML tags
  const result = text
    .split('\n')
    .map((line: string) => line.trim())
    .filter((line: string) => {
      // Filter out empty lines and lines that look like HTML tags
      if (line.length === 0) return false;
      if (line.startsWith('<') && line.includes('>')) return false;
      return true;
    })
    .join('\n');

  return result;
}
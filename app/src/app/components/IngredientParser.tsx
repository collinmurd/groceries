import { Button, SegmentedControl, Textarea, TextInput } from "@mantine/core";
import { useState } from "react";
import { parseIngredientsWithText } from "../../services/api";

export function IngredientParser() {
  const [inputMode, setInputMode] = useState<string>('paste');
  const [pasteInput, setPasteInput] = useState<string>('');
  const [linkInput, setLinkInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [parsedIngredients, setParsedIngredients] = useState<string[]>([]);

  const parseIngredients = () => {
    setErrorMessage(null);
    // Placeholder for parsing logic
    console.log("Parsing ingredients...");
    const input = inputMode === 'paste' ? pasteInput : linkInput;
    if (!input) {
      setErrorMessage("Input cannot be empty.");
      return;
    }

    parseIngredientsWithText(input)
      .then(ingredients => {
        console.log("Parsed ingredients:", ingredients);
        setParsedIngredients(ingredients);
      })
      .catch(err => {
        setErrorMessage("Error parsing ingredients: " + err.message);
      });
  }

  return (
    <div>
      <h2>AI Ingredient Parser</h2>
      <p>Either paste a recipe below, or a link to a recipe.</p>
      <div>
        <SegmentedControl
          value={inputMode}
          onChange={setInputMode}
          data={[
            { label: 'Paste Recipe', value: 'paste' },
            { label: 'Recipe Link', value: 'link' },
          ]}
        />
      </div>
      <div style={{ marginTop: 20 }}>
        {inputMode === 'paste' ?
          <Textarea
            placeholder="Paste your recipe here..."
            rows={10}
            style={{ width: '100%', marginTop: 10 }}
            value={pasteInput}
            onChange={(event) => setPasteInput(event.currentTarget.value)}
          />
          :
          <TextInput
            type="text"
            placeholder="Enter recipe URL here..."
            style={{ width: '100%', marginTop: 10 }}
            value={linkInput}
            onChange={(event) => setLinkInput(event.currentTarget.value)}
          />
        }
      </div>
      <div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>
      <div>
        <Button style={{ marginTop: 20 }} onClick={parseIngredients}>Parse Ingredients</Button>
      </div>
      <div>
        {parsedIngredients.length > 0 && <IngredientListDisplay ingredients={parsedIngredients} />}
      </div>
    </div>
  );
}

function IngredientListDisplay({ ingredients }: { ingredients: string[] }) {
  return (
    <div>
      <h3>Parsed Ingredients</h3>
      <ul>
        {ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
    </div>
  );
}
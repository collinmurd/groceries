import { Box, Button, Checkbox, LoadingOverlay, SegmentedControl, Textarea, TextInput } from "@mantine/core";
import { forwardRef, useEffect, useRef, useState } from "react";
import * as api from "../../services/api";
import { IngredientParserResult } from "@groceries/shared";

export interface IngredientParserProps {
  finished: () => void;
}

export function IngredientParser({ finished }: IngredientParserProps) {
  const [inputMode, setInputMode] = useState<string>('paste');
  const [pasteInput, setPasteInput] = useState<string>('');
  const [linkInput, setLinkInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [parsedIngredients, setParsedIngredients] = useState<IngredientParserResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const ingredientListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (parsedIngredients.length > 0 && ingredientListRef.current) {
      ingredientListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [parsedIngredients]);

  const parseIngredients = () => {
    setErrorMessage(null);
    setLoading(true);
    const input = inputMode === 'paste' ? pasteInput : linkInput;
    if (!input) {
      setErrorMessage("Input cannot be empty.");
      setLoading(false);
      return;
    }

    api.parseIngredientsWithText(input)
      .then(ingredients => {
        setParsedIngredients(ingredients);
        setLoading(false);
      })
      .catch(err => {
        setErrorMessage("Error parsing ingredients: " + err.message);
        setLoading(false);
      });
  }

  return (
    <Box pos="relative">
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} loaderProps={{ type: 'dots' }} />
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
      {parsedIngredients.length > 0 && <IngredientListDisplay ref={ingredientListRef} ingredients={parsedIngredients} setLoading={setLoading} finished={finished} />}
    </Box >
  );
}

interface IngredientListDisplayProps {
  ingredients: IngredientParserResult[],
  setLoading: (loading: boolean) => void,
  finished: () => void
}

const IngredientListDisplay = forwardRef<HTMLDivElement, IngredientListDisplayProps>(
  function IngredientListDisplay({ ingredients, setLoading, finished }, ref) {
    const [selectedIndicies, setSelectedIndices] = useState<Set<number>>(new Set());

    const handleCheckboxChange = (index: number) => {
      const newSet = new Set(selectedIndicies);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      setSelectedIndices(newSet);
    }

    const handleSubmit = async () => {
      setLoading(true);
      for (const index of selectedIndicies) {
        await api.createItem({
          id: null,
          description: ingredients[index].name,
          section: ingredients[index].cat,
          checked: false
        })
      }
      setLoading(false);
      finished();
    }

    return (
      <div ref={ref} style={{ marginTop: 50 }}>
        <h3>Parsed Ingredients</h3>
        <p>Check all ingredients you want to add to the list</p>
        {ingredients.map((ingredient, index) => (
          <div key={index} style={{ marginBottom: 5 }}>
            <Checkbox type="checkbox" checked={selectedIndicies.has(index)} label={ingredient.name} onChange={() => handleCheckboxChange(index)} />
          </div>
        ))}
        <Button style={{ marginTop: 20 }} onClick={handleSubmit}>Add Selected Ingredients to List</Button>
      </div>
    );
  });
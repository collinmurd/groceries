
export interface IItem {
  id: string | null,
  description: string,
  section: string,
  checked: boolean
};

export interface IFeature {
  id: string | null,
  name: string,
  enabled: boolean
}

export const DEFAULT_SECTIONS = [
  'Produce',
  'Meat',
  'Dairy',
  'Frozen',
  'Shelved',
  'Other'
];

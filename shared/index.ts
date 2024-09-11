
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

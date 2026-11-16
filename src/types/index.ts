export interface Company {
  code: string;
  companyName: string;
  countryFlag: string;
  companyType: string;
  companySector: string;
  companyUrl: string;
  role: string;
  story: string;
  year: string;
  show: boolean;
  logoLabel?: string;
  achievements: Achievement[];
}

export interface CustomersData {
  companies: Company[];
}

// Achievements types
// Currently the data model uses a "list" of items, where each item is a line with an icon and text.
// Some items include a variant (e.g., "startup" or "content") that maps to a CSS style.

export type AchievementVariant = 'startup' | 'content' | 'default' | string

export interface AchievementItem {
  text: string
  type?: AchievementVariant
}

export interface AchievementList {
  type: 'list'
  items: AchievementItem[]
}

export type Achievement = AchievementList

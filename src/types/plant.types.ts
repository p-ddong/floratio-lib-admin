export interface PlantDetail {
  scientific_name: string;
  common_name: string[];
  family_name: string;
  attributes: string[];
  images: string[];
  species_description: SpeciesDescriptionSection[];
}

export interface SpeciesDescriptionSection {
  title: string;
  tables: DescriptionTable[];
}

export interface DescriptionTable {
  title: string;
  content: string;
}

export interface PlantList {
  _id: string;
  scientific_name: string;
  family_name: string;
  image: string;
  common_name: string[];
}
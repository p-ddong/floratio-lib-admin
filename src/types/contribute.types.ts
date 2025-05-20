// src/types/contribution.ts

export interface ContributionUser {
  _id: string
  username: string
}

export interface ContributionPlant {
  scientific_name: string
  common_name: string[]
  image: string
  description: string
  attributes: string[]
}

export type ContributionStatus = 'pending' | 'approved' | 'rejected'

export type ContributionType = 'new' | 'update'

export interface Contribution {
  _id: string
  user: ContributionUser
  contribute_plant: ContributionPlant
  status: ContributionStatus
  type?: ContributionType     // optional, only present for some records
  createdAt: string           // ISO date string
  updatedAt: string           // ISO date string
}

export interface Contribute {
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  scientific_name: string;
  description: string;
  image: string;
  attributes: string[];
  status: "pending" | "approved" | "rejected"; 
  createdAt: string; 
  updatedAt: string;

  reviewed_by?: {
    _id: string;
    username: string;
  };
}

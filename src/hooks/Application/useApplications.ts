import { useQuery } from '@tanstack/react-query';

import api from '../../api';

interface APIResponse<T> {
  count: number;
  next: string | null; // Can be null if there are no more pages
  previous: string | null; // Can be null if it's the first page
  results: T[];
}

export interface IApplication {
  id: number;
  user: User;
  full_name: string;
  primary_major: Major[];
  admission: number;
  admission_year: string;
  status: "PENDING" | "APPROVED" | "REJECTED"; // Define all possible status values here.  Crucially, include ALL possible values.
}

interface User {
  id: number;
  area: string;
}

interface Major {
  id: number;
  major: string;
}


const getApplication = async (page: number): Promise<APIResponse<IApplication>> => {
  const response = await api.get<APIResponse<IApplication>>(`/admission/application?page=${page}`); // Added type parameter to api.get AND pagination parameter
  console.log(response.data);
  return response.data;
};


export const useApplication = (page: number) => {
  return useQuery<APIResponse<IApplication>, Error>({ // Correct type for useQuery and Error type
    queryKey: ['application', page], // Include page in the query key. This is CRUCIAL for invalidation when the page changes.
    queryFn: () => getApplication(page), // Wrap getApplication in a function to pass the page parameter.
  });
};
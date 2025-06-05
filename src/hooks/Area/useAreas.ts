import { useQuery } from '@tanstack/react-query';

import api from '../../api';
import type { IPagination } from '../../models/models';


export interface IArea {
  id: number;
  name: string;
  type: string; 
   region: "ashgabat" | "ahal" | "balkan" | "dashoguz" | "lebap" | "mary";
}

const getArea = async (): Promise<IPagination<IArea>> => {
  const response = await api.get(`/regions/area/`);
  return response.data;
};

export const useArea = () => {
  return useQuery<IPagination<IArea>, Error>({
    queryKey: ['area'],
    queryFn: () => getArea(),
  });
};

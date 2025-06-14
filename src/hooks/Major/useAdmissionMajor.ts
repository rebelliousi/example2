import { useQuery } from '@tanstack/react-query';

import api from '../../api';
import type { IPagination } from '../../models/models';


export interface IAdmissionMajor {
  id: number;
  major: number;
  major_name?: string;
  order_number: number;
  quota: number;
  
}


const getAdmissionMajor = async (page: number): Promise<IPagination<IAdmissionMajor>> => {
  const response = await api.get(`/admission/majors?page=${page}`);
  return response.data;
};

export const useAdmissionMajor = (page: number) => {
  return useQuery<IPagination<IAdmissionMajor>, Error>({
    queryKey: ['admission', page], 
    queryFn: () => getAdmissionMajor(page),
  });
};

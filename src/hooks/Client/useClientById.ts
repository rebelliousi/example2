import api from '../../api';
import { useQuery } from '@tanstack/react-query';

export type GuardianRelation = 'mother' | 'father' | 'grandparent' | 'sibling' | 'uncle' | 'aunt';
export type OlympicType = 'area' | 'region' | 'state' | 'international' | 'other';
export type DocumentType = 
  | 'school_certificate'
  | 'passport'
  | 'military_document'
  | 'information'
  | 'relationship_tree'
  | 'medical_record'
  | 'description'
  | 'terjiimehal'
  | 'labor_book'
  | 'Dushundirish';

export interface GuardianDocument {
  id?: number;
  type: DocumentType;
  file: number | null;
}

export interface Guardian {
  id?: number;
  user?: number;
  relation: GuardianRelation;
  first_name: string;
  last_name: string;
  father_name: string;
  date_of_birth: string;
  place_of_birth: string;
  phone: string;
  address: string;
  work_place: string;
  documents: GuardianDocument[];
}

export interface Institution {
  id?: number;
  application?: number;
  name: string;
  school_gpa: number;
  graduated_year: number;
  certificates: number[];  
}

export interface Olympic {
  id?: number;
  application?: number;
  type: OlympicType;
  description: string;
  files: number[];
}

export interface Document {
  id?: number;
  type: DocumentType;
  file: number | null;
}

export interface ClientUser {
  username: string;
  first_name: string;
  last_name: string;
  father_name: string;
  area: number;
  gender: 'male' | 'female';
  nationality: string;
  date_of_birth: string;
  address: string;
  place_of_birth: string;
  home_phone: string;
  phone: string;
  email: string;
}

export interface IClientId {
  id?: number;
  primary_major: number;
  admission_major: number[];
  user: ClientUser;
  guardians: Guardian[];
  institutions: Institution[];
  olympics: Olympic[];
  documents: Document[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const getClientById = async (id: string | undefined): Promise<IClientId> => {
  if (!id) throw new Error('ID is required');
  const response = await api.get(`/admission/client/${id}/`);
  return response.data;
};

export function useClientById(id: string | undefined) {
  return useQuery<IClientId>({
    queryKey: ['client', id],
    queryFn: () => getClientById(id),
    enabled: !!id,
  });
}
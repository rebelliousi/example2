import { create } from 'zustand';
import type { IClient, Guardian } from '../hooks/Client/useAddClient';
import type { Moment } from 'moment'; // Import Moment type


interface DegreeInformation {  // Moved the interface here
 firstName: string;
 lastName: string;
 fatherName: string;
 dateOfBirth: Moment | null;
 address: string;
 placeOfBirth: string;
 isDeceased: boolean | null;
 passport: string;
 homePhoneNumber: string;
 cellPhoneNumber: string;
 email: string;
}


interface FormState {
  formData: IClient;
  fatherData: DegreeInformation;
  motherData: DegreeInformation;
  otherGuardians: DegreeInformation[];
  setFatherData: (data: DegreeInformation) => void;
  setMotherData: (data: DegreeInformation) => void;
  addOtherGuardian: () => void;
  updateOtherGuardian: (index: number, data: DegreeInformation) => void;
  removeOtherGuardian: (index: number) => void;

  setFormData: (partialFormData: Partial<IClient>) => void;
  resetFormData: () => void;
}

const initialGuardianState: DegreeInformation = {
 firstName: "",
 lastName: "",
 fatherName: "",
 dateOfBirth: null,
 address: "",
 placeOfBirth: "",
 isDeceased: null,
 passport: "",
 homePhoneNumber: "",
 cellPhoneNumber: "",
 email: "",
};


const initialFormData: IClient = {
  degree: undefined,
  primary_major: 0,
  admission_major: [],
  user: {
    first_name: '',
    last_name: '',
    father_name: '',
    area: 0,
    gender: 'male',
    nationality: '',
    date_of_birth: '',
    address: '',
    place_of_birth: '',
    home_phone: '',
    phone: '',
    email: '',
  },
  guardians: [],  // This might be redundant now, or you can map the data later.
  institutions: [],
  olympics: [],
  documents: [],
};

export const useFormStore = create<FormState>((set) => ({
  formData: initialFormData,
  fatherData: initialGuardianState,
  motherData: initialGuardianState,
  otherGuardians: [],

  setFatherData: (data) => set({ fatherData: data }),
  setMotherData: (data) => set({ motherData: data }),

  addOtherGuardian: () => set((state) => ({ otherGuardians: [...state.otherGuardians, initialGuardianState] })),

  updateOtherGuardian: (index, data) =>
    set((state) => ({
      otherGuardians: state.otherGuardians.map((guardian, i) => (i === index ? data : guardian)),
    })),

  removeOtherGuardian: (index) =>
    set((state) => ({ otherGuardians: state.otherGuardians.filter((_, i) => i !== index) })),

  setFormData: (partialFormData) =>
    set((state) => ({
      formData: { ...state.formData, ...partialFormData },
    })),
  resetFormData: () => set({ formData: initialFormData }),
}));
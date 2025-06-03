import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api";

interface UserInfo {
  first_name: string;
  last_name: string;
  father_name: string;
  phone: string;
  email: string;
}

export const useAddUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newUser: UserInfo) => {
      return await api.post("/admission/user/", newUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

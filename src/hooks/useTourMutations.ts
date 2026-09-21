import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTour, updateTour, deleteTour, type NewTourInput } from "@/src/lib/api/tours";
import type { Tour } from "@/src/types/tour";

export function useCreateTour() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewTourInput) => createTour(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours"] });
    },
  });
}

export function useUpdateTour() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: number; patch: Partial<Tour> }) => updateTour(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours"] });
    },
  });
}

export function useDeleteTour() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTour(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours"] });
    },
  });
}
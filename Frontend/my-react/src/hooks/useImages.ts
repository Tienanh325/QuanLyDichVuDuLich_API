import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import { getImages, createFromUrl, uploadFile, updateImage, deleteImage, deleteImages } from "../services/imageApi";
import type { ImageItem, ImageQueryParams, ImageUpdatePayload, ImageUploadPayload, ImageUrlPayload } from "../types/image";

export function useImages(params?: ImageQueryParams, options?: Omit<UseQueryOptions<ImageItem[], Error>, "queryKey" | "queryFn">) {
  return useQuery<ImageItem[], Error>({
    queryKey: ["admin-hinh-anh", params],
    queryFn: () => getImages(params),
    ...options,
  });
}

export function useMutateImage() {
  const queryClient = useQueryClient();

  const createUrlMutation = useMutation({
    mutationFn: (payload: ImageUrlPayload) => createFromUrl(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-hinh-anh"] });
    },
  });

  const uploadMutation = useMutation<ImageItem, Error, ImageUploadPayload>({
    mutationFn: uploadFile,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-hinh-anh"] });
    },
  });

  const updateMutation = useMutation<ImageItem, Error, { id: number; payload: ImageUpdatePayload }>({
    mutationFn: ({ id, payload }) => updateImage(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-hinh-anh"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteImage(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-hinh-anh"] });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => deleteImages(ids),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-hinh-anh"] });
    },
  });

  return {
    createFromUrl: createUrlMutation.mutate,
    createFromUrlAsync: createUrlMutation.mutateAsync,
    isCreatingUrl: createUrlMutation.isPending,
    createUrlError: createUrlMutation.error,
    uploadFile: uploadMutation.mutate,
    uploadFileAsync: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error,
    updateImage: (id: number, payload: ImageUpdatePayload) => updateMutation.mutate({ id, payload }),
    updateImageAsync: (id: number, payload: ImageUpdatePayload) => updateMutation.mutateAsync({ id, payload }),
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    deleteImage: deleteMutation.mutate,
    deleteImageAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
    deleteImages: bulkDeleteMutation.mutate,
    deleteImagesAsync: bulkDeleteMutation.mutateAsync,
    isBulkDeleting: bulkDeleteMutation.isPending,
    bulkDeleteError: bulkDeleteMutation.error,
  };
}

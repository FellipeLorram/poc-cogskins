"use server";

import { UTApi } from "uploadthing/server";

const utApi = new UTApi();

export const uploadFiles = async (files: File[]) => {
  return await utApi.uploadFiles(files);
};

export const deleteFiles = async (files: string[]) => {
  return await utApi.deleteFiles(files);
};

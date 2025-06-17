import axiosInstance from "./axios";

export const saveTemplate = async (template: any) => {
  try {
    const response = await axiosInstance.post("/template", template);
    return response.data;
  } catch (error) {
    console.error("Error saving template:", error);
    throw error;
  }
};

export const getTemplates = async () => {
  try {
    const response = await axiosInstance.get("/template");
    return response.data;
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw error;
  }
};

export const getTemplateById = async (params: {
  id?: string;
  slug?: string;
}) => {
  try {
    const { id, slug } = params;
    if (!id && !slug) {
      throw new Error(
        "Either id or slug must be provided to fetch a template.",
      );
    }
    const queryId = id || slug;
    const response = await axiosInstance.get(`/template/${queryId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching template by ID:", error);
    throw error;
  }
};

export const updateTemplate = async (id: string, template: any) => {
  try {
    const response = await axiosInstance.put(`/template/${id}`, template);
    return response.data;
  } catch (error) {
    console.error("Error updating template:", error);
    throw error;
  }
};

export const deleteTemplate = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/template/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting template:", error);
    throw error;
  }
};

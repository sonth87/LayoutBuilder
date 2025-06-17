import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTemplateById, updateTemplate, saveTemplate } from "@/api/template";
import { Code, FileText } from "lucide-react";
import { toast } from "sonner";
import TemplateBasicInfo from "./BasicInfo";
import VisualBuilder from "./VisualBuilder";
import { TemplateFormData } from "@/types/template";
import TemplateCode from "./Code";
import TemplateEditHeader from "./Header";
import { toSlug } from "@/libs/slug";
import { templatePreview } from "@/libs/templatePreview";

const TemplateEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = id !== "new";

  const [formData, setFormData] = useState<TemplateFormData>({
    name: "",
    description: "",
    slug: "",
    html: "",
    css: "",
    temp_type: "",
  });
  const editorInstanceRef = useRef(null);

  const [activeTab, setActiveTab] = useState<"form" | "builder" | "code">(
    "form"
  );

  // Query for existing template data
  const { data: template, isLoading } = useQuery({
    queryKey: ["template", id],
    queryFn: () => getTemplateById({ id }),
    enabled: !!id,
  });

  // Update form data when template is loaded
  useEffect(() => {
    if (template && isEditMode) {
      setFormData({
        name: template.name || "",
        description: template.description || "",
        slug: template.slug || "",
        html: template.html || "",
        css: template.css || "",
        temp_type: template.temp_type || "",
      });
    }
  }, [template, isEditMode]);

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEditMode || !template) {
      const slug = toSlug(formData.name);
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.name, isEditMode, template]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: (data: TemplateFormData) => {
      if (isEditMode && template?.id) {
        return updateTemplate(template.id, data);
      } else {
        return saveTemplate(data);
      }
    },
    onSuccess: (data) => {
      toast.success(
        isEditMode ? "Template đã được cập nhật" : "Template đã được tạo"
      );
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      queryClient.invalidateQueries({ queryKey: ["template", id] });

      if (!isEditMode && data?.id) {
        navigate(`/templates/${data.id}`);
      }
    },
    onError: () => {
      toast.success("Không thể lưu template");
    },
  });

  const handleInputChange = (field: keyof TemplateFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.success("Tên template không được để trống");
      return;
    }

    if (!formData.slug.trim()) {
      toast.success("Slug không được để trống");
      return;
    }

    const html = editorInstanceRef?.current?.getHtml() || template.html || "";
    const css = editorInstanceRef?.current?.getCss() || template.css || "";

    const payload = {
      html,
      css,
      lastSaved: new Date().toISOString(),
    };

    saveMutation.mutate({ ...formData, ...payload });
  };

  const handlePreview = () => {
    if (formData.html) {
      templatePreview({
        html: formData.html,
        css: formData.css,
        name: formData.name,
        slug: formData.slug,
      });
    }
  };

  if (isLoading && isEditMode) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-muted rounded"></div>
            <div className="h-8 bg-muted rounded w-48"></div>
          </div>
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-6 bg-muted rounded w-1/4"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <TemplateEditHeader
        id={id}
        handlePreview={handlePreview}
        handleSave={handleSave}
        template={formData || template}
        isLoading={isLoading || saveMutation.isPending}
      />

      {/* Tab Navigation */}
      <div className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("form")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "form"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="inline mr-2 h-4 w-4" />
              Thông tin cơ bản
            </button>
            <button
              onClick={() => setActiveTab("builder")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "builder"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="inline mr-2 h-4 w-4 bg-primary rounded" />
              Visual Builder
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "code"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Code className="inline mr-2 h-4 w-4" />
              HTML Code
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto p-6">
        {activeTab === "form" && (
          <TemplateBasicInfo
            formData={formData}
            handleInputChange={handleInputChange}
          />
        )}

        {activeTab === "builder" && (
          <VisualBuilder
            formData={formData}
            editorInstanceRef={editorInstanceRef}
          />
        )}

        {activeTab === "code" && (
          <TemplateCode
            formData={formData}
            handleInputChange={handleInputChange}
          />
        )}
      </div>
    </div>
  );
};

export default TemplateEdit;

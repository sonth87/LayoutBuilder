import { FC } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { TemplateFormData } from "@/types/template";
import { Link } from "react-router-dom";

type TemplateEditHeaderProps = {
  id?: string;
  template?: TemplateFormData;
  handlePreview?: () => void;
  handleSave?: () => void;
  isLoading?: boolean;
};

const TemplateEditHeader: FC<TemplateEditHeaderProps> = ({
  id,
  template,
  handlePreview,
  handleSave,
  isLoading,
}) => {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link to={id ? `/templates/${id}` : "/templates"}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {id ? "Chỉnh sửa Template" : "Tạo Template Mới"}
              </h1>
              <p className="text-muted-foreground">
                {id ? `Chỉnh sửa "${template?.name}"` : "Tạo template mới"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handlePreview}
              disabled={!template.html}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditHeader;

import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { inlineHtml } from "@/libs/inlineHtml";
import { TemplateFormData } from "@/types/template";

type TemplateCodeProps = {
  formData: TemplateFormData;
  handleInputChange: (field: string, value: string) => void;
};

const TemplateCode: FC<TemplateCodeProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>HTML Code</CardTitle>
          <CardDescription>
            Chỉnh sửa trực tiếp HTML code của template
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={inlineHtml(formData?.html || "", formData?.css || "")}
            onChange={(e) => handleInputChange("html", e.target.value)}
            placeholder="Nhập HTML code..."
            className="min-h-[500px] font-mono text-sm"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateCode;

import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TEMPLATE_TYPE } from "@/constant/template";
import { TemplateFormData } from "@/types/template";

type TemplateBasicInfoProps = {
  formData: TemplateFormData;
  handleInputChange: (field: string, value: string) => void;
};

const TemplateBasicInfo: FC<TemplateBasicInfoProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin Template</CardTitle>
          <CardDescription>
            Điền thông tin cơ bản cho template của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên Template *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Nhập tên template..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => handleInputChange("slug", e.target.value)}
              placeholder="template-slug"
              className="font-mono"
            />
            <p className="text-sm text-muted-foreground">
              Slug được tự động tạo từ tên template. Chỉ chứa chữ cái thường, số
              và dấu gạch ngang.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Loại Template *</Label>
            <select
              id="type"
              value={formData.temp_type || ""}
              defaultValue={formData.temp_type || ""}
              onChange={(e) => handleInputChange("temp_type", e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="" disabled>
                Chọn loại template
              </option>
              {Object.entries(TEMPLATE_TYPE).map(([key, value], idx) => (
                <option key={idx} value={key}>
                  {value.vi}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Mô tả về template này..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateBasicInfo;

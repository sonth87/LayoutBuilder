import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTemplateById, deleteTemplate } from "@/api/template";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Copy,
  Download,
  Eye,
  Calendar,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { templatePreview } from "@/libs/templatePreview";

interface Template {
  id: string;
  name: string;
  description?: string;
  slug: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
  author?: string;
}

const TemplateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    data: template,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["template", id],
    queryFn: () => getTemplateById({ id }),
    enabled: !!id,
  });
  const handleDeleteTemplate = async () => {
    if (!template?.id) return;

    try {
      await deleteTemplate(template.id);
      toast({
        title: "Thành công",
        description: "Template đã được xóa thành công",
      });
      navigate("/templates");
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa template",
        variant: "destructive",
      });
    }
  };

  const handleCopySlug = () => {
    if (template?.slug) {
      navigator.clipboard.writeText(template.slug);
      toast({
        title: "Đã sao chép",
        description: "Slug đã được sao chép vào clipboard",
      });
    }
  };

  const handlePreviewTemplate = () => {
    if (template.html) {
      templatePreview({
        html: template.html,
        css: template.css,
        name: template.name,
        slug: template.slug,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-muted rounded"></div>
            <div className="h-8 bg-muted rounded w-48"></div>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded w-1/2"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-destructive mb-2">
            Không tìm thấy template
          </h2>
          <p className="text-muted-foreground mb-4">
            Template không tồn tại hoặc đã bị xóa
          </p>
          <Button asChild>
            <Link to="/templates">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link to="/templates">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{template.name}</h1>
          <p className="text-muted-foreground">Chi tiết template</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreviewTemplate}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/templates/${template.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn xóa template "{template.name}"? Hành
                  động này không thể hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteTemplate}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Mô tả</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {template.description || "Không có mô tả"}
              </p>
            </CardContent>
          </Card>

          {/* Content Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Nội dung Template</CardTitle>
              <CardDescription>
                Preview HTML content của template
              </CardDescription>
            </CardHeader>
            <CardContent>
              {template.content ? (
                <div className="border rounded-lg p-4 bg-muted/50 max-h-96 overflow-auto">
                  <pre className="text-sm whitespace-pre-wrap font-mono">
                    {template.content}
                  </pre>
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  Template chưa có nội dung
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Template Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Slug:</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono">
                    {template.slug}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopySlug}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Tạo:</span>
                  <span>
                    {new Date(template.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Cập nhật:</span>
                  <span>
                    {new Date(template.updatedAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                {template.author && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Tác giả:</span>
                    <span>{template.author}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hành động</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                onClick={handlePreviewTemplate}
                disabled={!template.html}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <Link to={`/templates/${template.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa Template
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const element = document.createElement("a");
                  const file = new Blob([template.content || ""], {
                    type: "text/html",
                  });
                  element.href = URL.createObjectURL(file);
                  element.download = `${template.slug}.html`;
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                }}
                disabled={!template.content}
              >
                <Download className="mr-2 h-4 w-4" />
                Tải xuống HTML
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TemplateDetail;

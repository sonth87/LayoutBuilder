import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getTemplates, deleteTemplate } from "@/api/template";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  description?: string;
  slug: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
}

const TemplateList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: templates = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });

  const filteredTemplates = templates.filter(
    (template: Template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteTemplate = async (id: string) => {
    try {
      await deleteTemplate(id);
      toast.success("Template đã được xóa thành công");
      refetch();
    } catch (error) {
      toast.success("Không thể xóa template");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
              <CardFooter>
                <div className="h-8 bg-muted rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  console.log(filteredTemplates);
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-destructive mb-2">
            Lỗi tải dữ liệu
          </h2>
          <p className="text-muted-foreground mb-4">
            Không thể tải danh sách template
          </p>
          <Button onClick={() => refetch()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground">Quản lý các template của bạn</p>
        </div>
        <Button asChild>
          <Link to="/templates/new">
            <Plus className="mr-2 h-4 w-4" />
            Tạo Template Mới
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Tìm kiếm templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Không có template nào</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "Không tìm thấy template phù hợp"
              : "Bắt đầu bằng cách tạo template đầu tiên"}
          </p>
          {!searchTerm && (
            <Button asChild>
              <Link to="/templates/new">
                <Plus className="mr-2 h-4 w-4" />
                Tạo Template Đầu Tiên
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template: Template) => (
            <Card
              key={template.id}
              className="group hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="truncate">{template.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {template.description || "Không có mô tả"}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2 shrink-0">
                    {template.slug}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    Tạo:{" "}
                    {new Date(template.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                  <p>
                    Cập nhật:{" "}
                    {new Date(template.updatedAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link to={`/templates/${template.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Xem
                  </Link>
                </Button>

                <Button variant="outline" size="sm" asChild>
                  <Link to={`/templates/${template.id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa template "{template.name}"?
                        Hành động này không thể hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Xóa
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateList;

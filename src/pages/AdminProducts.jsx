import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "@/api/productService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, Plus, AlertCircle, LogOut } from "lucide-react";
import { adminLogout } from "@/lib/admin-session";
import { useNavigate } from "react-router-dom";

const CATEGORIES = ["Feijão", "Cereais"];

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate("/");
  };
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["all-products"],
    queryFn: () => fetchProducts(),
  });

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Feijão",
    price: "",
    unit: "kg",
    in_stock: true,
    image_url: "",
  });
  const [error, setError] = useState("");

  // Mutation para criar produto
  const createMutation = useMutation({
    mutationFn: (data) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
      resetForm();
      setError("");
    },
    onError: (err) => {
      setError(err.message || "Erro ao criar produto");
    },
  });

  // Mutation para atualizar
  const updateMutation = useMutation({
    mutationFn: (data) => updateProduct(editingId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
      resetForm();
      setError("");
    },
    onError: (err) => {
      setError(err.message || "Erro ao atualizar produto");
    },
  });

  // Mutation para deletar
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
      setError("");
    },
    onError: (err) => {
      setError(err.message || "Erro ao deletar produto");
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "Feijão",
      price: "",
      unit: "kg",
      in_stock: true,
      image_url: "",
    });
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || "",
      category: product.category,
      price: product.price,
      unit: product.unit || "kg",
      in_stock: product.in_stock ?? true,
      image_url: product.image_url || "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price) {
      setError("Nome, categoria e preço são obrigatórios");
      return;
    }

    const data = {
      ...formData,
      price: parseFloat(formData.price),
    };

    if (editingId) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Gerenciar Produtos</h1>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>

        {/* Formulário */}
        <div className="bg-card rounded-lg border border-border p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-6">{editingId ? "Editar Produto" : "Novo Produto"}</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Nome do produto"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              placeholder="Descrição"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
            />

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Preço (ex: 15.50)"
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <Input
                placeholder="URL da imagem"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Unidade (ex: kg, un, L)"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
              />
              <label className="flex items-center gap-3 px-3 py-2 border border-input rounded-md bg-background cursor-pointer">
                <input
                  type="checkbox"
                  name="in_stock"
                  checked={formData.in_stock}
                  onChange={handleChange}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm font-medium">Em estoque</span>
              </label>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {editingId ? "Atualizar" : "Criar Produto"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Lista de Produtos */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-semibold">Produtos ({products.length})</h2>
          </div>

          {isLoading ? (
            <div className="p-6 text-center">Carregando...</div>
          ) : products.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              Nenhum produto cadastrado. Crie um novo!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Nome</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Categoria</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Preço</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Unidade</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Estoque</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-border hover:bg-muted/50">
                      <td className="px-6 py-4 text-sm">{product.name}</td>
                      <td className="px-6 py-4 text-sm">{product.category}</td>
                      <td className="px-6 py-4 text-sm font-medium">R$ {parseFloat(product.price).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm">{product.unit || "kg"}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${(product.in_stock ?? true) ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {(product.in_stock ?? true) ? "Em estoque" : "Esgotado"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          className="flex items-center gap-1"
                        >
                          <Edit2 className="w-4 h-4" />
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (confirm("Tem certeza que deseja deletar?")) {
                              deleteMutation.mutate(product.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Deletar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

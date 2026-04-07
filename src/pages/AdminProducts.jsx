import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, Plus, AlertCircle, Lock, ImageIcon, Search, Users, Package, Star, Phone, Mail, ShoppingBag, Settings } from "lucide-react";

const CATEGORIES = ["Feijão", "Cereais"];

// ============================================================
// API BASE URL - Definida uma única vez
// ============================================================
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return window.location.origin;
    }
  }
  return 'http://localhost:3000';
};

// ============================================================
// FUNÇÕES DA API (implementação local)
// ============================================================
const API_URL = getApiUrl();

function getAdminToken() {
  return sessionStorage.getItem('adminToken');
}

function adminHeaders() {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

async function fetchProducts() {
  const response = await fetch(`${API_URL}/api/products`);
  if (!response.ok) throw new Error("Erro ao carregar produtos");
  return response.json();
}

async function createProduct(product) {
  const response = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify(product),
  });
  if (response.status === 401) throw new Error("Sessão expirada. Faça login novamente.");
  if (!response.ok) throw new Error("Erro ao criar produto");
  return response.json();
}

async function updateProduct(id, product) {
  const response = await fetch(`${API_URL}/api/products/${id}`, {
    method: "PUT",
    headers: adminHeaders(),
    body: JSON.stringify(product),
  });
  if (response.status === 401) throw new Error("Sessão expirada. Faça login novamente.");
  if (!response.ok) throw new Error("Erro ao atualizar produto");
  return response.json();
}

async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
  if (response.status === 401) throw new Error("Sessão expirada. Faça login novamente.");
  if (!response.ok) throw new Error("Erro ao deletar produto");
  return response.json();
}

// ============================================================
// COMPONENTE AdminConfiguracoes (criado)
// ============================================================
function AdminConfiguracoes() {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Configurações</h2>
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Categorias Disponíveis</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <span key={cat} className="px-2 py-1 bg-muted rounded-md text-sm">{cat}</span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Versão do Sistema</label>
            <p className="text-muted-foreground">v1.0.0 - Painel Administrativo Casa do Norte</p>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function AdminProducts() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [adminTab, setAdminTab] = useState("produtos");
  const [editingId, setEditingId] = useState(null);

  const queryClient = useQueryClient();
  
  const { data: products = [], isLoading, error: productsError } = useQuery({
    queryKey: ["all-products"],
    queryFn: fetchProducts,
    enabled: authenticated,
  });
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Feijão",
    price: "",
    image_url: "",
  });
  const [error, setError] = useState("");

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
      resetForm();
      setError("");
    },
    onError: (err) => {
      setError(err.message || "Erro ao criar produto");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
      resetForm();
      setError("");
    },
    onError: (err) => {
      setError(err.message || "Erro ao atualizar produto");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
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
      price: product.price.toString(),
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
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setPasswordError("");
    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setPasswordError(data.error || 'Senha incorreta');
        return;
      }
      sessionStorage.setItem('adminToken', data.token);
      setAuthenticated(true);
    } catch (err) {
      setPasswordError('Erro de conexão com o servidor');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 max-w-md w-full shadow-lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Painel Admin</h1>
            <p className="text-gray-500 mt-2">Digite a senha para acessar</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="Senha de acesso"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-lg py-3"
              autoFocus
            />
            {passwordError && (
              <p className="text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {passwordError}
              </p>
            )}
            <Button type="submit" className="w-full text-lg py-3 h-auto bg-amber-600 hover:bg-amber-700">
              Entrar
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Painel Admin</h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={adminTab === "produtos" ? "default" : "outline"}
            onClick={() => setAdminTab("produtos")}
            className="flex items-center gap-2"
          >
            <Package className="w-4 h-4" /> Produtos
          </Button>
          <Button
            variant={adminTab === "clientes" ? "default" : "outline"}
            onClick={() => setAdminTab("clientes")}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" /> Clientes
          </Button>
          <Button
            variant={adminTab === "pedidos" ? "default" : "outline"}
            onClick={() => setAdminTab("pedidos")}
            className="flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Pedidos
          </Button>
          <Button
            variant={adminTab === "config" ? "default" : "outline"}
            onClick={() => setAdminTab("config")}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" /> Configurações
          </Button>
        </div>

        {/* Conteúdo das Tabs */}
        {adminTab === "clientes" && <AdminClientes />}
        {adminTab === "pedidos" && <AdminPedidos />}
        {adminTab === "config" && <AdminConfiguracoes />}

        {adminTab === "produtos" && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Gerenciar Produtos</h2>

            {/* Formulário */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-10 shadow-sm">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                {editingId ? "Editar Produto" : "Novo Produto"}
              </h2>

              {(error || productsError) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-700">{error || productsError?.message}</p>
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
                    className="px-3 py-2 border border-gray-300 rounded-md bg-white"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
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
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="URL da imagem"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                        className="flex-1"
                      />
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent((formData.category || 'produto') + ' produto')}&tbm=isch`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button type="button" variant="outline" title="Buscar imagem pela categoria no Google">
                          <ImageIcon className="w-4 h-4" />
                        </Button>
                      </a>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent((formData.name || formData.category) + ' produto')}&tbm=isch`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button type="button" variant="outline" title="Buscar imagem pelo nome no Google">
                          <Search className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                    {formData.image_url && (
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700"
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
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900">Produtos ({products.length})</h2>
              </div>

              {isLoading ? (
                <div className="p-6 text-center text-gray-500">Carregando...</div>
              ) : products.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Nenhum produto cadastrado. Crie um novo!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Categoria</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Preço</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            R$ {parseFloat(product.price).toFixed(2)}
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
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTE CLIENTES
// ============================================================
function AdminClientes() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = getApiUrl();

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/customers`, {
        headers: adminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;
    try {
      await fetch(`${API_URL}/api/customers/${id}`, {
        method: 'DELETE',
        headers: adminHeaders(),
      });
      loadCustomers();
    } catch (err) {
      console.error("Erro ao deletar cliente:", err);
    }
  };

  const filtered = customers.filter(c =>
    !searchTerm || 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const levelColor = (level) => {
    if (level === "gold") return "text-yellow-700 bg-yellow-50 border-yellow-200";
    if (level === "silver") return "text-gray-600 bg-gray-100 border-gray-200";
    return "text-amber-700 bg-amber-50 border-amber-200";
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Clientes ({customers.length})</h2>
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Carregando clientes...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">{customers.length === 0 ? "Nenhum cliente cadastrado ainda" : "Nenhum resultado encontrado"}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">E-mail</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Telefone</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nível</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Pontos</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total Gasto</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Cadastro</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{c.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {c.email}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {c.phone || "—"}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${levelColor(c.loyalty?.level)}`}>
                        <Star className="w-3 h-3" /> {(c.loyalty?.level || "bronze").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{c.loyalty?.points || 0}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">R$ {(c.loyalty?.totalSpent || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString("pt-BR") : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(c.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Excluir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================
// COMPONENTE PEDIDOS
// ============================================================
function AdminPedidos() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = getApiUrl();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders`, {
          headers: adminHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error("Erro ao carregar pedidos:", err);
      }
      setLoading(false);
    };
    loadOrders();
  }, []);

  const statusColor = (s) => {
    if (s === 'approved') return 'text-green-700 bg-green-50 border-green-200';
    if (s === 'rejected') return 'text-red-700 bg-red-50 border-red-200';
    return 'text-yellow-700 bg-yellow-50 border-yellow-200';
  };

  const statusLabel = (s) => {
    if (s === 'approved') return 'Aprovado';
    if (s === 'rejected') return 'Recusado';
    return 'Pendente';
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Pedidos ({orders.length})</h2>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Carregando pedidos...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
          <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Nenhum pedido ainda</p>
        </div>
      ) : (
        <div className="space-y-4">
          {[...orders].reverse().map(order => (
            <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="text-sm">
                  <span className="font-bold text-gray-900">#{order.external_reference || order.id}</span>
                  <span className="text-gray-500 ml-2">
                    {order.createdAt ? new Date(order.createdAt).toLocaleString("pt-BR") : ""}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold border ${statusColor(order.status)}`}>
                  {statusLabel(order.status)}
                </span>
              </div>
              <div className="space-y-1 mb-3">
                {(order.items || []).map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.quantity}x {item.title}</span>
                    <span className="font-medium text-gray-900">R$ {(item.unit_price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between border-t border-gray-200 pt-3 gap-2">
                {order.payer?.email && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {order.payer.name || ""} ({order.payer.email})
                  </span>
                )}
                <span className="text-lg font-bold text-amber-600">
                  R$ {(order.total || 0).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
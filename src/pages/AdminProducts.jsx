import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, Plus, AlertCircle, Lock, ImageIcon, Search, Users, Package, Star, Phone, Mail, ShoppingBag, Settings, Tag, Megaphone, Percent, CalendarDays, Eye, EyeOff, Coins, TrendingUp, DollarSign, Clock, CheckCircle } from "lucide-react";

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

const GRADIENT_OPTIONS = [
  { label: "Marrom", value: "from-amber-700 to-amber-800" },
  { label: "Amarelo", value: "from-yellow-600 to-yellow-700" },
  { label: "Verde", value: "from-green-600 to-green-700" },
  { label: "Azul", value: "from-blue-600 to-blue-700" },
  { label: "Vermelho", value: "from-red-600 to-red-700" },
  { label: "Roxo", value: "from-purple-600 to-purple-700" },
  { label: "Rosa", value: "from-pink-600 to-pink-700" },
  { label: "Cinza", value: "from-gray-600 to-gray-700" },
  { label: "Laranja", value: "from-orange-600 to-orange-700" },
  { label: "Teal", value: "from-teal-600 to-teal-700" },
];

function AdminConfiguracoes() {
  const API_URL = getApiUrl();
  const [settings, setSettings] = useState({
    pixKey: '',
    pixKeyType: 'cnpj',
    pixName: '',
    pixCity: '',
    pixBank: '',
  });
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState({ name: '', emoji: '📦', description: '', color: 'from-gray-600 to-gray-700' });
  const [editingCatIdx, setEditingCatIdx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingCats, setSavingCats] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [catMsg, setCatMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const [settingsRes, catsRes] = await Promise.all([
          fetch(`${API_URL}/api/settings`, { headers: adminHeaders() }),
          fetch(`${API_URL}/api/categories`),
        ]);
        if (settingsRes.ok) {
          const data = await settingsRes.json();
          setSettings(prev => ({ ...prev, ...data }));
        }
        if (catsRes.ok) {
          const data = await catsRes.json();
          setCategories(data);
        }
      } catch (err) {
        console.error('Erro ao carregar configurações:', err);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ text: '', type: '' });
    try {
      const res = await fetch(`${API_URL}/api/settings`, {
        method: 'PUT',
        headers: adminHeaders(),
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({ ...prev, ...data }));
        setMsg({ text: 'Configurações salvas com sucesso!', type: 'success' });
      } else {
        setMsg({ text: 'Erro ao salvar configurações', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Erro de conexão com o servidor', type: 'error' });
    }
    setSaving(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCategory = () => {
    if (!newCat.name.trim()) return;
    if (categories.find(c => c.name.toLowerCase() === newCat.name.trim().toLowerCase()) && editingCatIdx === null) {
      setCatMsg({ text: 'Essa categoria já existe', type: 'error' });
      return;
    }
    if (editingCatIdx !== null) {
      const updated = [...categories];
      updated[editingCatIdx] = { ...newCat, name: newCat.name.trim() };
      setCategories(updated);
      setEditingCatIdx(null);
    } else {
      setCategories([...categories, { ...newCat, name: newCat.name.trim() }]);
    }
    setNewCat({ name: '', emoji: '📦', description: '', color: 'from-gray-600 to-gray-700' });
    setCatMsg({ text: '', type: '' });
  };

  const handleEditCategory = (idx) => {
    setEditingCatIdx(idx);
    setNewCat({ ...categories[idx] });
  };

  const handleDeleteCategory = (idx) => {
    if (!confirm(`Remover categoria "${categories[idx].name}"?`)) return;
    setCategories(categories.filter((_, i) => i !== idx));
  };

  const handleSaveCategories = async () => {
    setSavingCats(true);
    setCatMsg({ text: '', type: '' });
    try {
      const res = await fetch(`${API_URL}/api/categories`, {
        method: 'PUT',
        headers: adminHeaders(),
        body: JSON.stringify({ categories }),
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        setCatMsg({ text: 'Categorias salvas com sucesso!', type: 'success' });
      } else {
        const err = await res.json();
        setCatMsg({ text: err.error || 'Erro ao salvar categorias', type: 'error' });
      }
    } catch (err) {
      setCatMsg({ text: 'Erro de conexão com o servidor', type: 'error' });
    }
    setSavingCats(false);
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Carregando configurações...</div>;

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Configurações</h2>

      {msg.text && (
        <div className={`rounded-lg p-4 mb-6 flex items-center gap-2 ${msg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Dados Pix */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            💳 Dados do Pix
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chave Pix</label>
              <Input name="pixKey" value={settings.pixKey} onChange={handleChange} placeholder="CPF, CNPJ, e-mail, telefone ou aleatória" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo da Chave</label>
              <select name="pixKeyType" value={settings.pixKeyType} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
                <option value="cnpj">CNPJ</option>
                <option value="cpf">CPF</option>
                <option value="email">E-mail</option>
                <option value="phone">Telefone</option>
                <option value="random">Aleatória</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Recebedor</label>
              <Input name="pixName" value={settings.pixName} onChange={handleChange} placeholder="Nome que aparece no Pix" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
              <Input name="pixCity" value={settings.pixCity} onChange={handleChange} placeholder="Cidade do recebedor" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banco</label>
              <Input name="pixBank" value={settings.pixBank} onChange={handleChange} placeholder="Ex: C6 Bank, Nubank, Itaú..." />
            </div>
          </div>
        </div>

        {/* API Mercado Pago */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            🟡 Mercado Pago
          </h3>
          <p className="text-sm text-gray-500 mb-4">Configure o token de acesso para aceitar pagamentos via Mercado Pago Checkout Pro.</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Access Token (MP_ACCESS_TOKEN)</label>
            <Input name="mpAccessToken" value={settings.mpAccessToken || ''} onChange={handleChange} placeholder="APP_USR-xxxxxxxx-xxxx-xxxx..." type="password" />
            <p className="text-xs text-gray-400 mt-1">Obtenha em: developers.mercadopago.com.br → Suas integrações → Credenciais</p>
          </div>
        </div>

        {/* API C6 Bank Pix */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            🏦 API Pix C6 Bank (Opcional)
          </h3>
          <p className="text-sm text-gray-500 mb-4">Para cobranças Pix dinâmicas via API do C6 Bank. Deixe em branco para usar Pix estático.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
              <Input name="c6ClientId" value={settings.c6ClientId || ''} onChange={handleChange} placeholder="Client ID da API C6" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Secret</label>
              <Input name="c6ClientSecret" value={settings.c6ClientSecret || ''} onChange={handleChange} placeholder="Client Secret" type="password" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL da API</label>
              <Input name="c6ApiUrl" value={settings.c6ApiUrl || ''} onChange={handleChange} placeholder="https://openfinance.c6bank.com.br (padrão)" />
            </div>
          </div>
        </div>

        {/* API PagBem */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            💚 Banco PagBem (Pix)
          </h3>
          <p className="text-sm text-gray-500 mb-4">Credenciais da API PagBem para cobranças Pix. Preencha quando tiver os dados do banco.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
              <Input name="pagbemClientId" value={settings.pagbemClientId || ''} onChange={handleChange} placeholder="Client ID da API PagBem" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Secret</label>
              <Input name="pagbemClientSecret" value={settings.pagbemClientSecret || ''} onChange={handleChange} placeholder="Client Secret" type="password" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL da API</label>
              <Input name="pagbemApiUrl" value={settings.pagbemApiUrl || ''} onChange={handleChange} placeholder="https://api.pagbem.com.br (ou URL fornecida)" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chave Pix PagBem</label>
              <Input name="pagbemPixKey" value={settings.pagbemPixKey || ''} onChange={handleChange} placeholder="CPF/CNPJ/e-mail/telefone/aleatória" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Webhook Secret (opcional)</label>
              <Input name="pagbemWebhookSecret" value={settings.pagbemWebhookSecret || ''} onChange={handleChange} placeholder="Secret para validar webhooks do PagBem" type="password" />
            </div>
          </div>
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-700">💡 Quando tiver as credenciais do PagBem, preencha aqui. A integração com a API será ativada automaticamente quando os campos Client ID e Client Secret estiverem preenchidos.</p>
          </div>
        </div>

        {/* Categorias */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5" /> Categorias de Produtos
          </h3>
          <p className="text-sm text-gray-500 mb-4">Adicione, edite ou remova categorias. Essas categorias aparecerão no formulário de produtos e no site.</p>

          {catMsg.text && (
            <div className={`rounded-lg p-3 mb-4 flex items-center gap-2 text-sm ${catMsg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {catMsg.text}
            </div>
          )}

          {/* Lista de categorias */}
          <div className="space-y-2 mb-4">
            {categories.length === 0 && (
              <p className="text-gray-400 text-sm">Nenhuma categoria cadastrada</p>
            )}
            {categories.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-2xl">{cat.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{cat.name}</p>
                  <p className="text-xs text-gray-500 truncate">{cat.description || 'Sem descrição'}</p>
                </div>
                <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${cat.color}`} title={cat.color}></div>
                <Button type="button" variant="outline" size="sm" onClick={() => handleEditCategory(idx)}>
                  <Edit2 className="w-3 h-3" />
                </Button>
                <Button type="button" variant="destructive" size="sm" onClick={() => handleDeleteCategory(idx)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>

          {/* Formulário para adicionar/editar */}
          <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50/50">
            <p className="text-sm font-medium text-gray-700 mb-3">
              {editingCatIdx !== null ? `Editando: ${categories[editingCatIdx]?.name}` : 'Nova Categoria'}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Input
                placeholder="Nome (ex: Temperos)"
                value={newCat.name}
                onChange={e => setNewCat(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                placeholder="Emoji (ex: 🌶️)"
                value={newCat.emoji}
                onChange={e => setNewCat(prev => ({ ...prev, emoji: e.target.value }))}
                className="text-center text-xl"
              />
              <Input
                placeholder="Descrição curta"
                value={newCat.description}
                onChange={e => setNewCat(prev => ({ ...prev, description: e.target.value }))}
              />
              <select
                value={newCat.color}
                onChange={e => setNewCat(prev => ({ ...prev, color: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
              >
                {GRADIENT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 mt-3">
              <Button type="button" onClick={handleAddCategory} className="bg-amber-600 hover:bg-amber-700 flex items-center gap-1">
                <Plus className="w-4 h-4" /> {editingCatIdx !== null ? 'Atualizar' : 'Adicionar'}
              </Button>
              {editingCatIdx !== null && (
                <Button type="button" variant="outline" onClick={() => { setEditingCatIdx(null); setNewCat({ name: '', emoji: '📦', description: '', color: 'from-gray-600 to-gray-700' }); }}>
                  Cancelar
                </Button>
              )}
            </div>
          </div>

          <div className="mt-4">
            <Button type="button" onClick={handleSaveCategories} disabled={savingCats} className="bg-amber-600 hover:bg-amber-700">
              {savingCats ? 'Salvando...' : 'Salvar Categorias'}
            </Button>
          </div>
        </div>

        {/* Info Geral */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            ⚙️ Geral
          </h3>
          <div className="space-y-3">
            {settings.updatedAt && (
              <p className="text-xs text-gray-400">Última atualização: {new Date(settings.updatedAt).toLocaleString('pt-BR')}</p>
            )}
            <p className="text-xs text-gray-400">v1.0.0 — Empório Filho de Deus</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving} className="bg-amber-600 hover:bg-amber-700 px-8">
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </form>
    </>
  );
}

// ============================================================
// COMPONENTE AdminPromocoes
// ============================================================

const PROMO_COLORS = [
  { label: "Laranja → Vermelho", value: "from-orange-500 to-red-500" },
  { label: "Verde → Teal", value: "from-green-500 to-teal-500" },
  { label: "Azul → Roxo", value: "from-blue-500 to-purple-500" },
  { label: "Rosa → Vermelho", value: "from-pink-500 to-red-500" },
  { label: "Amarelo → Laranja", value: "from-yellow-400 to-orange-500" },
  { label: "Roxo → Rosa", value: "from-purple-500 to-pink-500" },
  { label: "Vermelho → Laranja", value: "from-red-600 to-orange-500" },
  { label: "Teal → Azul", value: "from-teal-500 to-blue-600" },
];

function AdminPromocoes() {
  const API_URL = getApiUrl();
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', type: 'percentage', discountPercent: 10, discountValue: 0,
    productIds: [], bannerText: '', bannerColor: 'from-orange-500 to-red-500',
    startDate: '', endDate: '', active: true,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [promoRes, prodRes] = await Promise.all([
          fetch(`${API_URL}/api/promotions`, { headers: adminHeaders() }),
          fetch(`${API_URL}/api/products`),
        ]);
        if (promoRes.ok) setPromotions(await promoRes.json());
        if (prodRes.ok) setProducts(await prodRes.json());
      } catch (err) {
        console.error('Erro ao carregar promoções:', err);
      }
      setLoading(false);
    };
    load();
  }, []);

  const resetForm = () => {
    setForm({
      title: '', description: '', type: 'percentage', discountPercent: 10, discountValue: 0,
      productIds: [], bannerText: '', bannerColor: 'from-orange-500 to-red-500',
      startDate: '', endDate: '', active: true,
    });
    setEditingId(null);
  };

  const handleEdit = (promo) => {
    setEditingId(promo.id);
    setForm({
      title: promo.title || '',
      description: promo.description || '',
      type: promo.type || 'percentage',
      discountPercent: promo.discountPercent || 10,
      discountValue: promo.discountValue || 0,
      productIds: promo.productIds || [],
      bannerText: promo.bannerText || '',
      bannerColor: promo.bannerColor || 'from-orange-500 to-red-500',
      startDate: promo.startDate ? promo.startDate.substring(0, 16) : '',
      endDate: promo.endDate ? promo.endDate.substring(0, 16) : '',
      active: promo.active !== false,
    });
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setMsg({ text: 'Título é obrigatório', type: 'error' }); return; }
    setSaving(true);
    setMsg({ text: '', type: '' });
    try {
      const payload = {
        ...form,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
      };
      const url = editingId ? `${API_URL}/api/promotions/${editingId}` : `${API_URL}/api/promotions`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: adminHeaders(), body: JSON.stringify(payload) });
      if (res.ok) {
        const data = await res.json();
        if (editingId) {
          setPromotions(prev => prev.map(p => p.id === editingId ? data : p));
        } else {
          setPromotions(prev => [...prev, data]);
        }
        setMsg({ text: editingId ? 'Promoção atualizada!' : 'Promoção criada!', type: 'success' });
        resetForm();
      } else {
        const err = await res.json();
        setMsg({ text: err.error || 'Erro ao salvar', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Erro de conexão', type: 'error' });
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Remover esta promoção?')) return;
    try {
      const res = await fetch(`${API_URL}/api/promotions/${id}`, { method: 'DELETE', headers: adminHeaders() });
      if (res.ok) {
        setPromotions(prev => prev.filter(p => p.id !== id));
        if (editingId === id) resetForm();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (promo) => {
    try {
      const res = await fetch(`${API_URL}/api/promotions/${promo.id}`, {
        method: 'PUT', headers: adminHeaders(),
        body: JSON.stringify({ active: !promo.active }),
      });
      if (res.ok) {
        const data = await res.json();
        setPromotions(prev => prev.map(p => p.id === promo.id ? data : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleProductId = (pid) => {
    setForm(prev => ({
      ...prev,
      productIds: prev.productIds.includes(pid)
        ? prev.productIds.filter(id => id !== pid)
        : [...prev.productIds, pid],
    }));
  };

  if (loading) return <p className="text-gray-500 py-8 text-center">Carregando promoções...</p>;

  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Gerenciar Promoções</h2>

      {msg.text && (
        <div className={`rounded-lg p-3 mb-4 flex items-center gap-2 text-sm ${msg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {msg.text}
        </div>
      )}

      {/* Lista de promoções existentes */}
      {promotions.length > 0 && (
        <div className="space-y-3 mb-8">
          {promotions.map(promo => (
            <div key={promo.id} className={`bg-white rounded-lg border p-4 shadow-sm flex items-center justify-between gap-4 ${promo.active ? 'border-green-300' : 'border-gray-200 opacity-60'}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-block w-3 h-3 rounded-full ${promo.active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  <span className="font-semibold text-gray-900 truncate">{promo.title}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {promo.type === 'percentage' ? `${promo.discountPercent}% OFF` : promo.type === 'fixed' ? `R$ ${promo.discountValue} OFF` : 'Banner'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">{promo.description || promo.bannerText || 'Sem descrição'}</p>
                {promo.productIds?.length > 0 && (
                  <p className="text-xs text-blue-600 mt-1">{promo.productIds.length} produto(s) vinculado(s)</p>
                )}
                {(promo.startDate || promo.endDate) && (
                  <p className="text-xs text-gray-400 mt-1">
                    {promo.startDate ? `De ${new Date(promo.startDate).toLocaleDateString('pt-BR')}` : ''}
                    {promo.endDate ? ` até ${new Date(promo.endDate).toLocaleDateString('pt-BR')}` : ''}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => handleToggleActive(promo)} className="p-1.5 rounded-lg hover:bg-gray-100" title={promo.active ? 'Desativar' : 'Ativar'}>
                  {promo.active ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                </button>
                <button onClick={() => handleEdit(promo)} className="p-1.5 rounded-lg hover:bg-gray-100"><Edit2 className="w-4 h-4 text-blue-600" /></button>
                <button onClick={() => handleDelete(promo.id)} className="p-1.5 rounded-lg hover:bg-gray-100"><Trash2 className="w-4 h-4 text-red-500" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulário de criação/edição */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {editingId ? 'Editar Promoção' : 'Nova Promoção'}
        </h3>

        <div className="space-y-4">
          {/* Título e Descrição */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Ex: Semana do Feijão" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Descrição curta da promoção" />
            </div>
          </div>

          {/* Tipo de promoção */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Promoção</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'percentage', label: '% Desconto', icon: '🏷️' },
                { value: 'fixed', label: 'R$ Desconto', icon: '💰' },
                { value: 'banner', label: 'Apenas Banner', icon: '📢' },
              ].map(opt => (
                <button key={opt.value} type="button"
                  onClick={() => setForm(p => ({ ...p, type: opt.value }))}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${form.type === opt.value ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Valor do desconto */}
          {form.type === 'percentage' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Desconto (%)</label>
              <Input type="number" min="1" max="100" value={form.discountPercent} onChange={e => setForm(p => ({ ...p, discountPercent: Number(e.target.value) }))} />
            </div>
          )}
          {form.type === 'fixed' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Desconto (R$)</label>
              <Input type="number" min="0.01" step="0.01" value={form.discountValue} onChange={e => setForm(p => ({ ...p, discountValue: Number(e.target.value) }))} />
            </div>
          )}

          {/* Texto do Banner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Texto do Banner (exibido no site)</label>
            <Input value={form.bannerText} onChange={e => setForm(p => ({ ...p, bannerText: e.target.value }))} placeholder="Ex: 🔥 Feijão com 20% de desconto esta semana!" />
          </div>

          {/* Cor do Banner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cor do Banner</label>
            <div className="flex flex-wrap gap-2">
              {PROMO_COLORS.map(c => (
                <button key={c.value} type="button" onClick={() => setForm(p => ({ ...p, bannerColor: c.value }))}
                  className={`w-10 h-10 rounded-full bg-gradient-to-r ${c.value} border-2 transition-transform ${form.bannerColor === c.value ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-105'}`}
                  title={c.label}
                />
              ))}
            </div>
            {/* Preview */}
            {form.bannerText && (
              <div className={`mt-3 rounded-xl bg-gradient-to-r ${form.bannerColor} p-4 text-white text-center font-semibold text-lg shadow-md`}>
                {form.bannerText}
              </div>
            )}
          </div>

          {/* Datas */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Início (opcional)</label>
              <Input type="datetime-local" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim (opcional)</label>
              <Input type="datetime-local" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} />
            </div>
          </div>

          {/* Vincular Produtos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vincular Produtos ({form.productIds.length} selecionado{form.productIds.length !== 1 ? 's' : ''})
            </label>
            <p className="text-xs text-gray-500 mb-2">Selecione os produtos que participam desta promoção. Deixe vazio para promoção geral (banner).</p>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
              {products.map(prod => (
                <label key={prod.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" checked={form.productIds.includes(prod.id)} onChange={() => toggleProductId(prod.id)}
                    className="w-4 h-4 rounded border-gray-300 text-amber-600" />
                  <span className="text-sm text-gray-700 truncate">{prod.name}</span>
                  <span className="text-xs text-gray-400 ml-auto">R$ {prod.price?.toFixed(2)}</span>
                </label>
              ))}
              {products.length === 0 && <p className="text-xs text-gray-400 text-center py-2">Nenhum produto cadastrado</p>}
            </div>
          </div>

          {/* Ativo */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-amber-600" />
            <span className="text-sm font-medium text-gray-700">Promoção ativa</span>
          </label>

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <Button type="button" onClick={handleSave} disabled={saving} className="bg-amber-600 hover:bg-amber-700 px-8">
              {saving ? 'Salvando...' : editingId ? 'Atualizar Promoção' : 'Criar Promoção'}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
            )}
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
  const [categoriesList, setCategoriesList] = useState([]);

  const queryClient = useQueryClient();
  
  const { data: products = [], isLoading, error: productsError } = useQuery({
    queryKey: ["all-products"],
    queryFn: fetchProducts,
    enabled: authenticated,
  });

  // Fetch categories from API
  useEffect(() => {
    fetch(`${API_URL}/api/categories`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setCategoriesList(data))
      .catch(() => {});
  }, [adminTab]); // Refetch when switching tabs (in case new categories were saved)

  const categoryNames = categoriesList.map(c => c.name);
  
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
          <Button
            variant={adminTab === "promocoes" ? "default" : "outline"}
            onClick={() => setAdminTab("promocoes")}
            className="flex items-center gap-2"
          >
            <Megaphone className="w-4 h-4" /> Promoções
          </Button>
        </div>

        {/* Conteúdo das Tabs */}
        {adminTab === "clientes" && <AdminClientes />}
        {adminTab === "pedidos" && <AdminPedidos />}
        {adminTab === "config" && <AdminConfiguracoes />}
        {adminTab === "promocoes" && <AdminPromocoes />}

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
                    {categoryNames.length === 0 && <option value="">Carregando...</option>}
                    {categoryNames.map((cat) => (
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
  const [pointsModal, setPointsModal] = useState(null); // { id, name }
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [pointsLoading, setPointsLoading] = useState(false);

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

  const handleAddPoints = async () => {
    if (!pointsModal || !purchaseAmount || parseFloat(purchaseAmount) <= 0) return;
    setPointsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/customers/${pointsModal.id}/loyalty`, {
        method: 'PUT',
        headers: { ...adminHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchaseAmount: parseFloat(purchaseAmount) }),
      });
      if (res.ok) {
        setPointsModal(null);
        setPurchaseAmount("");
        loadCustomers();
      } else {
        alert("Erro ao adicionar pontos");
      }
    } catch (err) {
      console.error("Erro ao adicionar pontos:", err);
      alert("Erro de conexão");
    }
    setPointsLoading(false);
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
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setPointsModal({ id: c.id, name: c.name }); setPurchaseAmount(""); }}
                          className="flex items-center gap-1 text-green-700 border-green-200 hover:bg-green-50"
                        >
                          <Coins className="w-4 h-4" /> Pontos
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(c.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" /> Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Adicionar Pontos */}
      {pointsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setPointsModal(null)}>
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
              <Coins className="w-5 h-5 text-green-600" />
              Adicionar Pontos de Fidelidade
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Cliente: <strong>{pointsModal.name}</strong>
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Informe o valor da compra em dinheiro na loja. O cliente ganhará <strong>1 ponto por real</strong> gasto (ex: R$ 50 = 50 pontos).
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor da compra (R$)</label>
            <Input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Ex: 45.00"
              value={purchaseAmount}
              onChange={e => setPurchaseAmount(e.target.value)}
              className="mb-2"
              autoFocus
            />
            {purchaseAmount && parseFloat(purchaseAmount) > 0 && (
              <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2 mb-3">
                ✅ O cliente receberá <strong>{Math.floor(parseFloat(purchaseAmount))} pontos</strong> e o total gasto será atualizado.
              </p>
            )}
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setPointsModal(null)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={handleAddPoints}
                disabled={pointsLoading || !purchaseAmount || parseFloat(purchaseAmount) <= 0}
              >
                {pointsLoading ? "Salvando..." : "Adicionar Pontos"}
              </Button>
            </div>
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

  const approved = orders.filter(o => o.status === 'approved');
  const pending = orders.filter(o => o.status === 'pending');
  const rejected = orders.filter(o => o.status === 'rejected');
  const totalApproved = parseFloat(approved.reduce((s, o) => s + (o.total || 0), 0).toFixed(2));
  const totalPending = parseFloat(pending.reduce((s, o) => s + (o.total || 0), 0).toFixed(2));
  const totalAll = parseFloat(orders.reduce((s, o) => s + (o.total || 0), 0).toFixed(2));
  const ticketMedio = approved.length > 0 ? parseFloat((totalApproved / approved.length).toFixed(2)) : 0;

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Pedidos ({orders.length})</h2>

      {/* Relatório de Vendas */}
      {!loading && orders.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-600" /> Relatório de Vendas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <p className="text-xs text-green-700 font-medium">Vendas Aprovadas</p>
              <p className="text-xl font-bold text-green-800">R$ {totalApproved.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className="text-xs text-green-600">{approved.length} pedido{approved.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
              <p className="text-xs text-yellow-700 font-medium">Pendentes</p>
              <p className="text-xl font-bold text-yellow-800">R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className="text-xs text-yellow-600">{pending.length} pedido{pending.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
              <DollarSign className="w-6 h-6 text-amber-600 mx-auto mb-1" />
              <p className="text-xs text-amber-700 font-medium">Total Geral</p>
              <p className="text-xl font-bold text-amber-800">R$ {totalAll.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className="text-xs text-amber-600">{orders.length} pedido{orders.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <ShoppingBag className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-blue-700 font-medium">Ticket Médio</p>
              <p className="text-xl font-bold text-blue-800">R$ {ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              <p className="text-xs text-blue-600">por venda aprovada</p>
            </div>
          </div>
          {rejected.length > 0 && (
            <p className="text-xs text-red-500 mt-2 text-right">{rejected.length} pedido{rejected.length !== 1 ? 's' : ''} recusado{rejected.length !== 1 ? 's' : ''}</p>
          )}
        </div>
      )}
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
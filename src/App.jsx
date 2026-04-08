import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import { AccessibilityProvider } from '@/context/AccessibilityContext';
import Layout from './components/Layout';
import Chatbot from './components/Chatbot';
import AccessibilityPanel from './components/AccessibilityPanel';
import Home from './pages/Home';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import CustomerAuth from './pages/CustomerAuth';
import MyAccount from './pages/MyAccount';
import AdminProducts from './pages/AdminProducts';
import CheckoutStatus from './pages/CheckoutStatus';
import PixPayment from './pages/PixPayment';
import Sobre from './pages/Sobre';
import Blog from './pages/Blog';
import InstagramPlan from './pages/InstagramPlan';
import PlataformaAnalise from './pages/PlataformaAnalise';
import React from 'react';
import PromocaoCliente from '@/components/PromocaoCliente';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: 'monospace', color: '#c00' }}>
          <h2>Erro na aplicação:</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13 }}>{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const AuthenticatedApp = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/categorias" element={<Categories />} />
        <Route path="/produtos" element={<Products />} />
        <Route path="/carrinho" element={<Cart />} />
        <Route path="/produto/:id" element={<ProductDetail />} />
        <Route path="/conta" element={<CustomerAuth />} />
        <Route path="/minha-conta" element={<MyAccount />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/instagram-plan" element={<InstagramPlan />} />
        <Route path="/plataformas" element={<PlataformaAnalise />} />
        <Route path="/admin/produtos" element={<AdminProducts />} />
        <Route path="/checkout/status" element={<CheckoutStatus />} />
        <Route path="/pix/pagamento" element={<PixPayment />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};


function App() {

  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClientInstance}>
            <div>
              <Router>
                <AuthenticatedApp />
                <PromocaoCliente />
                <Chatbot />
                <AccessibilityPanel />
              </Router>
              <Toaster />
              <SonnerToaster position="top-center" richColors />
            </div>
          </QueryClientProvider>
        </AuthProvider>
      </AccessibilityProvider>
    </ErrorBoundary>
  )
}

export default App
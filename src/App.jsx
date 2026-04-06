import { Toaster } from "@/components/ui/toaster"
import capa from "./assets/capa.jpg";
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
import LoyaltyProgram from './pages/LoyaltyProgram';
import LoyaltyCard from './pages/LoyaltyCard';
import React from 'react';

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
        <Route path="/fidelidade" element={<LoyaltyProgram />} />
        <Route path="/minha-fidelidade" element={<LoyaltyCard />} />
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
              <img
                src={capa}
                alt="Capa Casa do Norte"
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block' }}
              />
              <Router>
                <AuthenticatedApp />
                <Chatbot />
                <AccessibilityPanel />
              </Router>
              <Toaster />
            </div>
          </QueryClientProvider>
        </AuthProvider>
      </AccessibilityProvider>
    </ErrorBoundary>
  )
}

export default App
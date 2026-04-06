# 🏥 Guia de Acessibilidade para Idosos - Casa do Norte

## Princípios de Design para Usuários Seniores

### 1. **Tipografia**
- **Tamanho mínimo**: 18px (contra 14px padrão web)
- **Fonte**: Sans-serif, sem serifs (Arial, Verdana, Segoe UI)
- **Peso**: Regular ou Bold, evitar light
- **Line-height**: 1.8 (contra 1.5 padrão)
- **Contraste**: Mínimo WCAG AAA (7:1)

### 2. **Cores**
- ✅ Preto sobre branco / branco sobre preto
- ✅ Azul escuro sobre branco
- ❌ Evitar: cinza sobre cinza, vermelho/verde juntos
- ✅ Não usar COR como único identificador

### 3. **Navegação**
- Menu principal com **máximo 5 itens**
- Breadcrumb sempre visível
- Nunca esconder funções importantes
- Botões de volta/home bem evidentes
- Evitar hover-only (use click)

### 4. **Botões e Interação**
- **Tamanho mínimo**: 48x48px (recomendado 56x56px)
- **Espaçamento**: Mínimo 20px entre botões
- **Rótulos claros**: "Comprar" em vez de "Checkout"
- **Confirmações**: Sempre pedir confirmação antes de deletar

### 5. **Formulários**
- **Labels visíveis** (nunca placeholder-only)
- **Campos grandes** com muito espaçamento
- **Erros em vermelho + texto** (não apenas ícone)
- **Instruções claras** passo-a-passo
- **Auto-complete** para endereço/telefone

### 6. **Imagens e Ícones**
- Alt-text descritivo em todas as imagens
- Ícones com texto (não apenas ícone)
- Evitar clip-art genérico, usar fotos reais

### 7. **Animações**
- ❌ Evitar animações rápidas/piscantes
- ✅ Transições lentas (min 300ms)
- ✅ Notificações visíveis por mínimo 3 segundos

### 8. **Estrutura de Página**
- Hierarquia clara (H1 > H2 > H3)
- Máximo 2-3 colunas
- Padding/margin generoso
- Não poluir com publicidades

### 9. **Busca e Filtros**
- Busca por voz (voice search)
- Autocomplete
- Filtros simples e visuais
- Resultados organizados

### 10. **Suporte**
- Número de telefone **grande e evidente**
- Chat ao vivo com humano
- FAQ com letra grande
- Vídeo tutorial (lento, com legendas)

## Implementação em CSS

```css
/* Modo Senior - Aumentar tamanhos globalmente */
.senior-mode {
  font-size: 18px !important;
  line-height: 1.8 !important;
}

.senior-mode h1 { font-size: 48px; }
.senior-mode h2 { font-size: 36px; }
.senior-mode h3 { font-size: 28px; }
.senior-mode p { font-size: 20px; }
.senior-mode button { 
  padding: 16px 32px; 
  font-size: 20px;
  min-width: 56px;
  min-height: 56px;
}

.senior-mode input,
.senior-mode select,
.senior-mode textarea {
  font-size: 20px;
  padding: 16px;
}
```

## Verificação de Acessibilidade

- [ ] Teste com zoom 200%
- [ ] Teste com leitor de tela (NVDA/JAWS)
- [ ] Teste com teclado apenas (sem mouse)
- [ ] Contraste: Use WAVE ou Axe DevTools
- [ ] Teste com usuários reais seniores

## Referências
- WCAG 2.1 AA/AAA
- Senior-Friendly Web Design Guidelines
- Age-Friendly Interface Design

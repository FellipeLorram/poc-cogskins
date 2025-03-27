# Análise de Domínio - Learning Paths App

## 1. Visão Geral do Sistema

O sistema é uma aplicação web que permite aos usuários criarem trilhas de aprendizado personalizadas a partir de conteúdos diversos (vídeos do YouTube*, documentos texto, markdown, PDF). O sistema utiliza IA para gerar questionários e validar conteúdos, implementando elementos de gamificação através de badges que futuramente serão convertidos em NFTs.

### 1.1 Objetivos Principais
- Geração de trilhas de aprendizado personalizadas
- Avaliação progressiva através de questionários
- Gamificação através de badges/NFTs
- Curadoria inteligente de conteúdo
- Experiência de aprendizado adaptativa

## 2. Entidades Principais

### 2.1 Trilha (Trail)
- Título
- Status (em andamento, completa)
- Tempo estimado de conclusão
- Badge associado
- Lista de conteúdos de entrada (máximo 3)
- Lista de quests (exatamente 3)
- Data de criação
- Última atualização

### 2.2 Conteúdo de Entrada (InputContent)
- Tipo (video, texto, pdf, markdown, doc)
- URL (para vídeos)
- Arquivo (para documentos)
- Tamanho/Duração
- Status de processamento
- Conteúdo processado (transcrição para vídeos)

### 2.3 Quest
- Nível de dificuldade (1, 2 ou 3)
- Status (bloqueado, disponível, em progresso, completo)
- Lista de perguntas (5)
- Número de tentativas
- Prompt utilizado para geração

### 2.4 Pergunta (Question)
- Texto da pergunta
- Alternativas (múltipla escolha)
- Resposta correta
- Status (respondida, não respondida)
- Feedback

### 2.5 Badge
- Ícone (Lucide React)
- Título
- Descrição
- Data de conquista
- Metadados para NFT

### 2.6 Usuário (implementação futura)
- Email (para Magic Link)
- Trilhas em progresso
- Badges conquistados
- Histórico de atividades

## 3. Regras de Negócio

### 3.1 Criação de Trilha
- Máximo de 3 conteúdos de entrada diferentes
- Conteúdos devem ser relacionados tematicamente (validado por IA)
- Conteúdo deve ser suficiente para gerar uma trilha significativa
- Cada trilha deve gerar exatamente 3 quests

### 3.2 Progressão
- Quests são desbloqueados sequencialmente
- Quest 2 só é gerado após conclusão do Quest 1
- Quest 3 só é gerado após conclusão do Quest 2
- Usuário pode pausar entre quests
- Progresso dentro de um quest é perdido ao sair

### 3.3 Questionários
- 5 perguntas por quest
- Dificuldade progressiva entre quests
- Múltipla escolha apenas
- Todas as perguntas devem ser respondidas corretamente
- Usuário não vê quais questões acertou até completar todas
- Número ilimitado de tentativas

### 3.4 Badges
- Concedido apenas após conclusão de todos os quests
- Único para cada trilha
- Gerado por IA (ícone + texto)
- Preparado para futura conversão em NFT

## 4. Fluxos de Usuário

### 4.1 Fluxo Principal
1. Usuário acessa página inicial
2. Visualiza trilhas existentes
3. Cria nova trilha (fornece conteúdos)
4. Sistema valida e processa conteúdos
5. Gera primeira quest (Sucessivamente as demais)
6. Usuário responde questionários
7. Ao completar, recebe badge

### 4.2 Fluxo de Autenticação
1. Usuário anônimo pode criar e iniciar trilhas
2. Login solicitado ao completar primeira trilha
3. Autenticação via Magic Link
4. Dados anteriores são preservados

## 5. Validações e Constraints

### 5.1 Conteúdo
- Tamanho máximo de arquivos:
  - Documentos texto/markdown: (entender melhor um tamanho que não comprometa a performace)
  - PDFs e DOCs: 5MB
  - Vídeos YouTube: máximo 30 minutos (ainda é um sonho conseguir a trancrição)
- Formatos aceitos: txt, md, pdf, doc
- URLs apenas do YouTube
- Validação de relevância temática via IA

### 5.2 Performance
- Geração progressiva de quests
- Cache local (Zustand) para dados de usuário

## 6. Integrações

### 6.1 IA (OpenAI)
- Validação de conteúdo:
  - Análise de relevância temática entre os conteúdos
  - Avaliação de suficiência para geração de trilha
  - Identificação do nível de complexidade do conteúdo
- Geração de questionários:
  - Prompt estruturado com contexto claro do conteúdo
  - Definição explícita do nível de dificuldade desejado
  - Especificação do formato das perguntas e alternativas
  - Garantia de progressão de dificuldade entre quests
- Geração de badges:
  - Prompt para geração de título relevante
  - Seleção contextual de ícone do Lucide
  - Geração de descrição da conquista 

### 6.2 NFT (Ethereum - Implementação Futura)
- Metadados necessários (Entender melhor quais os dados precisamos para gerar o NFT):
 da trilha
  - Data de conclusão
  - Dificuldade
  - Tema
  - Conquistas específicas

## 7. Gamificação

### 7.1 Sistema de Progressão
- Desbloqueio progressivo de conteúdo
- Feedback imediato nas respostas
- Visualização clara do progresso

### 7.2 Sistema de Recompensas
- Badges únicos por trilha
- Possível showcase de badges
- Preparação para NFTs

## 8. Considerações Técnicas

### 8.1 Armazenamento
- Local Storage para dados de usuário
- Zustand para gerenciamento de estado

### 8.2 Segurança
- Validação de conteúdo
- Rate limiting para chamadas de IA
- Sanitização de entrada de usuário

### 8.3 Performance
- Processamento lazy de conteúdo
- Geração progressiva de quests
- Caching apropriado

### 8.4 UX/UI
- Feedback claro de progresso
- Indicadores de carregamento
- Estados de erro informativos
- Responsividade 
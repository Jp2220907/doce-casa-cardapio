# Configuração do Supabase

1. No Supabase, abra o **SQL Editor**, cole o conteúdo de `supabase/schema.sql` e execute.
2. Na Vercel, crie estas variáveis em **Production** e **Preview**:

   - `SUPABASE_URL` = URL do projeto Supabase
   - `SUPABASE_SECRET_KEY` = chave secreta do Supabase (`sb_secret_...`)

3. Faça um novo deploy na Vercel.

A chave secreta deve ficar somente nas variáveis da Vercel. Nunca coloque essa chave neste arquivo, no código ou no GitHub.

O primeiro login no painel importa automaticamente o catálogo que ainda estiver salvo no navegador do administrador. Depois disso, produtos, status, configurações e novas imagens passam a ser compartilhados pelos dispositivos.

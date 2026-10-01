# Configuração do Supabase

1. Para um projeto novo, execute `supabase/schema.sql` no **SQL Editor** do Supabase. O projeto atual recebeu a migração `secure_catalog_operations`, aplicada diretamente ao banco existente para preservar os produtos.
2. Na Vercel, mantenha estas variáveis em **Production** e **Preview**:

   - `SUPABASE_URL` = URL do projeto Supabase
   - `SUPABASE_SECRET_KEY` = chave secreta do Supabase (`sb_secret_...`)
   - `ADMIN_EMAIL` e `ADMIN_PASSWORD` = credenciais privadas do painel de administração

3. Publique as alterações no GitHub e aguarde o deploy da Vercel. Não é necessário definir `PORT` na Vercel.

A chave secreta do Supabase deve ficar somente nas variáveis da Vercel. Nunca a coloque neste arquivo, no código ou no GitHub. A chave é usada no servidor para operações privilegiadas; nunca é exposta no cardápio público.

O banco existente é a fonte oficial do catálogo. Dados antigos salvos apenas no navegador não são importados automaticamente, pois isso poderia substituir os produtos compartilhados. Imagens enviadas ficam no bucket `product-images`, com limite de 5 MB para JPEG, PNG e WebP. Ao remover uma foto e salvar o produto, o arquivo antigo também é apagado quando nenhum outro produto o utiliza.

O painel usa uma sessão assinada, protegida por cookie HttpOnly, SameSite=Strict e validade de 8 horas. O banco limita tentativas de login e registra apenas um hash do endereço IP. As tabelas expostas mantêm RLS ativado; apenas as funções chamadas pelo servidor têm permissão de gravação.

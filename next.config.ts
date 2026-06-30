import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ne pas logger les invocations de Server Actions en dev : elles incluraient
  // leurs arguments (dont les mots de passe) dans le terminal. La sécurité au
  // repos/en transit est assurée par Supabase (hash bcrypt) + HTTPS ;
  // ceci évite simplement la fuite dans les logs de développement.
  logging: {
    serverFunctions: false,
  },
};

export default nextConfig;

import { PrismaClient } from "@/lib/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

// Créer l'adapter avec l'URL de connexion
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// Créer l'instance Prisma avec l'adapter (OBLIGATOIRE dans v7)
const prisma = new PrismaClient({
  adapter,
});

// Données de test à insérer
const userData = [
  {
    name: "Alice",
    desc: "desc 1",
  },
  {
    name: "Bob",
    desc: "desc 2",
  },
];

// Fonction principale
async function main() {
  console.log("🌱 Début du seed...");

  for (const u of userData) {
    const user = await prisma.test.create({ data: u });
    console.log(`✅ Créé utilisateur: ${user.name}`);
  }

  console.log("✨ Seed terminé !");
}

// Exécuter avec gestion des erreurs
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  const user = await prisma.user.findFirst();
  console.log("Testing with user:", user.id);

  try {
    const res = await fetch('http://localhost:3000/api/admin/users', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: user.id,
        name: 'New Name'
      })
    });

    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", data);
  } catch (e) {
    console.error("Fetch error:", e);
  }
}
main();

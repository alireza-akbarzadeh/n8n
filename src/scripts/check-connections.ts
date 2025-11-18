import prisma from '../shared/infrastructure/database/db';

async function checkConnections() {
  const connections = await prisma.connection.findMany({
    select: {
      id: true,
      fromOutput: true,
      toInput: true,
      workflowId: true,
    },
  });

  console.log(`Found ${connections.length} connections`);

  const invalidHandleRegex = /^[a-zA-Z0-9_]+$/;

  const invalidConnections = connections.filter((conn) => {
    const invalidFrom = !conn.fromOutput || !invalidHandleRegex.test(conn.fromOutput);
    const invalidTo = !conn.toInput || !invalidHandleRegex.test(conn.toInput);
    return invalidFrom || invalidTo;
  });

  if (invalidConnections.length > 0) {
    console.log('\nInvalid connections found:');
    invalidConnections.forEach((conn) => {
      console.log(`- ID: ${conn.id}, fromOutput: "${conn.fromOutput}", toInput: "${conn.toInput}"`);
    });
  } else {
    console.log('\nAll connections have valid handles.');
  }

  await prisma.$disconnect();
}

checkConnections().catch(console.error);

const path = require('path')

/**
 * Prisma config used by `prisma generate` / `prisma migrate`.
 *
 * This repo stores the Prisma schema inside `sdk/prisma/schema.prisma`.
 */
const schemaPath = path.join(process.cwd(), 'sdk', 'prisma', 'schema.prisma')

module.exports = {
  schema: schemaPath,
  migrate: {
    async url() {
      return process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL
    },
  },
}



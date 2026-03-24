const path = require('path')

module.exports = {
  schema: path.join(__dirname, 'sdk', 'prisma', 'schema.prisma'),
  migrate: {
    async url() {
      return process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL
    },
  },
}


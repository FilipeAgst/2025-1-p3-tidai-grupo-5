import postgres from 'postgres'

const connectionString = 'postgresql://postgres.zzjtzbxqnptefmhjcrvr:Postgresql1@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'
//const connectionString = 'postgresql://postgres:Postgresql1@db.zzjtzbxqnptefmhjcrvr.supabase.co:5432/postgres'
const sql = postgres(connectionString)

export default sql
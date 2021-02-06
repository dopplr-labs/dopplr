type Config = {
  port: number
  database: string
}

type ResourceItem = {
  id: string
  title: string
  description: string
  image: string
  comingSoon: boolean
  editorSyntax?: string
  defaultConfig?: Config
}

export const resourcesList: ResourceItem[] = [
  {
    id: 'postgres',
    title: 'Postgres',
    description:
      'Connect with PostgreSQL database to run SQL queries in Dopplr',
    image: require('images/resources/postgres-logo.png').default,
    comingSoon: false,
    editorSyntax: 'pgsql',
    defaultConfig: {
      port: 5432,
      database: 'postgres',
    },
  },
  {
    id: 'mysql',
    title: 'MySQL',
    description: 'Connect with MySQL database to run SQL queries in Dopplr',
    image: require('images/resources/mysql-logo.svg').default,
    comingSoon: false,
    editorSyntax: 'mysql',
    defaultConfig: {
      port: 3306,
      database: 'mysql',
    },
  },
  {
    id: 'vertica',
    title: 'Vertica',
    description: 'Connect with Vertica database to run SQL queries in Dopplr',
    image: require('images/resources/vertica-logo.png').default,
    editorSyntax: 'sql',
    comingSoon: true,
  },
  {
    id: 'hive',
    title: 'Hive',
    description: 'Connect with Hive database to run SQL queries in Dopplr',
    image: require('images/resources/hive-logo.png').default,
    editorSyntax: 'sql',
    comingSoon: true,
  },
  {
    id: 'redshift',
    title: 'Redshift',
    description: 'Connect with Redshift database to run SQL queries in Dopplr',
    image: require('images/resources/redshift-logo.png').default,
    editorSyntax: 'sql',
    comingSoon: true,
  },
  {
    id: 'mongodb',
    title: 'MongoDB',
    description: 'Connect with MongoDB database to run queries in Dopplr',
    image: require('images/resources/mongodb-logo.png').default,
    comingSoon: true,
  },
]

export function getResource(resourceType: string): ResourceItem | undefined {
  return resourcesList.find((resource) => resource.id === resourceType)
}

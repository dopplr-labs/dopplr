type ResourceItem = {
  id: string
  title: string
  description: string
  image: string
  comingSoon: boolean
}

export const resourcesList: ResourceItem[] = [
  {
    id: 'postgres',
    title: 'Postgres',
    description:
      'Connect with PostgreSQL database to run SQL queries in Dopplr',
    image: require('images/resources/postgres-logo.png').default,
    comingSoon: false,
  },
  {
    id: 'mysql',
    title: 'MySQL',
    description: 'Connect with MySQL database to run SQL queries in Dopplr',
    image: require('images/resources/mysql-logo.svg').default,
    comingSoon: false,
  },
  {
    id: 'vertica',
    title: 'Vertica',
    description: 'Connect with Vertica database to run SQL queries in Dopplr',
    image: require('images/resources/vertica-logo.png').default,
    comingSoon: true,
  },
  {
    id: 'hive',
    title: 'Hive',
    description: 'Connect with Hive database to run SQL queries in Dopplr',
    image: require('images/resources/hive-logo.png').default,
    comingSoon: true,
  },
  {
    id: 'redshift',
    title: 'Redshift',
    description: 'Connect with Redshift database to run SQL queries in Dopplr',
    image: require('images/resources/redshift-logo.png').default,
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

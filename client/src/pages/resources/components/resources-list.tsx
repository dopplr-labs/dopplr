import React from 'react'
import { Link } from 'react-router-dom'
import ResourceCard from './resource-card'

export const resourcesList = [
  {
    id: 'postgres',
    title: 'Postgres',
    description:
      'Connect with PostgreSQL database to run SQL queries in Dopplr',
    image: require('images/resources/postgres-logo.png').default,
    commingSoon: false,
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

export default function ResourcesList() {
  return (
    <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {resourcesList.map((resource) =>
        resource.comingSoon ? (
          <ResourceCard
            title={resource.title}
            description={resource.description}
            imagePath={resource.image}
            comingSoon={resource.comingSoon ?? false}
            key={resource.id}
          />
        ) : (
          <Link to={`/resources/new/${resource.id}`} key={resource.id}>
            <ResourceCard
              title={resource.title}
              description={resource.description}
              imagePath={resource.image}
              comingSoon={resource.comingSoon ?? false}
            />
          </Link>
        ),
      )}
    </div>
  )
}

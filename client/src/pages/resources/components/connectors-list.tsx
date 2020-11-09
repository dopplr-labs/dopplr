import React from 'react'
import { Link } from 'react-router-dom'
import ResourceCard from './resource-card'
import Banner from './banner'

const cardList = [
  {
    id: 'postgres',
    title: 'Postgres',
    description:
      'Connect with PostgreSQL database to run SQL queries in Dopplr',
    imagePath: require('../../../images/resources/postgres-logo.png'),
    commingSoon: false,
  },
  {
    id: 'vertica',
    title: 'Vertica',
    description: 'Connect with Vertica database to run SQL queries in Dopplr',
    imagePath: require('../../../images/resources/vertica-logo.png'),
    comingSoon: true,
  },
  {
    id: 'hive',
    title: 'Hive',
    description: 'Connect with Hive database to run SQL queries in Dopplr',
    imagePath: require('../../../images/resources/hive-logo.png'),
    comingSoon: true,
  },
  {
    id: 'redshift',
    title: 'Redshift',
    description: 'Connect with Redshift database to run SQL queries in Dopplr',
    imagePath: require('../../../images/resources/redshift-logo.png'),
    comingSoon: true,
  },
  {
    id: 'mongodb',
    title: 'MongoDB',
    description: 'Connect with MongoDB database to run queries in Dopplr',
    imagePath: require('../../../images/resources/mongodb-logo.png'),
    comingSoon: true,
  },
]

export default function Connectors() {
  return (
    <div className="flex flex-col flex-1">
      <Banner />
      <div className="grid gap-4 p-4 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {cardList.map((card) =>
          card.comingSoon ? (
            <ResourceCard
              title={card.title}
              description={card.description}
              imagePath={card.imagePath}
              comingSoon={card.comingSoon ?? false}
            />
          ) : (
            <Link to={`/resources/new/${card.id}`} key={card.id}>
              <ResourceCard
                title={card.title}
                description={card.description}
                imagePath={card.imagePath}
                comingSoon={card.comingSoon ?? false}
              />
            </Link>
          ),
        )}
      </div>
    </div>
  )
}

import React from 'react'
import Banner from './components/banner'
import ResourceCard from './components/resource-card'

const cardList = [
  {
    id: 'postgres',
    title: 'Postgres',
    description:
      'Connect with PostgreSQL database to run SQL queries in dopplr',
    imagePath: require('../../images/resources/postgres-logo.png'),
    commingSoon: false,
  },
  {
    id: 'vertica',
    title: 'Vertica',
    description:
      'Connect with PostgreSQL database to run SQL queries in dopplr',
    imagePath: require('../../images/resources/vertica-logo.png'),
    comingSoon: true,
  },
  {
    id: 'hive',
    title: 'Hive',
    description:
      'Connect with PostgreSQL database to run SQL queries in dopplr',
    imagePath: require('../../images/resources/hive-logo.png'),
    comingSoon: true,
  },
  {
    id: 'redshift',
    title: 'Redshift',
    description:
      'Connect with PostgreSQL database to run SQL queries in dopplr',
    imagePath: require('../../images/resources/redshift-logo.png'),
    comingSoon: true,
  },
  {
    id: 'mongodb',
    title: 'MongoDB',
    description:
      'Connect with PostgreSQL database to run SQL queries in dopplr',
    imagePath: require('../../images/resources/mongodb-logo.png'),
    comingSoon: true,
  },
]

export default function Resources() {
  return (
    <div>
      <Banner />
      <div className="grid gap-4 p-4 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {cardList.map((card) => (
          <ResourceCard
            key={card.id}
            title={card.title}
            description={card.description}
            imagePath={card.imagePath}
            comingSoon={card.comingSoon ?? false}
          />
        ))}
      </div>
    </div>
  )
}

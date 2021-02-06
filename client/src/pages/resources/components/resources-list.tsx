import React from 'react'
import { Link } from 'react-router-dom'
import { resourcesList } from 'utils/resource'
import ResourceCard from './resource-card'

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

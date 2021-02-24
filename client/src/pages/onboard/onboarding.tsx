import React, { useState } from 'react'
import Step from './components/step'

const onboardingSteps = [
  {
    id: 1,
    title: 'Create a resource',
    description:
      "Let's get started by connecting your first database with Dopplr. You can connect Relational Databases like Postgres, MySQL and many more.",
    cta: 'Go to resource page',
    completed: false,
  },
  {
    id: 2,
    title: 'Run your 1st query',
    description: (
      <span>
        You can start with something simple like{' '}
        <strong>select * from table_name;</strong>
      </span>
    ),
    cta: 'Go to queries page',
    completed: true,
  },
  {
    id: 3,
    title: 'Plot and save a chart',
    description: 'Plot a chart using the data of a query result',
    cta: 'Go to queries page',
    completed: false,
  },
  {
    id: 4,
    title: 'Create a dashboard',
    description: 'Create your first dashboard and add charts in it',
    cta: 'Go to dashboards page',
    completed: false,
  },
]

export default function Onboarding() {
  const [openStep, setOpenStep] = useState<number | undefined>()

  function handleOpenStep(id: number) {
    setOpenStep((prevState) => (prevState !== id ? id : undefined))
  }

  return (
    <div className="w-full">
      <div className="max-w-4xl pb-8 mx-auto my-8 space-y-4 shadow-lg ">
        <div className="px-8 py-6 text-lg font-semibold border-b-2 text-brand-primary">
          Getting Started
        </div>
        <div className="px-8 space-y-4">
          {onboardingSteps.map((step) => (
            <Step
              key={step.id}
              id={step.id}
              title={step.title}
              description={step.description}
              cta={step.cta}
              completed={step.completed}
              isOpen={openStep === step.id}
              openStep={handleOpenStep}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

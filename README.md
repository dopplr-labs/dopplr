<img src="./assets/logo.ico" width="80px" />

# Dopplr

**dopplr** is an analytical tool for creating beautiful dashboards using sql queries. It is built using `react` and `nestjs`.

## Development Information

### Requirements

- [`docker`](https://docs.docker.com/engine/install/)
- [`docker-compose`](https://docs.docker.com/compose/install/)

### Technologies Used

- [docker](https://www.docker.com/) for containers
- [react](https://reactjs.org/) for development
- [tailwindcss](https://tailwindcss.com/) for styling
- [nestjs](https://nestjs.com/) for backend

### Starting with development

If you are running the dockers for the first time (or anytime the `Dockerfile`
or `docker-entrypoint.sh` changes), make sure to build all the containers using

```
[sudo] docker-compose up --build
```

Later on, to start all the 3 dockers (database, server and client) use

```
[sudo] docker-compose up
```

To install any package in the `client`, start the `docker` shell

```
[sudo] docker-compose exec client sh
```

To install any package in the `server`, start the `docker` shell

```
[sudo] docker-compose exec server sh
```

It would open the shell and you can then install any dependency using `npm` or `yarn`

### Creating sample database

To test the application, a sample database can be used, such as [northwind](https://github.com/pthom/northwind_psql). To restore the data use,

- First download the database dump from [here](https://raw.githubusercontent.com/pthom/northwind_psql/master/northwind.sql).

- Run the `docker` command to start `pqsl`

```sh
docker exec -it dopplr_postgres_1 psql -U admin northwind
```

- In the `psql` terminal, enter the follwing to create a database and exit out of it.

```psql
CREATE DATABASE northwind;
```

- Restore the database from the dump using

```sh
cat /path/to/downloaded/northwind.sql | docker exec -i dopplr_postgres_1 psql -U admin northwind
```

### Git Workflow

We use [gitflow workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) for managing git. It is recommended to use [gitflow](https://github.com/nvie/gitflow/wiki/Installation) plugin.

We also use [commitizen](https://github.com/commitizen/cz-cli) to write commit messages. It is very simple to use. Just install `commitizen` globally using

```sh
npm install -g commitizen
```

and use `cz` instead of `git commit`. It would ask you fill the some fields and your commit message would be ready. You can find more information about it [here](https://github.com/commitizen/cz-cli#if-your-repo-is-commitizen-friendly).

The overall flow of Gitflow is:

- A develop branch is created from master
- A release branch is created from develop
- Feature branches are created from develop
- When a feature is complete it is merged into the develop branch
- When the release branch is done it is merged into develop and master
- If an issue in master is detected a hotfix branch is created from master
- Once the hotfix is complete it is merged to both develop and master

#### Feature branch

Create a feature branch when you are working on a feature such as implementation of a new UI component.

```sh
git flow feature start feature_branch
```

#### Hotfix branch

Maintenance or “hotfix” branches are used to quickly patch production releases.

```sh
git flow hotfix start hotfix_branch
```

### Commits

#### Commit Message

We're using conventional commits to ensure consistency of commit messages.

Always assign a prefix to your first commit in a new branch.

For more information, check the [convention](https://www.conventionalcommits.org/en/v1.0.0/).

Please see [https://chris.beams.io/posts/git-commit/](https://chris.beams.io/posts/git-commit/) for information on how to write commit messages.

If the commit has a corresponding issue, make sure to add the reference to the issue in the commit message

```git
[ref-#329] Fixing the performance issue on the input field
```

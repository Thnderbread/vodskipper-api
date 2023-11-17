import knex, { Knex } from "knex"
import { GenericContainer, StartedTestContainer } from "testcontainers"
import { SQLiteTokenDatabase } from "../src/model/SqliteTokenDb"

export const TEST_TIMEOUT = 60_000 // needed to make sure tests don't fail or sumn (??)

export interface ContainerInstance {
  container: StartedTestContainer
  db: Knex<SQLiteTokenDatabase>
}

/**
 * Function to start up a test container
 *
 * @returns ContainerInstance with active test container
 * and knex db connection.
 */
export async function startContainer(): Promise<ContainerInstance> {
  const container = await new GenericContainer("sqlite")
    .withExposedPorts(8089)
    .start()

  const db = knex<SQLiteTokenDatabase>({
    client: "better-sqlite3",
    connection: {
      filename: ":memory:",
    },
    debug: true,
    useNullAsDefault: true,
  })

  return { container, db }
}

/**
 * Teardown for an existing container instance.
 *
 * @param instance Existing ContainerInstance.
 */
export async function stopContainer(
  instance: ContainerInstance
): Promise<void> {
  await instance.container.stop()
  await instance.db.destroy()
}

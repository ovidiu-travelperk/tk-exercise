import { Fabricator, sequence } from "@travelperksl/fabricator";
import faker from "faker";

const recipeFabricator = Fabricator({
  id: () => sequence("id"),
  name: () => faker.random.words(),
});

export { recipeFabricator };

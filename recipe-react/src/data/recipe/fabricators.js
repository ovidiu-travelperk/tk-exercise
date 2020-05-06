import { Fabricator, sequence } from "@travelperksl/fabricator";
import faker from "faker";

const ingredientFabricator = Fabricator({
  name: () => faker.random.words(),
});

const recipeFabricator = Fabricator({
  id: () => sequence("id"),
  name: () => faker.random.words(),
  ingredients: () => ingredientFabricator.times({ max: 5 }),
});

export { recipeFabricator };

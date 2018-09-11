import { mapToEntities } from "../../helpers";
import { Category } from "../../models";

const categoryNames = [
  "Uncategorized",
  "Cats",
  "Dogs"
];

const categories: Category[] = mapToEntities(categoryNames);

export = categories

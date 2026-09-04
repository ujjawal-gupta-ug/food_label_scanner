// Words that typically start the NEXT section on an Indian food label —
// used to know where the ingredient list ends.
const SECTION_STOP_WORDS = [
  "nutrition",
  "nutritional",
  "allergen",
  "storage",
  "manufactured",
  "best before",
  "net weight",
  "contains",
  "customer care",
  "fssai",
];

const extractIngredientNames = (text) => {
  const lower = text.toLowerCase();
  const startIdx = lower.indexOf("ingredient");
  if (startIdx === -1) return [];

  // Skip past "ingredients" / "ingredients:" to where the list itself starts
  const colonIdx = lower.indexOf(":", startIdx);
  const sliceStart =
    colonIdx !== -1 && colonIdx - startIdx < 20 ? colonIdx + 1 : startIdx + "ingredients".length;

  // Find the nearest section boundary after that, so we don't sweep in nutrition text
  let stopIdx = text.length;
  for (const word of SECTION_STOP_WORDS) {
    const idx = lower.indexOf(word, sliceStart);
    if (idx !== -1 && idx < stopIdx) stopIdx = idx;
  }

  const raw = text.slice(sliceStart, stopIdx);

  return raw
    .split(",")
    .map((part) =>
      part
        .replace(/\([^)]*\)/g, "") // strip parenthetical notes, e.g. "(INS 322)"
        .replace(/[.:;]+$/g, "")
        .trim(),
    )
    .filter((name) => name.length > 1 && name.length < 40);
};

export default extractIngredientNames;

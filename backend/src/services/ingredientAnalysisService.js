const extractIngredientsOnly = (structuredData) => {
  return structuredData.ingredients || [];
};

export default extractIngredientsOnly;

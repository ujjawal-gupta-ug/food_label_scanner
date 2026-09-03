const cleanOCRText = (text) => {
  return (
    text
      // remove only weird symbols
      .replace(/[|~`^<>]/g, " ")

      // keep useful punctuation and units
      .replace(/[^a-zA-Z0-9(),.%:/\\-\\s&]/g, " ")

      // collapse spaces
      .replace(/\\s+/g, " ")

      .trim()
  );
};

export default cleanOCRText;

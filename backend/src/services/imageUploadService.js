const uploadImage = async (file) => {
  if (!file) {
    throw new Error("No image uploaded");
  }

  return {
    imageName: file.filename,
    imagePath: file.path,
    imageType: file.mimetype,
    imageSize: file.size,
  };
};

export default uploadImage;

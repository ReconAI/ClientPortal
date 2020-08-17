export function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = `name:${file.name};${reader.result}`;
      return resolve(result);
    };
    reader.onerror = (error) => reject(error);
  });
}

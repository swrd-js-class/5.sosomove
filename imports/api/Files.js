import { FilesCollection } from "meteor/ostrio:files";

const Files = new FilesCollection({
  collectionName: "files",
  allowClientCode: true,
  onBeforeUpload(file) {
    file.meta = { userId: this.userId };
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    }
    return "Please upload image, with size equal or less than 10MB";
  },
});

export { Files };
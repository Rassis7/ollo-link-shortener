export const mockFile = new File(["file content"], "file.txt", {
  type: "text/plain",
});

export const mockMultiPartPayload =
  "--AaB03x\r\n" +
  'Content-Disposition: form-data; name="setting_id"\r\n' +
  "\r\n" +
  "201\r\n" +
  "--AaB03x\r\n" +
  'Content-Disposition: form-data; name="double_sided"\r\n' +
  "\r\n" +
  "1\r\n" +
  "--AaB03x\r\n" +
  'Content-Disposition: form-data; name="name"\r\n' +
  "\r\n" +
  "test\r\n" +
  "--AaB03x\r\n" +
  'Content-Disposition: form-data; name="file"; filename="4x6.pdf"\r\n' +
  "Content-Type: application/pdf\r\n" +
  "\r\n" +
  mockFile +
  "\r\n" +
  "--AaB03x--\r\n";

export const mockMultiPartHeader = {
  "Content-Type": "multipart/form-data; boundary=AaB03x",
};

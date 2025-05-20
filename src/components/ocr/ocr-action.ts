"use server";
export const handleSubmit = async (formData: FormData) => {
  const nik = formData.get("nik");
  const name = formData.get("name");
  const address = formData.get("address");

  console.log({ nik, name, address });
};

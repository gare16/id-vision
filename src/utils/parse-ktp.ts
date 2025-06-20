export interface KTPData {
  nik: string;
  name: string;
  address: string;
  birth_info: string;
}

export function parseKTPText(raw: string): KTPData {
  const text = raw
    .replace(/\s{2,}/g, " ")
    .replace(/[\n\r]+/g, " ")
    .replace(/[^\x00-\x7F]+/g, "") // remove non-ASCII
    .toUpperCase();

  console.log(text);

  const get = (regex: RegExp) => regex.exec(text)?.[1]?.trim() || "";

  const birthMatch =
    /TEMPATITGL LAHIR\s*:\s*([A-Z]+),\s*(\d{2}[-\/]?\d{2}[-\/]?\d{4})/.exec(
      text
    );
  const birth_info = birthMatch
    ? `${birthMatch[1].trim()}, ${birthMatch[2].trim()}`
    : "";

  const alamat = get(/ALAMAT\s*:\s*([A-Z0-9\.\/\s]+)/);
  const rtRw = get(/RT\/RW\s*:\s*(\d{3}\/\d{3})/);
  const kelDesa = get(/KEL\/DESA\s*:\s*([A-Z\s]+)/);
  const kecamatan = get(/KECAMATAN\s*:\s*([A-Z\s]+)/);

  const fullAddress = [
    alamat,
    `RT/RW ${rtRw}`,
    `Kel/Desa ${kelDesa}`,
    `Kecamatan ${kecamatan}`,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    nik: get(/NIK\s*:\s*(\d{10,})/),
    name: get(/NAMA\s*:\s*([A-Z\s]+)/),
    address: fullAddress,
    birth_info,
  };
}

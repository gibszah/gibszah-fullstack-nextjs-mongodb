"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTopics } from "../UI/apiClient";

const getObat = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/obat", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("failed to fetch data");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.log("error loading topics: ", error);
  }
};

export default function EditTopicForm({
  id,
  pbf,
  faktur,
  type,
  buy,
  sell,
  description,
  user,
  stok,
  ecer,
  tgldatang,
  liability,
  liadate,
  remark,
  jenis,
  namaobat,
  merk,
  stokecer,
  satuanecer,
  grosir,
}) {
  const [brands, setBrands] = useState([]);
  const [obat, setObat] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const { brands } = await getTopics();
        const { obats } = await getObat();
        setObat(obats);
        setBrands(brands);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);
  const [newStokEcer, setNewStokEcer] = useState(stokecer || "");
  const [newSatuan, setNewSatuan] = useState(satuanecer || "");
  const [pbfName, setPbfName] = useState(pbf || "");
  const [newType, setNewType] = useState(type || "");
  const [newBuy, setNewBuy] = useState(buy || "");
  const [newSell, setNewSell] = useState(sell || "");
  const [newDescription, setNewDescription] = useState(description || "");
  const [newStok, setNewStok] = useState(stok || "");
  const [newEcer, setNewEcer] = useState(ecer || "");
  const [newGrosir, setNewGrosir] = useState(grosir || "");
  const [eta, setEta] = useState(tgldatang || "");
  const [newliability, setNewLiability] = useState(liability || "");
  const [newliadate, setNewLiaDate] = useState(liadate || "");
  const [newremark, setNewRemark] = useState(remark || "");
  const [newjenis, setNewJenis] = useState(jenis || "");
  const [newNamaObat, setNewNamaObat] = useState(namaobat || "");
  const [newmerk, setNewMerk] = useState(merk || "");
  const [newfaktur, setNewFaktur] = useState(faktur || "");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/api/topics/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          newStokEcer,
          newfaktur,
          newType,
          newBuy,
          newSell,
          newDescription,
          newStok,
          newEcer,
          newGrosir,
          eta,
          newliability,
          newliadate,
          newremark,
          newjenis,
          newNamaObat,
          newmerk,
          newSatuan,
          pbfName,
        }),
      });

      const response = await res.json();
      if (!res.ok) {
        throw new Error("Failed to update topic");
      }
      console.log(response);
      router.refresh();
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  const formatToRupiah = (number) => {
    if (number === "") return ""; // Return empty string if no input

    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    return formatter.format(number);
  };
  const [margin, setMargin] = useState("");
  const [marginEcer, setMarginEcer] = useState("");
  const [ngeceran, setNgeceran] = useState("");
  const handleMarginGrosir = () => {
    const laba = (parseFloat(margin) / 100) * parseFloat(newBuy);
    const labaTotal = parseFloat(laba) + parseFloat(newBuy);
    setNewSell(labaTotal);
  };

  const totalStok = parseFloat(ngeceran) * parseFloat(newStok);

  const handleMarginEcer = () => {
    const bijian = parseFloat(newBuy) / parseFloat(newStok);
    const biji = parseFloat(bijian) / parseFloat(ngeceran);
    const laba = parseFloat(biji) * (parseFloat(marginEcer) / 100);
    const total = parseFloat(laba) + parseFloat(biji);
    setNewStokEcer(totalStok);
    setNewEcer(total);
  };

  const [searchObat, setSearchObat] = useState("");

  return (
    <div className="text-black shadow-xl card-body">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="shadow-xl card w-fit bg-amber-100">
          <div className="card-body">
            <div className="w-full max-w-xs mb-1 form-control">
              <label>PBF / Perusahaan : </label>
              <select
                className="w-full max-w-xs text-sm bg-green-300 select-bordered select-sm select"
                required
                value={pbfName}
                onChange={(e) => setPbfName(e.target.value)}
              >
                <option value="">Pilih Nama PBF / Perusahaan</option>
                {brands.map((t) => {
                  return (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="w-full max-w-xs mb-1 form-control">
              <label>
                <span className="text-lg label-text">Nomor Faktur :</span>
              </label>
              <input
                className="w-full max-w-xs mb-1 input-sm input input-bordered input-accent "
                required
                type="text"
                onChange={(e) => setNewFaktur(e.target.value)}
                value={newfaktur}
                placeholder="No. Faktur"
              />
            </div>

            <div className="w-full max-w-xs mb-1 form-control">
              <label>
                <span className="text-lg label-text">Tanggal Diterima :</span>
              </label>
              <input
                className="w-full max-w-xs mb-1 input-sm input input-bordered input-accent "
                required
                type="date"
                onChange={(e) => setEta(e.target.value)}
                value={eta}
                placeholder="No. Faktur"
              />
            </div>

            <div className="w-full max-w-xs mb-1 form-control">
              <label>
                <span className="text-lg label-text">
                  Nama Sediaan Farmasi :
                </span>
              </label>
              <input
                className="w-full max-w-xs mb-1 input-sm input input-bordered input-accent "
                type="text"
                onChange={(e) => setSearchObat(e.target.value)}
                value={searchObat}
                placeholder="Cari Nama Sediaan"
              />
              <select
                className="w-full max-w-xs text-sm bg-green-300 select-bordered select-sm select"
                required
                value={newNamaObat}
                onChange={(e) => setNewNamaObat(e.target.value)}
              >
                <option value="">Pilih Nama Sediaan</option>
                {obat
                  .filter((t) =>
                    t.name.toLowerCase().includes(searchObat.toLowerCase())
                  )
                  .map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="w-full max-w-xs mb-1 form-control">
              <label>
                <span className="text-lg label-text">Jenis Sediaan :</span>
              </label>
              <input
                className="w-full max-w-xs mb-1 input-sm input input-bordered input-accent "
                type="text"
                onChange={(e) => setNewType(e.target.value)}
                value={newType}
                placeholder="Jenis Sediaan"
              />
            </div>

            <div className="w-full max-w-xs mb-1 form-control">
              <label>
                <span className="text-lg label-text">Jumlah :</span>
              </label>
              <input
                className="w-full max-w-xs mb-1 input-sm input input-bordered input-accent "
                required
                type="number"
                onChange={(e) => setNewStok(e.target.value)}
                value={newStok}
                placeholder="Jumlah Barang yang Diterima"
              />
              <select
                className="w-full max-w-xs select-bordered select-sm select"
                value={newjenis}
                onChange={(e) => setNewJenis(e.target.value)}
              >
                <option>Satuan</option>
                <option value="box">box</option>
                <option value="tube">tube</option>
                <option value="tablet">tablet</option>
                <option value="strip">strip</option>
                <option value="botol">botol</option>
                <option value="pcs">pcs</option>
                <option value="ampul">ampul</option>
                <option value="vial">vial</option>
                <option value="package">package</option>
              </select>
            </div>

            <div className="w-full max-w-xs mb-1 form-control">
              <label>
                <span className="text-lg label-text">Harga Beli Grosir :</span>
              </label>
              <input
                className="w-full max-w-xs mb-1 input-sm input input-bordered input-accent "
                required
                type="number"
                onChange={(e) => setNewBuy(e.target.value)}
                value={newBuy}
                placeholder="Harga Beli Grosir"
              />
              <p>{formatToRupiah(newBuy)}</p>
            </div>

            <div className="w-full max-w-xs mb-1 form-control">
              <label>
                <span className="text-lg label-text">Hutang :</span>
              </label>
              <input
                className="w-full max-w-xs mb-1 input-sm input input-bordered input-accent "
                type="number"
                onChange={(e) => setNewLiability(e.target.value)}
                value={newliability}
                placeholder="Hutang"
              />
              <p>{formatToRupiah(newliability)}</p>
            </div>

            <div className="w-full max-w-xs mb-1 form-control">
              <label>
                <span className="text-lg label-text">Jatuh Tempo :</span>
              </label>
              <input
                className="w-full max-w-xs mb-1 input-sm input input-bordered input-accent "
                type="date"
                onChange={(e) => setNewLiaDate(e.target.value)}
                value={newliadate}
                placeholder="Harga Beli Grosir"
              />
            </div>

            <div className="w-full max-w-xs mb-1 form-control">
              <label>
                <span className="text-lg label-text">Catatan :</span>
              </label>
              <input
                className="w-full max-w-xs mb-1 input-sm input input-bordered input-accent "
                type="text"
                onChange={(e) => setNewRemark(e.target.value)}
                value={newremark}
                placeholder="Catatan"
              />
            </div>

            {/* <div className="w-full max-w-xs mb-1 form-control">
              <label>
                <span className="mb-2 text-lg font-bold label-text">
                  Harga Jual Grosir :
                </span>
              </label>
              <div className="mb-2 bg-green-300 collapse collapse-arrow">
                <input
                  type="radio"
                  name="my-accordion-18"
                  defaultChecked
                  // checked="checked"
                />
                <div className="text-base font-bold collapse-title">
                  Hitung Margin
                </div>
                <div className="collapse-content">
                  <label>
                    <span className="text-sm label-text">Margin (%) :</span>
                  </label>
                  <input
                    className="w-full max-w-xs mb-1 input-sm input input-bordered input-accent "
                    type="number"
                    onChange={(e) => setMargin(e.target.value)}
                    value={margin}
                    placeholder="Tentukan Margin (%)"
                  />
                  <button
                    type="button"
                    className="mb-2 btn btn-active btn-sm"
                    onClick={handleMarginGrosir}
                  >
                    Hitung
                  </button>
                </div>
              </div>
              <div className="bg-green-300 collapse collapse-arrow">
                <input
                  type="radio"
                  name="my-accordion-18"
                  defaultChecked
                  // checked="checked"
                />
                <div className="text-base font-bold collapse-title">
                  Manual Input
                </div>
                <div className="collapse-content">
                  <input
                    className="w-full max-w-xs mb-1 input-sm input input-bordered input-accent "
                    type="number"
                    onChange={(e) => setNewSell(e.target.value)}
                    value={newSell}
                    placeholder="Ketik Langsung Harga Jual Grosir"
                  />
                </div>
              </div>
              <p className="mt-2 mb-2 font-bold">
                Harga Jual Grosir: {formatToRupiah(newSell)}
              </p>
            </div> */}
            <hr style={{ border: "1px black solid" }} />

            <div className="w-full max-w-xs mb-1 form-control">
              <label>
                <span className="mb-2 text-lg font-bold label-text">
                  Harga Eceran :
                </span>
              </label>
              <div className="mb-2 bg-green-300 collapse collapse-arrow">
                <input
                  type="radio"
                  name="my-accordion-15"
                  defaultChecked
                  //  checked="checked"
                />
                <div className="text-base font-bold collapse-title">
                  Hitung Margin Eceran
                </div>
                <div className="collapse-content">
                  <label>
                    <span className="mt-1 text-sm label-text">
                      Jumlah Per Satuan :
                    </span>
                  </label>
                  <div className="flex justify-between">
                    <input
                      className="w-full max-w-xs mb-1 input-sm input input-bordered input-accent "
                      type="number"
                      onChange={(e) => setNgeceran(e.target.value)}
                      value={ngeceran}
                      placeholder="Jumlah per-Satuan"
                    />
                    <select
                      className="select-bordered select-sm select"
                      value={newSatuan}
                      onChange={(e) => setNewSatuan(e.target.value)}
                    >
                      <option>Satuan</option>
                      <option value="box">box</option>
                      <option value="tube">tube</option>
                      <option value="tablet">tablet</option>
                      <option value="strip">strip</option>
                      <option value="botol">botol</option>
                      <option value="pcs">pcs</option>
                      <option value="ampul">ampul</option>
                      <option value="vial">vial</option>
                      <option value="package">package</option>
                    </select>
                  </div>
                  <label>
                    <span className="mt-1 text-sm label-text">
                      Margin (%) :
                    </span>
                  </label>

                  <input
                    className="w-full max-w-xs mb-1 input-sm input input-bordered input-accent "
                    type="number"
                    onChange={(e) => setMarginEcer(e.target.value)}
                    value={marginEcer}
                    placeholder="Tentukan Margin (%)"
                  />
                  <button
                    type="button"
                    className="mb-2 btn btn-success btn-sm"
                    onClick={handleMarginEcer}
                  >
                    Hitung
                  </button>
                </div>
              </div>
              <div className="bg-green-300 collapse collapse-arrow">
                <input
                  type="radio"
                  name="my-accordion-15"
                  defaultChecked
                  // checked="checked"
                />
                <div className="text-base font-bold collapse-title">
                  Manual Harga 1
                </div>
                <div className="collapse-content">
                  <input
                    className="w-full max-w-xs mb-1 input-sm input input-bordered input-accent "
                    type="number"
                    onChange={(e) => setNewEcer(e.target.value)}
                    value={newEcer}
                    placeholder="Ketik Langsung Harga Jual Eceran"
                  />
                </div>
              </div>

              <div className="bg-green-300 collapse collapse-arrow">
                <input
                  type="radio"
                  name="my-accordion-15"
                  defaultChecked
                  // checked="checked"
                />
                <div className="text-base font-bold collapse-title">
                  Manual Harga 2
                </div>
                <div className="collapse-content">
                  <input
                    className="w-full max-w-xs mb-1 input-sm input input-bordered input-accent "
                    type="number"
                    onChange={(e) => setNewGrosir(e.target.value)}
                    value={newGrosir}
                    placeholder="Ketik Langsung Harga Jual Eceran"
                  />
                </div>
              </div>
              <p className="mt-2 mb-2 font-bold">
                Harga Jual 1: {formatToRupiah(newEcer)}
              </p>
              <p className="mt-2 mb-2 font-bold">
                Harga Jual 2: {formatToRupiah(newGrosir)}
              </p>
            </div>
            <hr style={{ border: "1px black solid" }} />

            <div className="w-full max-w-xs mb-1 form-control">
              <label>
                <span className="text-lg label-text">Expired Date :</span>
              </label>
              <input
                className="px-3"
                type="date"
                onChange={(e) => setNewDescription(e.target.value)}
                value={newDescription}
                placeholder="expired date"
              />
            </div>

            <div className="justify-end card-actions">
              <button className="btn btn-secondary" type="submit">
                Save data
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

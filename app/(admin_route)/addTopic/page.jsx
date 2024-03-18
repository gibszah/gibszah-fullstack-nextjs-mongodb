"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { getTopics } from "../../../components/UI/apiClient";

const getObat = async () => {
  try {
    const res = await fetch("http://localhost:3001/api/obat", {
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

export default function AddSediaan() {
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

  console.log(brands);

  const router = useRouter();

  const [pbfId, setPbfId] = useState("");
  const [faktur, setFaktur] = useState("");
  const [type, setType] = useState("");
  const [buy, setBuy] = useState("");
  const [sell, setSell] = useState("");
  const [description, setDescription] = useState("");
  const [stok, setStok] = useState(0);
  const [ecer, setEcer] = useState("");
  const [grosir, setGrosir] = useState("");
  const [tgldatang, setTgldatang] = useState("");
  const [liability, setLiability] = useState("");
  const [liadate, setLiaDate] = useState("");
  const [remark, setRemark] = useState("");
  const [jenis, setJenis] = useState("");
  const [namaobatId, setNamaObatId] = useState("");
  const [merk, setMerk] = useState("");
  const [tip, setTip] = useState(false);

  const formatToRupiah = (number) => {
    if (number === "") return ""; // Return empty string if no input

    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    return formatter.format(number);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const res = await fetch("http://localhost:3001/api/topics", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          pbfId,
          faktur,
          type,
          buy,
          sell,
          description,
          stok,
          ecer,
          grosir,
          tgldatang,
          liability,
          liadate,
          remark,
          jenis,
          namaobatId,
          merk,
          stokecer,
          satuanecer,
        }),
      });

      if (res.ok) {
        setType("");
        setBuy("");
        setSell("");
        setDescription("");
        setStok("");
        setEcer("");
        setGrosir("");
        setRemark("");
        setJenis("");
        setNamaObatId("");

        setTip(true);
        console.log("Product berhasil dibuat!");
      } else {
        console.error("Error creating product");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [name, setName] = useState("");
  const [tipError, setTipError] = useState(false);
  const handleBrand = async (e) => {
    e.preventDefault();

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const res = await fetch("http://localhost:3001/api/brands", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });

      if (res.ok) {
        setName("");
        window.location.reload();
        console.log("data tersimpan");
      } else {
        setTipError(true);
        console.error("Error creating product");
      }
    } catch (error) {
      setTipError(true);
      console.log(error);
    }
  };

  const [obatCreate, setObatCreate] = useState("");

  // console.log(obat);
  const [searchObat, setSearchObat] = useState("");
  const handleObat = async (e) => {
    e.preventDefault();

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const res = await fetch("http://localhost:3001/api/obat", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: obatCreate,
        }),
      });

      if (res.ok) {
        setObatCreate("");
        window.location.reload();
        console.log("data tersimpan");
      } else {
        setTipError(true);
        console.error("Error creating product");
      }
    } catch (error) {
      setTipError(true);
      console.log(error);
    }
  };

  const [margin, setMargin] = useState("");
  const [marginEcer, setMarginEcer] = useState("");
  const [stokecer, setStokEcer] = useState("");
  const [ngeceran, setNgeceran] = useState("");
  const [satuanecer, setStokSatuanEcer] = useState("");

  const handleMarginGrosir = () => {
    const bijian = parseFloat(buy) / parseFloat(stok);

    const laba = (parseFloat(margin) / 100) * parseFloat(bijian);

    const labaTotal = parseFloat(laba) + parseFloat(bijian);
    setSell(labaTotal);
  };

  const totalStok = parseFloat(ngeceran) * parseFloat(stok);

  const handleMarginEcer = () => {
    const bijian = parseFloat(buy) / parseFloat(stok);
    const biji = parseFloat(bijian) / parseFloat(ngeceran);
    const laba = parseFloat(biji) * (parseFloat(marginEcer) / 100);
    const total = parseFloat(laba) + parseFloat(biji);
    setStokEcer(totalStok);
    setMerk(totalStok);
    setEcer(total);
  };

  useEffect(() => {
    if (tip) {
      const timeoutId = setTimeout(() => {
        setTip(false);
        setTipError(false);
      }, 10000);

      return () => clearTimeout(timeoutId);
    }
  }, [tip, tipError]);

  return (
    <>
      <div className="w-[400px] justify-center mx-52 mt-2 ">
        <div className="bg-orange-300 collapse collapse-arrow">
          <input type="radio" name="my-accordion-2" defaultChecked />
          <div className="text-base font-bold collapse-title">
            Klik untuk tambah database Nama Sediaan
          </div>
          <div className="collapse-content">
            <form onSubmit={handleObat}>
              <div className="w-full max-w-xs mb-1 form-control">
                <label>
                  <span className="text-lg label-text">Nama Sediaan :</span>
                </label>
                <input
                  className="w-full max-w-xs mb-1 input-sm input input-bordered input-accent "
                  required
                  type="text"
                  onChange={(e) => setObatCreate(e.target.value)}
                  value={obatCreate}
                  placeholder="Isi bila nama sediaan tidak ada"
                />
              </div>

              <button type="submit" className="btn btn-info btn-sm">
                Save
              </button>
            </form>
          </div>
        </div>
        <div className="collapse collapse-arrow bg-base-200">
          <input type="radio" name="my-accordion-2" />
          <div className="mt-2 text-base font-bold collapse-title">
            Klik untuk tambah database Nama PBF / Perusahaan
          </div>
          <div className="collapse-content">
            <form onSubmit={handleBrand}>
              <div className="w-full max-w-xs mb-1 form-control">
                <label>
                  <span className="text-lg label-text">
                    Nama PBF / Perusahaan :
                  </span>
                </label>
                <input
                  className="w-full max-w-xs mb-1 input-sm input input-bordered input-accent "
                  required
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder="Nama PBF/Perusahaan"
                />
              </div>

              <button type="submit" className="btn btn-info btn-sm">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex justify-center mt-3">
        <div className="shadow-xl card w-fit bg-amber-100">
          <div className="card-body">
            <div className="w-full max-w-xs mb-1 form-control">
              <label>PBF / Perusahaan : </label>
              <select
                className="w-full max-w-xs text-sm bg-green-300 select-bordered select-sm select"
                required
                value={pbfId}
                onChange={(e) => setPbfId(e.target.value)}
              >
                <option value="">Pilih Nama PBF / Perusahaan</option>
                {brands.map((t) => {
                  // console.log(t, "kosong");
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
                onChange={(e) => setFaktur(e.target.value)}
                value={faktur}
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
                onChange={(e) => setTgldatang(e.target.value)}
                value={tgldatang}
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
                value={namaobatId}
                onChange={(e) => setNamaObatId(e.target.value)}
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
                onChange={(e) => setType(e.target.value)}
                value={type}
                placeholder="Jenis Sediaan"
              />
            </div>

            <div className="w-full max-w-xs mb-1 form-control">
              <label>
                <span className="text-lg label-text">Harga Beli Grosir :</span>
              </label>
              <input
                className="w-full max-w-xs mb-1 input-sm input input-bordered input-accent "
                required
                type="number"
                onChange={(e) => setBuy(e.target.value)}
                value={buy}
                placeholder="Harga Beli Grosir"
              />
              <p>{formatToRupiah(buy)}</p>
            </div>

            <div className="w-full max-w-xs mb-1 form-control">
              <label>
                <span className="text-lg label-text">Hutang :</span>
              </label>
              <input
                className="w-full max-w-xs mb-1 input-sm input input-bordered input-accent "
                type="number"
                onChange={(e) => setLiability(e.target.value)}
                value={liability}
                placeholder="Harga Beli Grosir"
              />
              <p>{formatToRupiah(liability)}</p>
            </div>

            <div className="w-full max-w-xs mb-1 form-control">
              <label>
                <span className="text-lg label-text">Jumlah :</span>
              </label>
              <input
                className="w-full max-w-xs mb-1 input-sm input input-bordered input-accent "
                required
                type="number"
                onChange={(e) => setStok(e.target.value)}
                value={stok}
                placeholder="Jumlah Barang yang Diterima"
              />
              <select
                className="w-full max-w-xs select-bordered select-sm select"
                value={jenis}
                onChange={(e) => setJenis(e.target.value)}
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
                <span className="text-lg label-text">Jatuh Tempo :</span>
              </label>
              <input
                className="w-full max-w-xs mb-1 input-sm input input-bordered input-accent "
                type="date"
                onChange={(e) => setLiaDate(e.target.value)}
                value={liadate}
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
                onChange={(e) => setRemark(e.target.value)}
                value={remark}
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
                <input type="radio" name="my-accordion-18" checked="checked" />
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
                <input type="radio" name="my-accordion-18" checked="checked" />
                <div className="text-base font-bold collapse-title">
                  Manual Input
                </div>
                <div className="collapse-content">
                  <input
                    className="w-full max-w-xs mb-1 input-sm input input-bordered input-accent "
                    type="number"
                    onChange={(e) => setSell(e.target.value)}
                    value={sell}
                    placeholder="Ketik Langsung Harga Jual Grosir"
                  />
                </div>
              </div>
              <p className="mt-2 mb-2 font-bold">
                Harga Jual Grosir /item : &nbsp; {formatToRupiah(sell)}
              </p>
            </div> */}
            <hr style={{ border: "1px black solid" }} />

            <div className="w-full max-w-xs mb-1 form-control">
              <label>
                <span className="mb-2 text-lg font-bold label-text">
                  Harga Jual :
                </span>
              </label>
              <div className="mb-2 bg-green-300 collapse collapse-arrow">
                <input type="radio" name="my-accordion-15" defaultChecked />
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
                      value={satuanecer}
                      onChange={(e) => setStokSatuanEcer(e.target.value)}
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
                <input type="radio" name="my-accordion-15" defaultChecked />
                <div className="text-base font-bold collapse-title">
                  Manual Harga 1
                </div>
                <div className="collapse-content">
                  <input
                    className="w-full max-w-xs mb-1 input-sm input input-bordered input-accent "
                    type="number"
                    onChange={(e) => setEcer(e.target.value)}
                    value={ecer}
                    placeholder="Harga Eceran"
                  />
                </div>
              </div>
              <div className="bg-green-300 collapse collapse-arrow">
                <input type="radio" name="my-accordion-15" defaultChecked />
                <div className="text-base font-bold collapse-title">
                  Manual Harga 2
                </div>
                <div className="collapse-content">
                  <input
                    className="w-full max-w-xs mb-1 input-sm input input-bordered input-accent "
                    type="number"
                    onChange={(e) => setGrosir(e.target.value)}
                    value={grosir}
                    placeholder="Harga Grosir"
                  />
                </div>
              </div>
              <p className="mt-2 mb-2 font-bold">
                Harga Jual 1: {formatToRupiah(ecer)}
              </p>
              <p className="mt-2 mb-2 font-bold">
                Harga Jual 2: {formatToRupiah(grosir)}
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
                onChange={(e) => setDescription(e.target.value)}
                value={description}
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

      {tip && (
        <div className="fixed top-0">
          <div className="mx-5 chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <Image src="/profil.svg" alt="Profl" width={50} height={50} />
              </div>
            </div>
            <div className="chat-bubble">
              Item Berhasil Di Simpan! Semangat Bekerja!!
            </div>
          </div>
        </div>
      )}

      {tipError && (
        <div className="fixed top-0">
          <div className="mx-5 chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <Image src="/profil.svg" alt="Profl" width={50} height={50} />
              </div>
            </div>
            <div className="chat-bubble">
              Ada data yang belum terisi, tolong cek kembali !
            </div>
          </div>
        </div>
      )}
    </>
  );
}

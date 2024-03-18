import EditTopicForm from "../../../../components/Topic/EditTopicForm";

const getTopicById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3001/api/topics/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch topic");
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export default async function EditTopic({ params }) {
  const { id } = params;
  const { topic } = await getTopicById(id);
  const {
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
  } = topic;

  return (
    <div className="flex justify-center w-fit min-h-fit">
      <EditTopicForm
        id={id}
        pbf={pbf}
        faktur={faktur}
        type={type}
        buy={buy}
        sell={sell}
        description={description}
        user={user}
        stok={stok}
        ecer={ecer}
        tgldatang={tgldatang}
        liability={liability}
        liadate={liadate}
        remark={remark}
        jenis={jenis}
        namaobat={namaobat}
        merk={merk}
        stokecer={stokecer}
        satuanecer={satuanecer}
      />
    </div>
  );
}

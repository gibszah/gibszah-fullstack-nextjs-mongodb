export async function addToDatabase(data) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const res = await fetch("http://localhost:3000/api/topics", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log(res);
    if (res.ok) {
      console.log("Data successfully added to the database!");
    } else {
      throw new Error("Failed to create new data");
    }
  } catch (error) {
    console.log(error);
  }
}

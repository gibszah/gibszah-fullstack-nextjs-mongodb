const getTopics = async (searchQuery) => {
  try {
    const requestOptions = {
      method: "GET",
      // headers: {
      //   Authorization: `Bearer ${token}`, // Mengatur header Authorization dengan token bearer
      // },
      cache: "no-store",
    };
    const encodedSearchQuery = encodeURIComponent(searchQuery);

    const res = await fetch(
      `http://localhost:3001/api/topics/medicine/${encodedSearchQuery}`,
      requestOptions
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error loading topics: ", error);
    throw new Error("Failed to load topics");
  }
};

export { getTopics };

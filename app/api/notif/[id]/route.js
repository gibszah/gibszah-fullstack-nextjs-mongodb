import startDb from "@/lib/db";
import Topic from "@/models/topic";
import Notification from "@/models/notif";

startDb();

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  const { action } = query;

  switch (method) {
    case "GET":
      try {
        const notifications = await Notification.findById(id);
        res.status(200).json(notifications);
      } catch (error) {
        res.status(500).json({ message: "Error fetching notification" });
      }
      break;

    case "PUT":
      try {
        const notifications = await Notification.findById(id);
        const product = await Topic.findOne({ _id: id });

        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }

        if (action === "add") {
          notifications.count += 1;
          product.stok -= 1;
        } else if (action === "minus") {
          notifications.count -= 1;
          product.stok += 1;
        }

        await notifications.save();
        await product.save();
        res
          .status(200)
          .json({ message: "Notification updated and stock reduce" });
      } catch (error) {
        res.status(500).json({ message: "Error updating notif" });
      }

      break;

    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}

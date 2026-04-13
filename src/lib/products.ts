import clientPromise from "@/lib/mongodb";

const DB_NAME = process.env.MONGODB_DB_NAME || "dpp";
const COLLECTION_NAME = "products";

const slugToModel: Record<string, string> = {
  ur3e: "UR3e",
  "2f-140": "2F-140",
  "2f140": "2F-140",
};

export async function getProductsCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection(COLLECTION_NAME);
}

export async function getAllProducts() {
  const col = await getProductsCollection();
  return col.find({}).toArray();
}

export async function getProductBySlug(slug: string) {
  const col = await getProductsCollection();
  const wantedModel = slugToModel[slug.toLowerCase()] ?? slug;

  let product = await col.findOne({
    model: { $regex: `^${wantedModel}$`, $options: "i" },
  });

  if (!product) {
    product = await col.findOne({
      global_product_id: { $regex: slug, $options: "i" },
    });
  }

  return product;
}
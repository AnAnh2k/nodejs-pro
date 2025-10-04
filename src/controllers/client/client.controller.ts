import e, { Request, Response } from "express";
import { get } from "http";
import { getProductByID } from "services/client/item.service";

const getProductPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProductByID(+id);
  return res.render("client/product/detail", { product });
};

export { getProductPage };

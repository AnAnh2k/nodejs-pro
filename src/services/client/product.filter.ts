import { prisma } from "config/client";

const userFilter = async (usernameInput: string) => {
  return await prisma.user.findMany({
    where: {
      username: {
        contains: usernameInput,
      },
    },
  });
};

//yc 1
//http://localhost:8080/products?minPrice=5000000
const productFilterMin = async (minPrice: number) => {
  return await prisma.product.findMany({
    where: {
      price: {
        gte: minPrice,
      },
    },
  });
};
//yc 2 http://localhost:8080/products?maxPrice=20000000
const productFilterMax = async (minPrice: number) => {
  return await prisma.product.findMany({
    where: {
      price: {
        lte: minPrice,
      },
    },
  });
};

//yc 3 http://localhost:8080/products?factory=APPLE
const productFilterFactory = async (factory: string) => {
  return await prisma.product.findMany({
    where: {
      factory: {
        equals: factory,
      },
    },
  });
};

//yc 4 http://localhost:8080/products?factories=APPLE,DELL
const productFilterFactories = async (factories: string) => {
  const factorie = factories.split(","); // ['APPLE', 'DELL']
  return await prisma.product.findMany({
    where: {
      factory: {
        in: factorie,
      },
    },
  });
};

//yc5 http://localhost:8080/products?price=10-toi-20-trieu
const productFilterPricev1 = async (priceQuery: string) => {
  const parts = priceQuery.replace("-trieu", "").split("-toi-");
  const minPrice = parseInt(parts[0], 10) * 1000000;
  const maxPrice = parseInt(parts[1], 10) * 1000000;

  const products = await prisma.product.findMany({
    where: {
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
    },
  });

  return products;
};

//yc6 http://localhost:8080/products?price=10-toi-20-trieu,30-toi-40-trieu
const productFilterPricev2 = async (priceQuery: string) => {
  const priceRanges = priceQuery.split(",");

  const orConditions = priceRanges.map((rangeStr) => {
    const parts = rangeStr.replace("-trieu", "").split("-toi-");
    const minPrice = parseInt(parts[0], 10) * 1000000;
    const maxPrice = parseInt(parts[1], 10) * 1000000;

    return {
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
    };
  });

  const products = await prisma.product.findMany({
    where: {
      OR: orConditions,
    },
  });

  return products;
};

//yc7 http://localhost:8080/products?sort=price,asc

const productSortv1 = async (sortQuery: string) => {
  const [sortBy, sortOrder] = sortQuery.split(",");

  const products = await prisma.product.findMany({
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  return products;
};

export {
  userFilter,
  productFilterMin,
  productFilterMax,
  productFilterFactory,
  productFilterFactories,
  productFilterPricev1,
  productFilterPricev2,
  productSortv1,
};

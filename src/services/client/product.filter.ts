import { Product } from ".prisma/client";
import { prisma } from "config/client";
import { skip } from "node:test";

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

const getProductsWithFilter = async (
  page: number,
  pageSize: number,
  factory: string,
  target: string,
  price: string,
  sort: string
) => {
  //build where query
  let whereClause: any = {};

  if (factory) {
    const factoryInput = factory.split(",");
    whereClause.factory = {
      in: factoryInput,
    };
  }

  if (target) {
    const targetInput = target.split(",");
    whereClause.target = {
      in: targetInput,
    };
  }

  if (price) {
    const priceInput = price.split(",");
    ["duoi-10-trieu", "10-15-trieu", "15-20-trieu", "tren-20-triệu"];

    const priceCondition = [];
    for (let i = 0; i < priceInput.length; i++) {
      if (priceInput[i] === "duoi-10-trieu") {
        priceCondition.push({ price: { lt: 10000000 } });
      }
      if (priceInput[i] === "10-15-trieu") {
        priceCondition.push({ price: { gte: 10000000, lte: 15000000 } });
      }
      if (priceInput[i] === "15-20-trieu") {
        priceCondition.push({ price: { gte: 15000000, lte: 20000000 } });
      }
      if (priceInput[i] === "tren-20-trieu") {
        priceCondition.push({ price: { gt: 20000000 } });
      }
    }

    whereClause.OR = priceCondition;

    // whereClause = {
    // or:[{ price: { lt: 10000000 } },{ price: { gte: 10000000, lte: 15000000 } }]
    // }
  }

  // whereClause = {
  //   factory:{...},
  // target:{...}
  // }

  //build sort query
  let orderByClause: any = {};

  if (sort) {
    if (sort === "gia-tang-dan") {
      orderByClause = {
        price: "asc",
      };
    }
    if (sort === "gia-giam-dan") {
      orderByClause = {
        price: "desc",
      };
    }
  }

  const skip = (page - 1) * pageSize;
  const [products, count] = await prisma.$transaction([
    prisma.product.findMany({
      skip: skip,
      take: pageSize,
      where: whereClause,
      orderBy: orderByClause,
    }),
    prisma.product.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(count / pageSize);

  return { products, totalPages };
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
  getProductsWithFilter,
};

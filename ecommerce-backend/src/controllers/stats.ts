import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage } from "../utils/features.js";

export const getDashboardStats = TryCatch(async (req, res, next) => {
  let stats = {};

  if (myCache.has("admin-stats"))
    stats = JSON.parse(myCache.get("admin-stats"));
  else {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today,
    };

    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: new Date(today.getFullYear(), today.getMonth(), 0),
    };

    const thisMonthProductsPromise = Product.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthProductsPromise = Product.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const thisMonthUsersPromise = User.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthUsersPromise = User.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const thisMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });

    const lastMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });

    const lastSixMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    });

    const latestTransactionsPromise = Order.find({})
      .select(["orderItems", "discount", "total", "status"])
      .limit(4);

    const [
      thisMonthOrders,
      thisMonthProducts,
      thisMonthUsers,
      lastMonthOrders,
      lastMonthProducts,
      lastMonthUsers,
      productsCount,
      usersCount,
      allOrders,
      lastSixMonthOrders,
      categories,
      femaleUserCount,
      latestTransactions,
    ] = await Promise.all([
      thisMonthOrdersPromise,
      thisMonthProductsPromise,
      thisMonthUsersPromise,
      lastMonthOrdersPromise,
      lastMonthProductsPromise,
      lastMonthUsersPromise,
      Product.countDocuments(),
      User.countDocuments(),
      Order.find({}).select("total"),
      lastSixMonthOrdersPromise,
      Product.distinct("category"),
      User.countDocuments({ gender: "female" }),
      latestTransactionsPromise,
    ]);

    const thisMonthRevenue = thisMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );
    const lastMonthRevenue = lastMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const changePercent = {
      revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
      product: calculatePercentage(
        thisMonthProducts.length,
        lastMonthProducts.length
      ),
      order: calculatePercentage(
        thisMonthOrders.length,
        lastMonthOrders.length
      ),
      user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
    };

    const revenue = allOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const count = {
      revenue,
      product: productsCount,
      order: allOrders.length,
      user: usersCount,
    };

    const orderMonthsCounts = new Array(6).fill(0);
    const orderMonthlyRevenue = new Array(6).fill(0);

    lastSixMonthOrders.forEach((order) => {
      const creationDate = order.createdAt;
      const monthDiff = today.getMonth() - creationDate.getMonth();

      if (monthDiff < 6) {
        orderMonthsCounts[6 - monthDiff - 1] += 1;
        orderMonthlyRevenue[6 - monthDiff - 1] += order.total;
      }
    });

    const categoriesCountPromise = categories.map((category) =>
      Product.countDocuments({ category })
    );

    const categoriesCount = await Promise.all(categoriesCountPromise);

    const categoryCount: Record<string, number>[] = [];

    categories.forEach((category, i) => {
      categoryCount.push({
        [category]: Math.round((categoriesCount[i] / productsCount) * 100),
      });
    });

    const userRatio = {
      male: usersCount - femaleUserCount,
      female: femaleUserCount,
    };

    const modifiedTransactions = latestTransactions.map(i => ({
        _id: i._id,
        discount: i.discount,
        amount: i.total,
        quantity: i.orderItems.length,
        status: i.status,
    }))

    stats = {
      categoryCount,
      userRatio,
      changePercent,
      count,
      chart: {
        order: orderMonthsCounts,
        revenue: orderMonthlyRevenue,
      },
      latestTransactions: modifiedTransactions,
    };

    myCache.set("admin-stats", JSON.stringify(stats));
  }

  return res.status(200).json({
    success: true,
    stats,
  });
});

export const getPieCharts = TryCatch(async () => {});

export const getBarCharts = TryCatch(async () => {});

export const getLineCharts = TryCatch(async () => {});

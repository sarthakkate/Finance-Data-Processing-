const Record = require('../models/Record');


exports.getDashboardSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }

    // Build match stage for aggregation
    const matchStage = {
      userId: req.user._id,
    };

    if (Object.keys(dateFilter).length > 0) {
      matchStage.date = dateFilter;
    }

    // Aggregation pipeline
    const pipeline = [
      // Stage 1: Match records for current user
      { $match: matchStage },

      // Stage 2: Calculate totals by type
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ];

    const typeAggregation = await Record.aggregate(pipeline);

    // Calculate totals
    let totalIncome = 0;
    let totalExpense = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    typeAggregation.forEach((item) => {
      if (item._id === 'Income') {
        totalIncome = item.total;
        incomeCount = item.count;
      } else if (item._id === 'Expense') {
        totalExpense = item.total;
        expenseCount = item.count;
      }
    });

    // Stage 2: Category-wise breakdown
    const categoryPipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          type: { $first: '$type' },
        },
      },
      {
        $sort: { total: -1 },
      },
    ];

    const categoryBreakdown = await Record.aggregate(categoryPipeline);

    // Stage 3: Recent 5 transactions
    const recentRecords = await Record.find(matchStage)
      .sort({ date: -1 })
      .limit(5)
      .populate('userId', 'name email');

    // Prepare response
    const netBalance = totalIncome - totalExpense;

    res.status(200).json({
      success: true,
      summary: {
        totalIncome,
        totalExpense,
        netBalance,
        incomeCount,
        expenseCount,
        periodStart: startDate || 'All Time',
        periodEnd: endDate || 'All Time',
      },
      categoryBreakdown,
      recentTransactions: recentRecords,
    });
  } catch (error) {
    next(error);
  }
};


exports.getAdvancedAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }

    const matchStage = {
      userId: req.user._id,
    };

    if (Object.keys(dateFilter).length > 0) {
      matchStage.date = dateFilter;
    }

    // Monthly breakdown
    const monthlyBreakdown = await Record.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 },
      },
    ]);

    // Category and Type combination
    const categoryTypeBreakdown = await Record.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            category: '$category',
            type: '$type',
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    // Statistics
    const stats = await Record.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          avgIncome: {
            $avg: {
              $cond: [{ $eq: ['$type', 'Income'] }, '$amount', 0],
            },
          },
          maxIncome: {
            $max: {
              $cond: [{ $eq: ['$type', 'Income'] }, '$amount', 0],
            },
          },
          avgExpense: {
            $avg: {
              $cond: [{ $eq: ['$type', 'Expense'] }, '$amount', 0],
            },
          },
          maxExpense: {
            $max: {
              $cond: [{ $eq: ['$type', 'Expense'] }, '$amount', 0],
            },
          },
          totalTransactions: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      monthlyBreakdown,
      categoryTypeBreakdown,
      statistics: stats[0] || {
        avgIncome: 0,
        maxIncome: 0,
        avgExpense: 0,
        maxExpense: 0,
        totalTransactions: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.getAdminSummary = async (req, res, next) => {
  try {
    // Total records in system
    const totalRecords = await Record.countDocuments();

    // Total by type
    const typeStats = await Record.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Top 5 users by expense
    const topExpenseUsers = await Record.aggregate([
      { $match: { type: 'Expense' } },
      {
        $group: {
          _id: '$userId',
          totalExpense: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        $unwind: '$userInfo',
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          userName: '$userInfo.name',
          userEmail: '$userInfo.email',
          totalExpense: 1,
          count: 1,
        },
      },
      { $sort: { totalExpense: -1 } },
      { $limit: 5 },
    ]);

    // Most active category
    const activeCategories = await Record.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json({
      success: true,
      adminSummary: {
        totalRecords,
        typeStats,
        topExpenseUsers,
        activeCategories,
      },
    });
  } catch (error) {
    next(error);
  }
};

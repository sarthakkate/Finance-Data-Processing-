const Record = require('../models/Record');

/**
 * Build filter object from query parameters
 */
const buildFilter = (req) => {
  const filter = { userId: req.user._id };

  // Only Admins can view other users' records
  if (req.query.userId && req.user.role === 'Admin') {
    filter.userId = req.query.userId;
  }

  // Date range filtering
  if (req.query.startDate || req.query.endDate) {
    filter.date = {};
    if (req.query.startDate) {
      filter.date.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      filter.date.$lte = new Date(req.query.endDate);
    }
  }

  // Category filtering
  if (req.query.category) {
    filter.category = req.query.category;
  }

  // Type filtering
  if (req.query.type) {
    filter.type = req.query.type;
  }

  return filter;
};


exports.getRecords = async (req, res, next) => {
  try {
    const filter = buildFilter(req);

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Get total count
    const total = await Record.countDocuments(filter);

    // Get records
    const records = await Record.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: records.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      records,
    });
  } catch (error) {
    next(error);
  }
};


exports.getRecord = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    // Check if user owns the record or is Admin
    if (
      record.userId.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this record',
      });
    }

    res.status(200).json({
      success: true,
      record,
    });
  } catch (error) {
    next(error);
  }
};


exports.createRecord = async (req, res, next) => {
  try {
    const { amount, type, category, date, description } = req.body;

    const record = new Record({
      amount,
      type,
      category,
      date: date || new Date(),
      description,
      userId: req.user._id,
    });

    await record.save();

    // Populate user info
    await record.populate('userId', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Record created successfully',
      record,
    });
  } catch (error) {
    next(error);
  }
};


exports.updateRecord = async (req, res, next) => {
  try {
    let record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    // Check authorization
    if (
      record.userId.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this record',
      });
    }

    // Update fields (only allow specific fields)
    const { amount, type, category, date, description } = req.body;
    if (amount !== undefined) record.amount = amount;
    if (type !== undefined) record.type = type;
    if (category !== undefined) record.category = category;
    if (date !== undefined) record.date = date;
    if (description !== undefined) record.description = description;
    record.updatedAt = new Date();

    await record.save();

    await record.populate('userId', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Record updated successfully',
      record,
    });
  } catch (error) {
    next(error);
  }
};


exports.deleteRecord = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    // Only Admin can delete
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete records',
      });
    }

    await Record.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};


exports.getUserRecords = async (req, res, next) => {
  try {
    const filter = {
      userId: req.params.userId,
    };

    // Apply additional filters if provided
    if (req.query.category) filter.category = req.query.category;
    if (req.query.type) filter.type = req.query.type;

    const records = await Record.find(filter)
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      records,
    });
  } catch (error) {
    next(error);
  }
};

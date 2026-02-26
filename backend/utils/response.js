class ApiResponse {
  static success(res, data, message, status) {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  }

  static error(res, message, status) {
    return res.status(status).json({
      success: false,
      message,
      data: null,
    });
  }
}

module.exports = ApiResponse;

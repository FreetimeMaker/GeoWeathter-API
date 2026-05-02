const WeatherHistory = require('../models/WeatherHistory');
const Subscription = require('../models/Subscription');

const WeatherHistoryController = {
  async record(req, res) {
    try {
      const userId = req.user.userId;
      const { location, temperature, humidity, pressure, windSpeed, conditions, sensorData } = req.body;

      if (!location || temperature === undefined) {
        return res.status(400).json({ 
          message: 'Location and temperature required' 
        });
      }

      const weatherData = {
        temperature,
        humidity,
        pressure,
        windSpeed,
        conditions,
      };

      const history = await WeatherHistory.create(userId, location, weatherData, sensorData);

      res.status(201).json({
        message: 'Weather data recorded',
        history,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getHistory(req, res) {
    try {
      const userId = req.user.userId;
      const { startDate, endDate, location } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({ 
          message: 'Start and end date required' 
        });
      }

      let records = await WeatherHistory.findByUserIdAndDateRange(
        userId,
        new Date(startDate),
        new Date(endDate)
      );

      if (location) {
        records = records.filter(r => r.location === location);
      }

      res.status(200).json({
        message: 'Weather history retrieved',
        count: records.length,
        records,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getMonthlyAnalytics(req, res) {
    try {
      const userId = req.user.userId;
      const { location, year, month } = req.query;

      if (!location || !year || !month) {
        return res.status(400).json({ 
          message: 'Location, year and month required' 
        });
      }

      const analytics = await WeatherHistory.getMonthlyAverage(
        userId,
        location,
        parseInt(year),
        parseInt(month)
      );

      res.status(200).json({
        message: 'Monthly statistics retrieved',
        analytics,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getYearlyTrend(req, res) {
    try {
      const userId = req.user.userId;
      const { location, year } = req.query;

      if (!location || !year) {
        return res.status(400).json({ 
          message: 'Location and year required' 
        });
      }

      const trend = await WeatherHistory.getYearlyTrend(
        userId,
        location,
        parseInt(year)
      );

      res.status(200).json({
        message: 'Yearly trend retrieved',
        trend,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async exportData(req, res) {
    try {
      const userId = req.user.userId;

      // Check if user has export permission
      const hasAccess = await Subscription.checkFeatureAccess(userId, 'data_export');
      if (!hasAccess) {
        return res.status(403).json({ 
          message: 'Data export requires Freemium subscription' 
        });
      }

      const { startDate, endDate } = req.query;
      const records = await WeatherHistory.findByUserIdAndDateRange(
        userId,
        new Date(startDate),
        new Date(endDate)
      );

      // Export als CSV
      const csv = convertToCSV(records);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="weather_data.csv"');
      res.send(csv);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

function convertToCSV(records) {
  if (records.length === 0) return '';

  const headers = Object.keys(records[0]).join(',');
  const rows = records.map(record => 
    Object.values(record).map(val => 
      typeof val === 'string' ? `"${val}"` : val
    ).join(',')
  );

  return [headers, ...rows].join('\n');
}

module.exports = WeatherHistoryController;

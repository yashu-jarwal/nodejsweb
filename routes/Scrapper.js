const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

const URL = 'https://quotes.toscrape.com/';

/**
 * @swagger
 * /api/scrape:
 *   get:
 *     summary: Scrape quotes from quotes.toscrape.com
 *     description: Uses Cheerio to scrape quotes and authors from the website
 *     responses:
 *       200:
 *         description: Successfully scraped quotes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       quote:
 *                         type: string
 *                       author:
 *                         type: string
 *       500:
 *         description: Scraping failed due to server error
 */

router.get('/scrape', async (req, res) => {
  try {
    const { data } = await axios.get(URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);
    const quotes = [];

    $('.quote').each((i, el) => {
      const quote = $(el).find('.text').text().trim();
      const author = $(el).find('.author').text().trim();
      quotes.push({ id: i + 1, quote, author });
    });

    res.status(200).json({
      message: '✅ Scraping successful',
      total: quotes.length,
      data: quotes,
    });
  } catch (err) {
    res.status(500).json({
      message: '❌ Error scraping with Cheerio',
      error: err.message,
    });
  }
});


module.exports = router;

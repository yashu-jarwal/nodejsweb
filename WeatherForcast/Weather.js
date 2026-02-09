const express = require('express');
const router = express.Router();
const fs = require('fs').promises

let data = {
    "London": { "temperature": 15, "description": "broken clouds" },
    "Delhi": { "temperature": 33, "description": "clear sky" },
    "Tokyo": { "temperature": 22, "description": "light rain" }
}

/**
 * @swagger
 * /Weatherforcast:
 *   get:
 *     summary: get the weather forcast for city
 *     responses:
 *       200:
 *         description: City weather successfully fetch
 *       500:
 *         description: Error while fetching data
 */
router.get('/Weatherforcast', async (req, res) => {
    const { city } = req.params
    try {
        const city = await readfile('./WeatherForcast/City.txt');
        if (city.length === 0) return

        const fetchfile = city
            .map(fetchrepo)
            .filter(Boolean); // removes null entries
        console.log("fetchfile__", fetchfile);
        if (fetchfile.length > 0) res.status(200).send({ message: '✅ Data fetched and saved to output.json' });
        else res.status(200).send({ message: '✅ Data Not Found' });

        saveoutput(fetchfile)
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: '❌ Error fetching data' });
    }
})

function fetchrepo(city) {
    if (!data[city]) return null; // or return []
    return { city, ...data[city] };
}

async function readfile(filepath) {
    try {
        const RDfile = (await fs.readFile(filepath, 'utf-8')).split('\n').map((u) => u.trim()).filter(Boolean)
        return RDfile
    }
    catch (err) {
        console.error("file not read file");
        return []
    }
}

async function saveoutput(result) {
    try {
        await fs.writeFile('./WeatherForcast/Result.json', JSON.stringify(result , null,2))
    }
    catch (err) {
        console.error("file not write");
    }
}

module.exports = router

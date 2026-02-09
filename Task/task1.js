const express = require('express');
const router = express.Router();
const fs = require('fs').promises
const axios = require('axios')
const GITHUB_TOKEN = ""; // Add token here if needed
async function readusername(filepath) {

    try {
        const fetchdata = await fs.readFile(filepath, 'utf-8');
        return fetchdata
            .split('\n')            // split into lines
            .map(u => u.trim())     // remove extra spaces
            .filter(Boolean);       // remove empty lines
    }
    catch (err) {
        console.error("❌ Error reading file:", err.message);
        return [];
    }
}

async function fetchRepos(username) {
    try {
        const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
            headers: {
                'User-Agent': 'node.js',
                ...(GITHUB_TOKEN && { Authorization: `token ${GITHUB_TOKEN}` })
            }
        });
        return {
            username,
            repos: response.data.map(repo => ({
                name: repo.name,
                description: repo.description,
                stars: repo.stargazers_count,
                language: repo.language
            }))
        };
    } catch (err) {
        if (err.response && err.response.status === 404) {
            console.warn(`⚠️ User not found: ${username}`);
        } else {
            console.error(`❌ Error fetching repos for ${username}:`, err.message);
        }
        return { username, repos: [] };
    }
}

async function saveOutput(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        console.log(`✅ Data saved to ${filePath}`);
    } catch (err) {
        console.error("❌ Error writing file:", err.message);
    }
}
async function main() {
    const username = await readusername('./data.txt')

    if (username.length == 0) return;

    const result = await Promise.all(username.map(fetchRepos));
    await saveOutput('./output.json', result);
}

/**
 * @swagger
 * /writejson:
 *   get:
 *     summary: Run the GitHub fetch script and save JSON output
 *     responses:
 *       200:
 *         description: Data fetched and saved successfully
 *       500:
 *         description: Error while fetching data
 */

router.get('/writejson', async (req, res) => {
    try {
        await main(); // Calls your main() from earlier
        res.status(200).send({ message: '✅ Data fetched and saved to output.json' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: '❌ Error fetching data' });
    }
});

module.exports = router








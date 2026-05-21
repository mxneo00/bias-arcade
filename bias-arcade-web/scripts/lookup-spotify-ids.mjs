/**
 * Spotify Artist ID Lookup Script
 *
 * Searches Spotify for every group and member in the artist registry
 * and prints their Spotify IDs so you can paste them into artist-registry.ts.
 *
 * Prerequisites:
 *   Add SPOTIFY_CLIENT_SECRET to your .env.local
 *   (find it in https://developer.spotify.com/dashboard → your app)
 *
 * Usage:
 *   node scripts/lookup-spotify-ids.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Registry — keep in sync with artist-registry.ts
// ---------------------------------------------------------------------------
const registry = [
    { id: "2ne1",            label: "2NE1",              members: ["CL", "Minzy", "Park Bom", "Sandara Park"] },
    { id: "2pm",             label: "2PM",               members: ["Jun.K", "Nichkhun", "Taecyeon", "Wooyoung", "Junho", "Chansung"] },
    { id: "aespa",           label: "aespa",             members: ["Karina", "Giselle", "Winter", "Ningning"] },
    { id: "astro",           label: "ASTRO",             members: ["MJ", "JinJin", "Cha Eunwoo", "Moonbin", "Rocky", "Sanha"] },
    { id: "ateez",           label: "ATEEZ",             members: ["Hongjoong", "Seonghwa", "Yunho", "Yeosang", "San", "Mingi", "Wooyoung", "Jongho"] },
    { id: "bap",             label: "B.A.P",             members: ["Bang Yongguk", "Himchan", "Daehyun", "Youngjae", "Jongup", "Zelo"] },
    { id: "bigbang",         label: "BIGBANG",           members: ["G-Dragon", "T.O.P", "Taeyang", "Daesung"] },
    { id: "blackpink",       label: "BLACKPINK",         members: ["Jisoo", "Jennie", "Rosé", "Lisa"] },
    { id: "bts",             label: "BTS",               members: ["RM", "Jin", "Suga", "J-Hope", "Jimin", "V", "Jungkook"] },
    { id: "enhypen",         label: "ENHYPEN",           members: ["Jungwon", "Heeseung", "Jay", "Jake", "Sunghoon", "Sunoo", "Ni-ki"] },
    { id: "exo",             label: "EXO",               members: ["Xiumin", "Suho", "Lay", "Baekhyun", "Chen", "Chanyeol", "D.O.", "Kai", "Sehun"] },
    { id: "fx",              label: "f(x)",              members: ["Victoria", "Amber", "Luna", "Krystal"] },
    { id: "gidle",           label: "(G)I-DLE",          members: ["Soyeon", "Minnie", "Miyeon", "Yuqi", "Shuhua"] },
    { id: "girls-generation",label: "Girls Generation",  members: ["Taeyeon", "Sunny", "Tiffany", "Hyoyeon", "Yuri", "Sooyoung", "Yoona", "Seohyun"] },
    { id: "got7",            label: "GOT7",              members: ["Jay B", "Mark Tuan", "Jackson Wang", "Jinyoung", "Youngjae", "BamBam", "Yugyeom"] },
    { id: "highlight",       label: "Highlight",         members: ["Yoon Doojoon", "Yong Junhyung", "Yang Yoseob", "Lee Kikwang", "Son Dongwoon"] },
    { id: "infinite",        label: "Infinite kpop",     members: ["Sunggyu", "Dongwoo", "Woohyun", "Hoya", "Sungyeol", "L Myungsoo", "Sungjong"] },
    { id: "itzy",            label: "ITZY",              members: ["Yeji", "Lia", "Ryujin", "Chaeryeong", "Yuna"] },
    { id: "ive",             label: "IVE kpop",          members: ["Yujin", "Gaeul", "Rei", "Wonyoung", "Liz", "Leeseo"] },
    { id: "le-sserafim",     label: "LE SSERAFIM",       members: ["Sakura", "Chaewon", "Yunjin", "Kazuha", "Eunchae"] },
    { id: "mamamoo",         label: "MAMAMOO",           members: ["Solar", "Moonbyul", "Wheein", "Hwasa"] },
    { id: "monsta-x",        label: "MONSTA X",          members: ["Shownu", "Minhyuk", "Kihyun", "Hyungwon", "Joohoney", "I.M"] },
    { id: "nct-127",         label: "NCT 127",           members: ["Taeil", "Johnny", "Taeyong", "Yuta", "Doyoung", "Jaehyun", "Jungwoo", "Mark NCT", "Haechan"] },
    { id: "nct-dream",       label: "NCT Dream",         members: ["Mark NCT", "Renjun", "Jeno", "Haechan", "Jaemin", "Chenle", "Jisung NCT"] },
    { id: "nct-wish",        label: "NCT WISH",          members: ["Sion NCT", "Riku NCT", "Yushi NCT", "Sakuya NCT", "Jaehee NCT", "Shotaro NCT"] },
    { id: "newjeans",        label: "NewJeans",          members: ["Minji", "Hanni", "Danielle", "Haerin", "Hyein"] },
    { id: "red-velvet",      label: "Red Velvet",        members: ["Irene", "Seulgi", "Wendy", "Joy", "Yeri"] },
    { id: "seventeen",       label: "SEVENTEEN",         members: ["S.Coups", "Jeonghan", "Joshua", "Jun", "Hoshi", "Wonwoo", "Woozi", "DK", "Mingyu", "The8", "Seungkwan", "Vernon", "Dino"] },
    { id: "shinee",          label: "SHINee",            members: ["Onew", "Key", "Jonghyun", "Minho", "Taemin"] },
    { id: "stray-kids",      label: "Stray Kids",        members: ["Bang Chan", "Lee Know", "Changbin", "Hyunjin", "Han Jisung", "Felix", "Seungmin", "I.N"] },
    { id: "super-junior",    label: "Super Junior",      members: ["Leeteuk", "Heechul", "Yesung", "Shindong", "Sungmin", "Eunhyuk", "Donghae", "Siwon", "Ryeowook", "Kibum", "Kyuhyun"] },
    { id: "txt",             label: "TXT kpop",          members: ["Yeonjun", "Soobin", "Beomgyu", "Taehyun", "Huening Kai"] },
    { id: "twice",           label: "TWICE",             members: ["Nayeon", "Jeongyeon", "Momo", "Sana", "Jihyo", "Mina", "Dahyun", "Chaeyoung", "Tzuyu"] },
    { id: "vixx",            label: "VIXX",              members: ["N VIXX", "Leo VIXX", "Ken VIXX", "Ravi VIXX", "Hongbin VIXX", "Hyuk VIXX"] },
    { id: "wayv",            label: "WayV",              members: ["Kun", "Ten", "WinWin", "Lucas", "Xiaojun", "Hendery", "Yangyang"] },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function parseEnvFile(filePath) {
    const vars = {};
    if (!fs.existsSync(filePath)) return vars;
    for (const line of fs.readFileSync(filePath, "utf-8").split(/\r?\n/)) {
        const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
        if (match) vars[match[1]] = match[2].replace(/^["']|["']$/g, "").trim();
    }
    return vars;
}

async function getAccessToken(clientId, clientSecret) {
    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        },
        body: "grant_type=client_credentials",
    });
    if (!res.ok) throw new Error(`Token request failed: ${res.status} ${res.statusText}`);
    const data = await res.json();
    return data.access_token;
}

async function searchArtist(token, query, retries = 2) {
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=3`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

    if (res.status === 429) {
        const retryAfter = parseInt(res.headers.get("Retry-After") ?? "2", 10);
        console.warn(`  Rate limited — waiting ${retryAfter}s…`);
        await sleep((retryAfter + 1) * 1000);
        if (retries > 0) return searchArtist(token, query, retries - 1);
        return [];
    }

    if (!res.ok) return [];
    const data = await res.json();
    return data.artists?.items ?? [];
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function fmt(artist) {
    return `${artist.name} (${(artist.followers?.total ?? 0).toLocaleString()} followers)  →  "${artist.id}"`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
    const envPath = path.join(__dirname, "../.env.local");
    const env = parseEnvFile(envPath);

    const clientId = env.SPOTIFY_CLIENT_ID;
    const clientSecret = env.SPOTIFY_CLIENT_SECRET;

    if (!clientId) {
        console.error("❌  SPOTIFY_CLIENT_ID not found in .env.local");
        process.exit(1);
    }
    if (!clientSecret) {
        console.error("❌  SPOTIFY_CLIENT_SECRET not found in .env.local");
        console.error("    Add it from: https://developer.spotify.com/dashboard → your app → Settings");
        process.exit(1);
    }

    console.log("🔑  Getting Spotify access token…\n");
    const token = await getAccessToken(clientId, clientSecret);

    for (const group of registry) {
        console.log(`\n${"─".repeat(60)}`);
        console.log(`📀  ${group.label}  (id: "${group.id}")`);

        // Group-level search
        const groupHits = await searchArtist(token, group.label);
        if (groupHits.length > 0) {
            console.log(`  GROUP:  ${fmt(groupHits[0])}`);
            for (const alt of groupHits.slice(1)) {
                console.log(`          alt: ${fmt(alt)}`);
            }
        } else {
            console.log(`  GROUP:  ⚠️  no results`);
        }
        await sleep(150);

        // Member-level search
        for (const member of group.members) {
            const hits = await searchArtist(token, `${member} ${group.label}`);
            if (hits.length > 0) {
                console.log(`  ${member.padEnd(20)}  ${fmt(hits[0])}`);
                for (const alt of hits.slice(1)) {
                    console.log(`  ${"".padEnd(20)}  alt: ${fmt(alt)}`);
                }
            } else {
                console.log(`  ${member.padEnd(20)}  ⚠️  no results`);
            }
            await sleep(150);
        }
    }

    console.log(`\n${"─".repeat(60)}`);
    console.log("✅  Done! Verify the results above, then paste the IDs into artist-registry.ts");
}

main().catch((err) => {
    console.error("Fatal error:", err.message);
    process.exit(1);
});

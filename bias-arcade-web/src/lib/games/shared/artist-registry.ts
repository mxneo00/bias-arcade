type ArtistRegistry = {
    id: string;
    spotifyArtistId: string;
    label: string;
    type: "solo" | "group";
    memberSpotifyArtistIds: string[] | null;
    subunits?: string[] | null;
    family?: string | null;
    aliases?: string[] | null;
};

export const artistRegistry: ArtistRegistry[] = [

    // #region 2NE1
    // ─── 2NE1 ─────────────────────────────────────────────────────────────────
    {
        id: "2ne1",
        spotifyArtistId: "1l0mKo96Jh9HVYONcRl3Yp",
        label: "2NE1",
        type: "group",
        memberSpotifyArtistIds: [
            "0tzSBCPJZmHTdOA3ZV2mN3", // CL
            "1ql28OzmgulHG2ldXFrbWp", // Minzy
            "3uHb6dRazmcaT15bMexUtt", // Park Bom
            "3LKVw6XQYcot0OZMFmf4IP", // Sandara Park
        ],
    },
    // 2NE1 — members
    { id: "2ne1-cl",           spotifyArtistId: "0tzSBCPJZmHTdOA3ZV2mN3", label: "CL",           type: "solo", memberSpotifyArtistIds: null, family: "2ne1" },
    { id: "2ne1-minzy",        spotifyArtistId: "1ql28OzmgulHG2ldXFrbWp", label: "Minzy",        type: "solo", memberSpotifyArtistIds: null, family: "2ne1" },
    { id: "2ne1-park-bom",     spotifyArtistId: "3uHb6dRazmcaT15bMexUtt", label: "Park Bom",     type: "solo", memberSpotifyArtistIds: null, family: "2ne1" },
    { id: "2ne1-sandara-park", spotifyArtistId: "3LKVw6XQYcot0OZMFmf4IP", label: "Sandara Park", type: "solo", memberSpotifyArtistIds: null, family: "2ne1" },

    // #endregion
    // #region 2PM
    // ─── 2PM ──────────────────────────────────────────────────────────────────
    {
        id: "2pm",
        spotifyArtistId: "5iRPbkcPmqAFFwDUj6ywVS",
        label: "2PM",
        type: "group",
        memberSpotifyArtistIds: [
            "4m69UKabjuuaoayREZud9h", // Jun.K
            "3z8kQKCYy5W82nZjl3ydEh", // Nichkhun
            "75du5QRTY4IyBl3YcH2gSn", // Taecyeon
            "16iaWzk4PHL4GCjzyT6zZn", // Wooyoung
            "1nEFr6pWrot80eRuOkZQxg", // Junho
            "0Xysc1acrmF3w8vMvmSUPW", // Chansung
        ],
    },
    // 2PM — members
    { id: "2pm-junk",     spotifyArtistId: "4m69UKabjuuaoayREZud9h", label: "Jun.K",    type: "solo", memberSpotifyArtistIds: null, family: "2pm" },
    { id: "2pm-nichkhun", spotifyArtistId: "3z8kQKCYy5W82nZjl3ydEh", label: "Nichkhun", type: "solo", memberSpotifyArtistIds: null, family: "2pm" },
    { id: "2pm-taecyeon", spotifyArtistId: "75du5QRTY4IyBl3YcH2gSn", label: "Taecyeon", type: "solo", memberSpotifyArtistIds: null, family: "2pm" },
    { id: "2pm-wooyoung", spotifyArtistId: "16iaWzk4PHL4GCjzyT6zZn", label: "Wooyoung", type: "solo", memberSpotifyArtistIds: null, family: "2pm" },
    { id: "2pm-junho",    spotifyArtistId: "1nEFr6pWrot80eRuOkZQxg", label: "Junho",    type: "solo", memberSpotifyArtistIds: null, family: "2pm" },
    { id: "2pm-chansung", spotifyArtistId: "0Xysc1acrmF3w8vMvmSUPW", label: "Chansung", type: "solo", memberSpotifyArtistIds: null, family: "2pm" },

    // #endregion
    // #region aespa
    // ─── aespa ────────────────────────────────────────────────────────────────
    {
        id: "aespa",
        spotifyArtistId: "6YVMFz59CuY7ngCxTxjpxE",
        label: "aespa",
        type: "group",
        memberSpotifyArtistIds: [
            "2qwDjeSYANOOBFU8jwtBXx", // Karina
            "2P1id80CMwR5R5cwcyIIAi", // Giselle
            "3mPquBmMu97Iq9TpzQ6ayI", // Winter
            "5t1uryofgueHrjrryqX8vM", // Ningning
        ],
    },
    // aespa — members
    { id: "aespa-karina",   spotifyArtistId: "2qwDjeSYANOOBFU8jwtBXx", label: "Karina",   type: "solo", memberSpotifyArtistIds: null, family: "aespa" },
    { id: "aespa-giselle",  spotifyArtistId: "2P1id80CMwR5R5cwcyIIAi", label: "Giselle",  type: "solo", memberSpotifyArtistIds: null, family: "aespa" },
    { id: "aespa-winter",   spotifyArtistId: "3mPquBmMu97Iq9TpzQ6ayI", label: "Winter",   type: "solo", memberSpotifyArtistIds: null, family: "aespa" },
    { id: "aespa-ningning", spotifyArtistId: "5t1uryofgueHrjrryqX8vM", label: "Ningning", type: "solo", memberSpotifyArtistIds: null, family: "aespa" },

    // #endregion
    // #region ASTRO
    // ─── ASTRO ────────────────────────────────────────────────────────────────
    {
        id: "astro",
        spotifyArtistId: "4pz4uzOMpJQyV8UTsDy4H8",
        label: "ASTRO",
        type: "group",
        memberSpotifyArtistIds: [
            "1LHYoqa8tahdIWTUvxb17Y", // MJ
            "3U8ZnKIeY7sgQkIHjQDlHA", // JinJin
            "76ea6HHCvHlTqhF9I0jtHU", // Cha Eunwoo
            "0jCMdzb0fm0sOWIcALSlWU", // Moonbin
            "3bQABAi10Xqg1WsMAhYdBZ", // Rocky
            "6zLERXpqnnXhEnhva48jKW", // Sanha
        ],
    },
    // ASTRO — members
    { id: "astro-mj",         spotifyArtistId: "1LHYoqa8tahdIWTUvxb17Y", label: "MJ",         type: "solo", memberSpotifyArtistIds: null, family: "astro" },
    { id: "astro-jinjin",     spotifyArtistId: "3U8ZnKIeY7sgQkIHjQDlHA", label: "JinJin",     type: "solo", memberSpotifyArtistIds: null, family: "astro" },
    { id: "astro-cha-eunwoo", spotifyArtistId: "76ea6HHCvHlTqhF9I0jtHU", label: "Cha Eunwoo", type: "solo", memberSpotifyArtistIds: null, family: "astro" },
    { id: "astro-moonbin",    spotifyArtistId: "0jCMdzb0fm0sOWIcALSlWU", label: "Moonbin",    type: "solo", memberSpotifyArtistIds: null, family: "astro" },
    { id: "astro-rocky",      spotifyArtistId: "3bQABAi10Xqg1WsMAhYdBZ", label: "Rocky",      type: "solo", memberSpotifyArtistIds: null, family: "astro" },
    { id: "astro-sanha",      spotifyArtistId: "6zLERXpqnnXhEnhva48jKW", label: "Sanha",      type: "solo", memberSpotifyArtistIds: null, family: "astro" },

    // #endregion
    // #region ATEEZ
    // ─── ATEEZ ────────────────────────────────────────────────────────────────
    {
        id: "ateez",
        spotifyArtistId: "68KmkJeZGfwe1OUaivBa2L",
        label: "ATEEZ",
        type: "group",
        memberSpotifyArtistIds: [
            "3MZLSgcd5kOdhrZasDMecx", // Hongjoong
            "3TkRPyC9kz1wSRIkzUfVgL", // Seonghwa
            "0rFEZFoYNIa37Ad40mCuDq", // Yunho
            "3ZHodgUsqkIUsek6ke65bO", // Mingi
            "5in2h2c2DWNHKzgZo9OnVO", // Wooyoung
            "5gecqU5FZgxVdz1AtLumT0", // Jongho
        ],
    },
    // ATEEZ — members (confirmed; Yeosang and San N/A)
    { id: "ateez-hongjoong", spotifyArtistId: "3MZLSgcd5kOdhrZasDMecx", label: "Hongjoong", type: "solo", memberSpotifyArtistIds: null, family: "ateez" },
    { id: "ateez-seonghwa",  spotifyArtistId: "3TkRPyC9kz1wSRIkzUfVgL", label: "Seonghwa",  type: "solo", memberSpotifyArtistIds: null, family: "ateez" },
    { id: "ateez-yunho",     spotifyArtistId: "0rFEZFoYNIa37Ad40mCuDq", label: "Yunho",     type: "solo", memberSpotifyArtistIds: null, family: "ateez" },
    { id: "ateez-mingi",     spotifyArtistId: "3ZHodgUsqkIUsek6ke65bO", label: "Mingi",     type: "solo", memberSpotifyArtistIds: null, family: "ateez" },
    { id: "ateez-wooyoung",  spotifyArtistId: "5in2h2c2DWNHKzgZo9OnVO", label: "Wooyoung",  type: "solo", memberSpotifyArtistIds: null, family: "ateez" },
    { id: "ateez-jongho",    spotifyArtistId: "5gecqU5FZgxVdz1AtLumT0", label: "Jongho",    type: "solo", memberSpotifyArtistIds: null, family: "ateez" },

    // #endregion
    // #region B.A.P
    // ─── B.A.P ────────────────────────────────────────────────────────────────
    {
        id: "bap",
        spotifyArtistId: "6kxCoNfY6U1eP0Yc88phvk",
        label: "B.A.P",
        type: "group",
        memberSpotifyArtistIds: [
            "6g6zaR4B3WDZXphDRmsVGF", // Bang Yongguk
            "2KHnP93IOzti9W9wFZXteU", // Himchan
            "17LUHykIKujFPpkdbyq1E1", // Daehyun
            "6yxXsPXcgTJjBRelX9NCiF", // Youngjae
            "5Pvxbh8QweK3Gm4NS0e2KD", // Jongup
            "2N5L6zU0bi3q8AdJpNW1z3", // Zelo
        ],
    },
    // B.A.P — members
    { id: "bap-bang-yongguk", spotifyArtistId: "6g6zaR4B3WDZXphDRmsVGF", label: "Bang Yongguk", type: "solo", memberSpotifyArtistIds: null, family: "bap" },
    { id: "bap-himchan",      spotifyArtistId: "2KHnP93IOzti9W9wFZXteU", label: "Himchan",      type: "solo", memberSpotifyArtistIds: null, family: "bap" },
    { id: "bap-daehyun",      spotifyArtistId: "17LUHykIKujFPpkdbyq1E1", label: "Daehyun",      type: "solo", memberSpotifyArtistIds: null, family: "bap" },
    { id: "bap-youngjae",     spotifyArtistId: "6yxXsPXcgTJjBRelX9NCiF", label: "Youngjae",     type: "solo", memberSpotifyArtistIds: null, family: "bap" },
    { id: "bap-jongup",       spotifyArtistId: "5Pvxbh8QweK3Gm4NS0e2KD", label: "Jongup",       type: "solo", memberSpotifyArtistIds: null, family: "bap" },
    { id: "bap-zelo",         spotifyArtistId: "2N5L6zU0bi3q8AdJpNW1z3", label: "Zelo",         type: "solo", memberSpotifyArtistIds: null, family: "bap" },

    // #endregion
    // #region BIGBANG
    // ─── BIGBANG ──────────────────────────────────────────────────────────────
    {
        id: "bigbang",
        spotifyArtistId: "4Kxlr1PRlDKEB0ekOCyHgX",
        label: "BIGBANG",
        type: "group",
        memberSpotifyArtistIds: [
            "30b9WulBM8sFuBo17nNq9c", // G-Dragon
            "4yiB30K5scGkjmAgHGIH8Y", // T.O.P
            "6udveWUgX4vu75FF0DTrXV", // Taeyang
            "1OQxmfKN9UG5C7nr4MkasO", // Daesung
        ],
    },
    // BIGBANG — members
    { id: "bigbang-gdragon", spotifyArtistId: "30b9WulBM8sFuBo17nNq9c", label: "G-Dragon", type: "solo", memberSpotifyArtistIds: null, family: "bigbang" },
    { id: "bigbang-top",     spotifyArtistId: "4yiB30K5scGkjmAgHGIH8Y", label: "T.O.P",    type: "solo", memberSpotifyArtistIds: null, family: "bigbang" },
    { id: "bigbang-taeyang", spotifyArtistId: "6udveWUgX4vu75FF0DTrXV", label: "Taeyang",  type: "solo", memberSpotifyArtistIds: null, family: "bigbang" },
    { id: "bigbang-daesung", spotifyArtistId: "1OQxmfKN9UG5C7nr4MkasO", label: "Daesung",  type: "solo", memberSpotifyArtistIds: null, family: "bigbang" },

    // #endregion
    // #region BLACKPINK
    // ─── BLACKPINK ────────────────────────────────────────────────────────────
    {
        id: "blackpink",
        spotifyArtistId: "41MozSoPIsD1dJM0CLPjZF",
        label: "BLACKPINK",
        type: "group",
        memberSpotifyArtistIds: [
            "6UZ0ba50XreR4TM8u322gs", // Jisoo
            "250b0Wlc5Vk0CoUsaCY84M", // Jennie
            "3eVa5w3URK5duf6eyVDbu9", // Rosé
            "5L1lO4eRHmJ7a0Q6csE5cT", // Lisa
        ],
    },
    // BLACKPINK — members
    { id: "blackpink-jisoo",  spotifyArtistId: "6UZ0ba50XreR4TM8u322gs", label: "Jisoo",  type: "solo", memberSpotifyArtistIds: null, family: "blackpink" },
    { id: "blackpink-jennie", spotifyArtistId: "250b0Wlc5Vk0CoUsaCY84M", label: "Jennie", type: "solo", memberSpotifyArtistIds: null, family: "blackpink" },
    { id: "blackpink-rose",   spotifyArtistId: "3eVa5w3URK5duf6eyVDbu9", label: "Rosé",   type: "solo", memberSpotifyArtistIds: null, family: "blackpink" },
    { id: "blackpink-lisa",   spotifyArtistId: "5L1lO4eRHmJ7a0Q6csE5cT", label: "Lisa",   type: "solo", memberSpotifyArtistIds: null, family: "blackpink" },

    // #endregion
    // #region BTS
    // ─── BTS ──────────────────────────────────────────────────────────────────
    {
        id: "bts",
        spotifyArtistId: "3Nrfpe0tUJi4K4DXYWgMUX",
        label: "BTS",
        type: "group",
        memberSpotifyArtistIds: [
            "2auC28zjQyVTsiZKNgPRGs", // RM
            "5vV3bFXnN6D6N3Nj4xRvaV", // Jin
            "0ebNdVaOfp6N0oZ1guIxM8", // Suga
            "0b1sIQumIAsNbqAoIClSpy", // J-Hope
            "1oSPZhvZMIrWW5I41kPkkY", // Jimin
            "3JsHnjpbhX4SnySpvpa9DK", // V
            "6HaGTQPmzraVmaVxvz6EUc", // Jungkook
        ],
    },
    // BTS — members
    { id: "bts-rm",       spotifyArtistId: "2auC28zjQyVTsiZKNgPRGs", label: "RM",       type: "solo", memberSpotifyArtistIds: null, family: "bts" },
    { id: "bts-jin",      spotifyArtistId: "5vV3bFXnN6D6N3Nj4xRvaV", label: "Jin",      type: "solo", memberSpotifyArtistIds: null, family: "bts" },
    { id: "bts-suga",     spotifyArtistId: "0ebNdVaOfp6N0oZ1guIxM8", label: "Suga",     type: "solo", memberSpotifyArtistIds: null, family: "bts" },
    { id: "bts-jhope",    spotifyArtistId: "0b1sIQumIAsNbqAoIClSpy", label: "J-Hope",   type: "solo", memberSpotifyArtistIds: null, family: "bts" },
    { id: "bts-jimin",    spotifyArtistId: "1oSPZhvZMIrWW5I41kPkkY", label: "Jimin",    type: "solo", memberSpotifyArtistIds: null, family: "bts" },
    { id: "bts-v",        spotifyArtistId: "3JsHnjpbhX4SnySpvpa9DK", label: "V",        type: "solo", memberSpotifyArtistIds: null, family: "bts" },
    { id: "bts-jungkook", spotifyArtistId: "6HaGTQPmzraVmaVxvz6EUc", label: "Jungkook", type: "solo", memberSpotifyArtistIds: null, family: "bts" },

    // #endregion
    // #region ENHYPEN
    // ─── ENHYPEN ──────────────────────────────────────────────────────────────
    {
        id: "enhypen",
        spotifyArtistId: "5t5FqBwTcgKTaWmfEbwQY9",
        label: "ENHYPEN",
        type: "group",
        memberSpotifyArtistIds: [
            "6dNavn0Wr11k0fRVlbEi3D", // Heeseung
            "1dxyDekkPqYVKpC7iW71zJ", // Jay
        ],
    },
    // ENHYPEN — members (confirmed; Jungwon, Jake, Sunghoon, Sunoo, Ni-ki N/A)
    { id: "enhypen-heeseung", spotifyArtistId: "6dNavn0Wr11k0fRVlbEi3D", label: "Heeseung", type: "solo", memberSpotifyArtistIds: null, family: "enhypen" },
    { id: "enhypen-jay",      spotifyArtistId: "1dxyDekkPqYVKpC7iW71zJ", label: "Jay",      type: "solo", memberSpotifyArtistIds: null, family: "enhypen" },

    // #endregion
    // #region EXO
    // ─── EXO ──────────────────────────────────────────────────────────────────
    {
        id: "exo",
        spotifyArtistId: "3cjEqqelV9zb4BYE3qDQ4O",
        label: "EXO",
        type: "group",
        memberSpotifyArtistIds: [
            "5t0Js3X9t4wpgXGlaiTFe6", // Xiumin
            "5zkf2Na8DKKJmtWX5Xrx3m", // Suho
            "4o7tWrzQOqarDtTMWD2HV9", // Lay
            "4ufh0WuMZh6y4Dmdnklvdl", // Baekhyun
            "0UEP2XBR9aC5NBKcAKnBIq", // Chen
            "6jV25rzTKQ2zMgrqHha1V5", // Chanyeol
            "2CQZr2RPZmrcvDnaod1ldC", // D.O.
            "6iVo62B0bdTknRcrktCmak", // Kai
        ],
    },
    // EXO — members (confirmed; Sehun N/A)
    { id: "exo-xiumin",   spotifyArtistId: "5t0Js3X9t4wpgXGlaiTFe6", label: "Xiumin",   type: "solo", memberSpotifyArtistIds: null, family: "exo" },
    { id: "exo-suho",     spotifyArtistId: "5zkf2Na8DKKJmtWX5Xrx3m", label: "Suho",     type: "solo", memberSpotifyArtistIds: null, family: "exo" },
    { id: "exo-lay",      spotifyArtistId: "4o7tWrzQOqarDtTMWD2HV9", label: "Lay",      type: "solo", memberSpotifyArtistIds: null, family: "exo" },
    { id: "exo-baekhyun", spotifyArtistId: "4ufh0WuMZh6y4Dmdnklvdl", label: "Baekhyun", type: "solo", memberSpotifyArtistIds: null, family: "exo" },
    { id: "exo-chen",     spotifyArtistId: "0UEP2XBR9aC5NBKcAKnBIq", label: "Chen",     type: "solo", memberSpotifyArtistIds: null, family: "exo" },
    { id: "exo-chanyeol", spotifyArtistId: "6jV25rzTKQ2zMgrqHha1V5", label: "Chanyeol", type: "solo", memberSpotifyArtistIds: null, family: "exo" },
    { id: "exo-do",       spotifyArtistId: "2CQZr2RPZmrcvDnaod1ldC", label: "D.O.",     type: "solo", memberSpotifyArtistIds: null, family: "exo" },
    { id: "exo-kai",      spotifyArtistId: "6iVo62B0bdTknRcrktCmak", label: "Kai",      type: "solo", memberSpotifyArtistIds: null, family: "exo" },

    // #endregion
    // #region f(x)
    // ─── f(x) ─────────────────────────────────────────────────────────────────
    {
        id: "fx",
        spotifyArtistId: "3wRA5UYoo08BBKJnzyKkpF",
        label: "f(x)",
        type: "group",
        memberSpotifyArtistIds: [
            "56HZvtrzD82YKMGGJTlIG2", // Luna
            "3qYt5zzf9B414wKsDhrtaO", // Krystal
        ],
    },
    // f(x) — members (confirmed; Victoria, Amber N/A)
    { id: "fx-luna",    spotifyArtistId: "56HZvtrzD82YKMGGJTlIG2", label: "Luna",    type: "solo", memberSpotifyArtistIds: null, family: "fx" },
    { id: "fx-krystal", spotifyArtistId: "3qYt5zzf9B414wKsDhrtaO", label: "Krystal", type: "solo", memberSpotifyArtistIds: null, family: "fx" },

    // #endregion
    // #region (G)I-DLE
    // ─── (G)I-DLE ─────────────────────────────────────────────────────────────
    {
        id: "gidle",
        spotifyArtistId: "2AfmfGFbe0A0WsTYm0SDTx",
        label: "(G)I-DLE",
        type: "group",
        memberSpotifyArtistIds: [
            "6Xg22wJOAcnvPUfk5WvODH", // Soyeon
            "2pHkxVNynHBwQHhGaoBIXX", // Minnie
            "22aCD8IrQZjcPgZw728QT6", // Yuqi
        ],
    },
    // (G)I-DLE — members (confirmed; Miyeon, Shuhua N/A)
    { id: "gidle-soyeon", spotifyArtistId: "6Xg22wJOAcnvPUfk5WvODH", label: "Soyeon", type: "solo", memberSpotifyArtistIds: null, family: "gidle" },
    { id: "gidle-minnie", spotifyArtistId: "2pHkxVNynHBwQHhGaoBIXX", label: "Minnie", type: "solo", memberSpotifyArtistIds: null, family: "gidle" },
    { id: "gidle-yuqi",   spotifyArtistId: "22aCD8IrQZjcPgZw728QT6", label: "Yuqi",   type: "solo", memberSpotifyArtistIds: null, family: "gidle" },

    // #endregion
    // #region Girls' Generation
    // ─── Girls' Generation ────────────────────────────────────────────────────
    {
        id: "girls-generation",
        spotifyArtistId: "0Sadg1vgvaPqGTOjxu0N6c",
        label: "Girls' Generation",
        type: "group",
        memberSpotifyArtistIds: [
            "3qNVuliS40BLgXGxhdBdqu", // Taeyeon
            "2tYCDP6T15g9q19vIlh7vV", // Sunny
            "4C3uGP8vRDzxrhJxZiOjTe", // Tiffany
            "2TMRvcwsmvVhvuEbKVEbZe", // Yuri
            "5uM1Et50auro2hTS6ZLcmT", // Seohyun
        ],
    },
    // Girls' Generation — members (confirmed; Hyoyeon, Sooyoung, Yoona N/A)
    { id: "girls-generation-taeyeon", spotifyArtistId: "3qNVuliS40BLgXGxhdBdqu", label: "Taeyeon", type: "solo", memberSpotifyArtistIds: null, family: "girls-generation" },
    { id: "girls-generation-sunny",   spotifyArtistId: "2tYCDP6T15g9q19vIlh7vV", label: "Sunny",   type: "solo", memberSpotifyArtistIds: null, family: "girls-generation" },
    { id: "girls-generation-tiffany", spotifyArtistId: "4C3uGP8vRDzxrhJxZiOjTe", label: "Tiffany", type: "solo", memberSpotifyArtistIds: null, family: "girls-generation" },
    { id: "girls-generation-yuri",    spotifyArtistId: "2TMRvcwsmvVhvuEbKVEbZe", label: "Yuri",    type: "solo", memberSpotifyArtistIds: null, family: "girls-generation" },
    { id: "girls-generation-seohyun", spotifyArtistId: "5uM1Et50auro2hTS6ZLcmT", label: "Seohyun", type: "solo", memberSpotifyArtistIds: null, family: "girls-generation" },

    // #endregion
    // #region GOT7
    // ─── GOT7 ─────────────────────────────────────────────────────────────────
    {
        id: "got7",
        spotifyArtistId: "6nfDaffa50mKtEOwR8g4df",
        label: "GOT7",
        type: "group",
        memberSpotifyArtistIds: [
            "3IjHX8KZKoeq3X4QgXxqbT", // Jay B
            "4l1q0z9xeJcJw73Gxc6gCB", // Mark
            "1kfWoWgCugPkyxQP8lkRlY", // Jackson
            "0cA67OQaC4zDkxvGmWqKu7", // Jinyoung
            "5qUAtC3NwSLYme4JqjlGfQ", // Youngjae
            "0AwW3qkHckg8Dx51aSy6hy", // BamBam
            "3ohXmy1PGdB3XgzhPqQ0tY", // Yugyeom
        ],
    },
    // GOT7 — members
    { id: "got7-jay-b",    spotifyArtistId: "3IjHX8KZKoeq3X4QgXxqbT", label: "Jay B",    type: "solo", memberSpotifyArtistIds: null, family: "got7" },
    { id: "got7-mark",     spotifyArtistId: "4l1q0z9xeJcJw73Gxc6gCB", label: "Mark",     type: "solo", memberSpotifyArtistIds: null, family: "got7" },
    { id: "got7-jackson",  spotifyArtistId: "1kfWoWgCugPkyxQP8lkRlY", label: "Jackson",  type: "solo", memberSpotifyArtistIds: null, family: "got7" },
    { id: "got7-jinyoung", spotifyArtistId: "0cA67OQaC4zDkxvGmWqKu7", label: "Jinyoung", type: "solo", memberSpotifyArtistIds: null, family: "got7" },
    { id: "got7-youngjae", spotifyArtistId: "5qUAtC3NwSLYme4JqjlGfQ", label: "Youngjae", type: "solo", memberSpotifyArtistIds: null, family: "got7" },
    { id: "got7-bambam",   spotifyArtistId: "0AwW3qkHckg8Dx51aSy6hy", label: "BamBam",   type: "solo", memberSpotifyArtistIds: null, family: "got7" },
    { id: "got7-yugyeom",  spotifyArtistId: "3ohXmy1PGdB3XgzhPqQ0tY", label: "Yugyeom",  type: "solo", memberSpotifyArtistIds: null, family: "got7" },

    // #endregion
    // #region Highlight
    // ─── Highlight ────────────────────────────────────────────────────────────
    {
        id: "highlight",
        spotifyArtistId: "3T0fMfxYBU3q9oAUAdPIsr",
        label: "Highlight",
        type: "group",
        memberSpotifyArtistIds: [
            "4drjiBRSqZoTD67xgZCmNo", // Yong Junhyung
            "1fwMtpwCEJovQuyxSuHcAd", // Yang Yoseob
            "3CC7p9QM4VjO62rmcaRP3z", // Lee Kikwang
        ],
    },
    // Highlight — members (confirmed; Yoon Doojoon, Son Dongwoon N/A)
    { id: "highlight-yong-junhyung", spotifyArtistId: "4drjiBRSqZoTD67xgZCmNo", label: "Yong Junhyung", type: "solo", memberSpotifyArtistIds: null, family: "highlight" },
    { id: "highlight-yang-yoseob",   spotifyArtistId: "1fwMtpwCEJovQuyxSuHcAd", label: "Yang Yoseob",   type: "solo", memberSpotifyArtistIds: null, family: "highlight" },
    { id: "highlight-lee-kikwang",   spotifyArtistId: "3CC7p9QM4VjO62rmcaRP3z", label: "Lee Kikwang",   type: "solo", memberSpotifyArtistIds: null, family: "highlight" },

    // #endregion
    // #region INFINITE
    // ─── INFINITE ─────────────────────────────────────────────────────────────
    {
        id: "infinite",
        spotifyArtistId: "1bkpTEmumLC3xc7HgMsttU",
        label: "INFINITE",
        type: "group",
        memberSpotifyArtistIds: [
            "2AK8mEsvIRVd6biBapWe3o", // Dongwoo
            "3bGzcepRQ7Zu1J6JDDAq1T", // Hoya
            "2Vm2JJpUJzLoBEYQEVrmdV", // L
        ],
    },
    // INFINITE — members (confirmed; Sunggyu, Woohyun, Sungyeol, Sungjong N/A)
    { id: "infinite-dongwoo", spotifyArtistId: "2AK8mEsvIRVd6biBapWe3o", label: "Dongwoo", type: "solo", memberSpotifyArtistIds: null, family: "infinite" },
    { id: "infinite-hoya",    spotifyArtistId: "3bGzcepRQ7Zu1J6JDDAq1T", label: "Hoya",    type: "solo", memberSpotifyArtistIds: null, family: "infinite" },
    { id: "infinite-l",       spotifyArtistId: "2Vm2JJpUJzLoBEYQEVrmdV", label: "L",       type: "solo", memberSpotifyArtistIds: null, family: "infinite" },

    // #endregion
    // #region ITZY
    // ─── ITZY ─────────────────────────────────────────────────────────────────
    {
        id: "itzy",
        spotifyArtistId: "2KC9Qb60EaY0kW4eH68vr3",
        label: "ITZY",
        type: "group",
        memberSpotifyArtistIds: [
            "3skli1w2n0nOZ4qkDbvV2m", // Yeji
            "19Io533x1pKQu6ZuisGek5", // Lia
            "73nPXEFs9tGCNmSOcqFHPs", // Chaeryeong
            "6FsEIvsTuqjpejg2jDbYdv", // Yuna
        ],
    },
    // ITZY — members (confirmed; Ryujin N/A)
    { id: "itzy-yeji",       spotifyArtistId: "3skli1w2n0nOZ4qkDbvV2m", label: "Yeji",       type: "solo", memberSpotifyArtistIds: null, family: "itzy" },
    { id: "itzy-lia",        spotifyArtistId: "19Io533x1pKQu6ZuisGek5", label: "Lia",        type: "solo", memberSpotifyArtistIds: null, family: "itzy" },
    { id: "itzy-chaeryeong", spotifyArtistId: "73nPXEFs9tGCNmSOcqFHPs", label: "Chaeryeong", type: "solo", memberSpotifyArtistIds: null, family: "itzy" },
    { id: "itzy-yuna",       spotifyArtistId: "6FsEIvsTuqjpejg2jDbYdv", label: "Yuna",       type: "solo", memberSpotifyArtistIds: null, family: "itzy" },

    // #endregion
    // #region IVE
    // ─── IVE ──────────────────────────────────────────────────────────────────
    {
        id: "ive",
        spotifyArtistId: "6RHTUrRF63xao58xh9FXYJ",
        label: "IVE",
        type: "group",
        memberSpotifyArtistIds: [
            "5s3Ys2jpFZD2t4bivtHG2q", // Rei
            "2Cl2zS9nttS8xQeCp7zYT1", // Liz
        ],
    },
    // IVE — members (confirmed; Yujin, Gaeul, Wonyoung, Leeseo N/A)
    { id: "ive-rei", spotifyArtistId: "5s3Ys2jpFZD2t4bivtHG2q", label: "Rei", type: "solo", memberSpotifyArtistIds: null, family: "ive" },
    { id: "ive-liz", spotifyArtistId: "2Cl2zS9nttS8xQeCp7zYT1", label: "Liz", type: "solo", memberSpotifyArtistIds: null, family: "ive" },

    // #endregion
    // #region LE SSERAFIM
    // ─── LE SSERAFIM ──────────────────────────────────────────────────────────
    {
        id: "le-sserafim",
        spotifyArtistId: "4SpbR6yFEvexJuaBpgAU5p",
        label: "LE SSERAFIM",
        type: "group",
        memberSpotifyArtistIds: [
            "39j6wByxxNDb92rODch4mT", // Chaewon
            "13yWtUnz63q5VIs5SwoMhy", // Yunjin
        ],
    },
    // LE SSERAFIM — members (confirmed; Sakura, Kazuha, Eunchae N/A)
    { id: "le-sserafim-chaewon", spotifyArtistId: "39j6wByxxNDb92rODch4mT", label: "Chaewon", type: "solo", memberSpotifyArtistIds: null, family: "le-sserafim" },
    { id: "le-sserafim-yunjin",  spotifyArtistId: "13yWtUnz63q5VIs5SwoMhy", label: "Yunjin",  type: "solo", memberSpotifyArtistIds: null, family: "le-sserafim" },

    // #endregion
    // #region MAMAMOO
    // ─── MAMAMOO ──────────────────────────────────────────────────────────────
    {
        id: "mamamoo",
        spotifyArtistId: "0XATRDCYuuGhk0oE7C0o5G",
        label: "MAMAMOO",
        type: "group",
        memberSpotifyArtistIds: [
            "5cYcI546S8Lf97m4mNdYLD", // Solar
            "1eTft3tXynrKdo6XD7QHLL", // Moonbyul
            "0BqRGrwqndrtNkojXiqIzL", // Wheein
            "7bmYpVgQub656uNTu6qGNQ", // Hwasa
        ],
    },
    // MAMAMOO — members
    { id: "mamamoo-solar",    spotifyArtistId: "5cYcI546S8Lf97m4mNdYLD", label: "Solar",    type: "solo", memberSpotifyArtistIds: null, family: "mamamoo" },
    { id: "mamamoo-moonbyul", spotifyArtistId: "1eTft3tXynrKdo6XD7QHLL", label: "Moonbyul", type: "solo", memberSpotifyArtistIds: null, family: "mamamoo" },
    { id: "mamamoo-wheein",   spotifyArtistId: "0BqRGrwqndrtNkojXiqIzL", label: "Wheein",   type: "solo", memberSpotifyArtistIds: null, family: "mamamoo" },
    { id: "mamamoo-hwasa",    spotifyArtistId: "7bmYpVgQub656uNTu6qGNQ", label: "Hwasa",    type: "solo", memberSpotifyArtistIds: null, family: "mamamoo" },

    // #endregion
    // #region MONSTA X
    // ─── MONSTA X ─────────────────────────────────────────────────────────────
    {
        id: "monsta-x",
        spotifyArtistId: "4TnGh5PKbSjpYqpIdlW5nz",
        label: "MONSTA X",
        type: "group",
        memberSpotifyArtistIds: [
            "6bSWLKCL7hFxU0B1BXVfwC", // Shownu
            "1lnrTVtTQtQS77320ZmX5V", // Minhyuk
            "4JITZR64T7ws0m6VLtC1VK", // Kihyun
            "2X7BGapA7C4ELFcpFWNNTx", // Hyungwon
            "4rpOWirhzqN7NPgRX76l1k", // Joohoney
            "49tkHHS0mXwa5eLYvyvKyd", // I.M
        ],
    },
    // MONSTA X — members
    { id: "monsta-x-shownu",   spotifyArtistId: "6bSWLKCL7hFxU0B1BXVfwC", label: "Shownu",   type: "solo", memberSpotifyArtistIds: null, family: "monsta-x" },
    { id: "monsta-x-minhyuk",  spotifyArtistId: "1lnrTVtTQtQS77320ZmX5V", label: "Minhyuk",  type: "solo", memberSpotifyArtistIds: null, family: "monsta-x" },
    { id: "monsta-x-kihyun",   spotifyArtistId: "4JITZR64T7ws0m6VLtC1VK", label: "Kihyun",   type: "solo", memberSpotifyArtistIds: null, family: "monsta-x" },
    { id: "monsta-x-hyungwon", spotifyArtistId: "2X7BGapA7C4ELFcpFWNNTx", label: "Hyungwon", type: "solo", memberSpotifyArtistIds: null, family: "monsta-x" },
    { id: "monsta-x-joohoney", spotifyArtistId: "4rpOWirhzqN7NPgRX76l1k", label: "Joohoney", type: "solo", memberSpotifyArtistIds: null, family: "monsta-x" },
    { id: "monsta-x-im",       spotifyArtistId: "49tkHHS0mXwa5eLYvyvKyd", label: "I.M",      type: "solo", memberSpotifyArtistIds: null, family: "monsta-x" },

    // #endregion
    // #region NCT (parent)
    // ─── NCT (parent) ─────────────────────────────────────────────────────────
    {
        id: "nct",
        spotifyArtistId: "",
        label: "NCT",
        type: "group",
        memberSpotifyArtistIds: null,
        subunits: [
            "3paGCCtX1Xr4Gx53mSeZuQ", // NCT U
            "3IniCa6EijyZ3bsY0eTG3C", // NCT 2020
            "1LljMyYd0jLd4Q7z1iDR5H", // JNJM
        ],
    },

    // #endregion
    // #region NCT 127
    // ─── NCT 127 ──────────────────────────────────────────────────────────────
    {
        id: "nct-127",
        spotifyArtistId: "7f4ignuCJhLXfZ9giKT7rH",
        label: "NCT 127",
        type: "group",
        family: "nct",
        memberSpotifyArtistIds: [
            "7oWUU7t60DhuzG3vjs7HV6", // Johnny
            "6SKusTjOAPsTZ6kareKQdm", // Taeyong
            "4WndMgZGitK4uQdKcmVHua", // Yuta
            "5IMXUzbeAyevQmvtOhXQGi", // Doyoung
            "0qQI2kmsvSe2ex9k94T5vu", // Jaehyun
            "26ECn7DzgrUo23kSC9KD7k", // Jungwoo
            "70DFixYAFPv4Pf9kgSfR9O", // Mark
            "1pHMYguhayIoXmPjoOUyu3", // Haechan
        ],
        subunits: [
            "0W0w607z3JEA1vXLz9FVGw", // NCT DoJaeJung (Doyoung, Jaehyun, Jungwoo)
        ],
    },
    // NCT 127 — members
    { id: "nct-127-johnny",  spotifyArtistId: "7oWUU7t60DhuzG3vjs7HV6", label: "Johnny",  type: "solo", memberSpotifyArtistIds: null, family: "nct-127" },
    { id: "nct-127-taeyong", spotifyArtistId: "6SKusTjOAPsTZ6kareKQdm", label: "Taeyong", type: "solo", memberSpotifyArtistIds: null, family: "nct-127" },
    { id: "nct-127-yuta",    spotifyArtistId: "4WndMgZGitK4uQdKcmVHua", label: "Yuta",    type: "solo", memberSpotifyArtistIds: null, family: "nct-127" },
    { id: "nct-127-doyoung", spotifyArtistId: "5IMXUzbeAyevQmvtOhXQGi", label: "Doyoung", type: "solo", memberSpotifyArtistIds: null, family: "nct-127" },
    { id: "nct-127-jaehyun", spotifyArtistId: "0qQI2kmsvSe2ex9k94T5vu", label: "Jaehyun", type: "solo", memberSpotifyArtistIds: null, family: "nct-127" },
    { id: "nct-127-jungwoo", spotifyArtistId: "26ECn7DzgrUo23kSC9KD7k", label: "Jungwoo", type: "solo", memberSpotifyArtistIds: null, family: "nct-127" },
    { id: "nct-127-mark",    spotifyArtistId: "70DFixYAFPv4Pf9kgSfR9O", label: "Mark",    type: "solo", memberSpotifyArtistIds: null, family: "nct-127" },
    { id: "nct-127-haechan", spotifyArtistId: "1pHMYguhayIoXmPjoOUyu3", label: "Haechan", type: "solo", memberSpotifyArtistIds: null, family: "nct-127" },

    // #endregion
    // #region NCT Dream
    // ─── NCT Dream ────────────────────────────────────────────────────────────
    {
        id: "nct-dream",
        spotifyArtistId: "1gBUSTR3TyDdTVFIaQnc02",
        label: "NCT Dream",
        type: "group",
        family: "nct",
        memberSpotifyArtistIds: [
            "70DFixYAFPv4Pf9kgSfR9O", // Mark    (see nct-127-mark)
            "3DZrLuJOQFKqV2sjMsKb1V", // Jeno
            "1pHMYguhayIoXmPjoOUyu3", // Haechan (see nct-127-haechan)
        ],
    },
    // NCT Dream — members (confirmed; Renjun, Jaemin, Chenle, Jisung N/A)
    // Mark and Haechan share entries with NCT 127
    { id: "nct-dream-jeno", spotifyArtistId: "3DZrLuJOQFKqV2sjMsKb1V", label: "Jeno", type: "solo", memberSpotifyArtistIds: null, family: "nct-dream" },

    // #endregion
    // #region NCT WISH
    // ─── NCT WISH ─────────────────────────────────────────────────────────────
    {
        id: "nct-wish",
        spotifyArtistId: "4FqmqIspLaUGtxAFFLsZxc",
        label: "NCT WISH",
        type: "group",
        family: "nct",
        memberSpotifyArtistIds: null,
    },
    // NCT WISH — no confirmed member Spotify IDs

    // #endregion
    // #region NewJeans
    // ─── NewJeans ─────────────────────────────────────────────────────────────
    {
        id: "newjeans",
        spotifyArtistId: "6HvZYsbFfjnjFrWF950C9d",
        label: "NewJeans",
        type: "group",
        memberSpotifyArtistIds: [
            "14E7RzXOsb9iMithqexVOd", // Hanni
            "3BNhPTiKBExlE45mYeC9YY", // Danielle
        ],
    },
    // NewJeans — members (confirmed; Minji, Haerin, Hyein N/A)
    { id: "newjeans-hanni",    spotifyArtistId: "14E7RzXOsb9iMithqexVOd", label: "Hanni",    type: "solo", memberSpotifyArtistIds: null, family: "newjeans" },
    { id: "newjeans-danielle", spotifyArtistId: "3BNhPTiKBExlE45mYeC9YY", label: "Danielle", type: "solo", memberSpotifyArtistIds: null, family: "newjeans" },

    // #endregion
    // #region Red Velvet
    // ─── Red Velvet ───────────────────────────────────────────────────────────
    {
        id: "red-velvet",
        spotifyArtistId: "1z4g3DjTBBZKhvAroFlhOM",
        label: "Red Velvet",
        type: "group",
        memberSpotifyArtistIds: [
            "1FCug8HMxqearaZB5qwWQj", // Irene
            "2QM5S4yO6xHgnNvF0nbZZq", // Seulgi
            "0FRUZvZNPzM3YJMABJxf2K", // Wendy
            "0sYpJ0nCC8AlDrZFeAA7ub", // Joy
            "4xzwjGxzfKglU0cNW4q4l1", // Yeri
        ],
    },
    // Red Velvet — members
    { id: "red-velvet-irene",  spotifyArtistId: "1FCug8HMxqearaZB5qwWQj", label: "Irene",  type: "solo", memberSpotifyArtistIds: null, family: "red-velvet" },
    { id: "red-velvet-seulgi", spotifyArtistId: "2QM5S4yO6xHgnNvF0nbZZq", label: "Seulgi", type: "solo", memberSpotifyArtistIds: null, family: "red-velvet" },
    { id: "red-velvet-wendy",  spotifyArtistId: "0FRUZvZNPzM3YJMABJxf2K", label: "Wendy",  type: "solo", memberSpotifyArtistIds: null, family: "red-velvet" },
    { id: "red-velvet-joy",    spotifyArtistId: "0sYpJ0nCC8AlDrZFeAA7ub", label: "Joy",    type: "solo", memberSpotifyArtistIds: null, family: "red-velvet" },
    { id: "red-velvet-yeri",   spotifyArtistId: "4xzwjGxzfKglU0cNW4q4l1", label: "Yeri",   type: "solo", memberSpotifyArtistIds: null, family: "red-velvet" },

    // #endregion
    // #region SEVENTEEN
    // ─── SEVENTEEN ────────────────────────────────────────────────────────────
    {
        id: "seventeen",
        spotifyArtistId: "7nqOGRxlXj7N2JYbgNEjYH",
        label: "SEVENTEEN",
        type: "group",
        memberSpotifyArtistIds: [
            "6KDLlQYeeqUe5OQ2JrdNzF", // Jeonghan
            "74AwWFYdjQ3ER5vHO4H7b0", // Joshua
            "38Gn0ZVC8TQwuaMxBK1yRV", // Jun
            "6nWKAdMv1BDq1zHfZzkdbR", // Hoshi
            "3rHcBT06Vb1XGVUWhDALZt", // Wonwoo
            "4TdiASPlU3QdZvGQBothcQ", // Woozi
            "4l7mkcB0cZgIQrcd2AsQI3", // DK
            "5gUpo0BRmo6EOTbyU3z5Ay", // Mingyu
            "4DqFd6XE3dX4LWXHJVVpLk", // The8
            "0Vb2DjojEYsasFpc3aTZb6", // Seungkwan
            "2Y34b9AOK30zXgL7cAH4NG", // Vernon
            "5YaeXxzvqGNBCguELlKo6G", // Dino
        ],
        subunits: [
            "7GvlsjcgBrsE578yghOq7D", // JxW
            "1uAT5bTSp6dWbNmixIUP5t", // BSS
            "4wBjmEkWhY4T22q00CiF5V", // DxS
            "7kjuLdYbtTkWBToMu2ebZN", // CxM
            "1EReYiseDwE51FzGm7EK9n", // HxW
        ],
    },
    // SEVENTEEN — members (confirmed; S.Coups N/A)
    { id: "seventeen-jeonghan",  spotifyArtistId: "6KDLlQYeeqUe5OQ2JrdNzF", label: "Jeonghan",  type: "solo", memberSpotifyArtistIds: null, family: "seventeen" },
    { id: "seventeen-joshua",    spotifyArtistId: "74AwWFYdjQ3ER5vHO4H7b0", label: "Joshua",    type: "solo", memberSpotifyArtistIds: null, family: "seventeen" },
    { id: "seventeen-jun",       spotifyArtistId: "38Gn0ZVC8TQwuaMxBK1yRV", label: "Jun",       type: "solo", memberSpotifyArtistIds: null, family: "seventeen" },
    { id: "seventeen-hoshi",     spotifyArtistId: "6nWKAdMv1BDq1zHfZzkdbR", label: "Hoshi",     type: "solo", memberSpotifyArtistIds: null, family: "seventeen" },
    { id: "seventeen-wonwoo",    spotifyArtistId: "3rHcBT06Vb1XGVUWhDALZt", label: "Wonwoo",    type: "solo", memberSpotifyArtistIds: null, family: "seventeen" },
    { id: "seventeen-woozi",     spotifyArtistId: "4TdiASPlU3QdZvGQBothcQ", label: "Woozi",     type: "solo", memberSpotifyArtistIds: null, family: "seventeen" },
    { id: "seventeen-dk",        spotifyArtistId: "4l7mkcB0cZgIQrcd2AsQI3", label: "DK",        type: "solo", memberSpotifyArtistIds: null, family: "seventeen" },
    { id: "seventeen-mingyu",    spotifyArtistId: "5gUpo0BRmo6EOTbyU3z5Ay", label: "Mingyu",    type: "solo", memberSpotifyArtistIds: null, family: "seventeen" },
    { id: "seventeen-the8",      spotifyArtistId: "4DqFd6XE3dX4LWXHJVVpLk", label: "The8",      type: "solo", memberSpotifyArtistIds: null, family: "seventeen" },
    { id: "seventeen-seungkwan", spotifyArtistId: "0Vb2DjojEYsasFpc3aTZb6", label: "Seungkwan", type: "solo", memberSpotifyArtistIds: null, family: "seventeen" },
    { id: "seventeen-vernon",    spotifyArtistId: "2Y34b9AOK30zXgL7cAH4NG", label: "Vernon",    type: "solo", memberSpotifyArtistIds: null, family: "seventeen" },
    { id: "seventeen-dino",      spotifyArtistId: "5YaeXxzvqGNBCguELlKo6G", label: "Dino",      type: "solo", memberSpotifyArtistIds: null, family: "seventeen" },

    // #endregion
    // #region SHINee
    // ─── SHINee ───────────────────────────────────────────────────────────────
    {
        id: "shinee",
        spotifyArtistId: "2hRQKC0gqlZGPrmUKbcchR",
        label: "SHINee",
        type: "group",
        memberSpotifyArtistIds: [
            "7sZ5ipSoboWdqXkdj6AXHo", // Onew
            "6XXKPxRX2WWPPtfodzpc2v", // Key
            "5rGgflnIpRNizTCozbYBuY", // Jonghyun
            "08uRwDeNv1d7FSwlOUZdSn", // Minho
            "13rF01aOogvnkuQXOlgTW8", // Taemin
        ],
    },
    // SHINee — members
    { id: "shinee-onew",     spotifyArtistId: "7sZ5ipSoboWdqXkdj6AXHo", label: "Onew",     type: "solo", memberSpotifyArtistIds: null, family: "shinee" },
    { id: "shinee-key",      spotifyArtistId: "6XXKPxRX2WWPPtfodzpc2v", label: "Key",      type: "solo", memberSpotifyArtistIds: null, family: "shinee" },
    { id: "shinee-jonghyun", spotifyArtistId: "5rGgflnIpRNizTCozbYBuY", label: "Jonghyun", type: "solo", memberSpotifyArtistIds: null, family: "shinee" },
    { id: "shinee-minho",    spotifyArtistId: "08uRwDeNv1d7FSwlOUZdSn", label: "Minho",    type: "solo", memberSpotifyArtistIds: null, family: "shinee" },
    { id: "shinee-taemin",   spotifyArtistId: "13rF01aOogvnkuQXOlgTW8", label: "Taemin",   type: "solo", memberSpotifyArtistIds: null, family: "shinee" },

    // #endregion
    // #region Stray Kids
    // ─── Stray Kids ───────────────────────────────────────────────────────────
    {
        id: "stray-kids",
        spotifyArtistId: "2dIgFjalVxs4ThymZ67YCE",
        label: "Stray Kids",
        type: "group",
        memberSpotifyArtistIds: [
            "5jRUIqBSxmsBPNiEwKUjgZ", // Bang Chan
            "04jivE3Ek7Xu8WSGVmEqUn", // Lee Know
            "3XSid6KaiKoMAVZs2ug3yw", // Changbin
            "0ymFDpsRImjK673AGgFBcg", // Hyunjin
            "46YvTuKiPBUu5KP9818J2F", // Han
            "4UIOuc84ExWojcUzFGtb8W", // Felix
            "2nTtulf6WM0raQcIbzYJuf", // Seungmin
            "1odvXbzhdzNajv6un9x5Mc", // I.N
        ],
    },
    // Stray Kids — members
    { id: "stray-kids-bang-chan", spotifyArtistId: "5jRUIqBSxmsBPNiEwKUjgZ", label: "Bang Chan", type: "solo", memberSpotifyArtistIds: null, family: "stray-kids" },
    { id: "stray-kids-lee-know",  spotifyArtistId: "04jivE3Ek7Xu8WSGVmEqUn", label: "Lee Know",  type: "solo", memberSpotifyArtistIds: null, family: "stray-kids" },
    { id: "stray-kids-changbin",  spotifyArtistId: "3XSid6KaiKoMAVZs2ug3yw", label: "Changbin",  type: "solo", memberSpotifyArtistIds: null, family: "stray-kids" },
    { id: "stray-kids-hyunjin",   spotifyArtistId: "0ymFDpsRImjK673AGgFBcg", label: "Hyunjin",   type: "solo", memberSpotifyArtistIds: null, family: "stray-kids" },
    { id: "stray-kids-han",       spotifyArtistId: "46YvTuKiPBUu5KP9818J2F", label: "Han",       type: "solo", memberSpotifyArtistIds: null, family: "stray-kids" },
    { id: "stray-kids-felix",     spotifyArtistId: "4UIOuc84ExWojcUzFGtb8W", label: "Felix",     type: "solo", memberSpotifyArtistIds: null, family: "stray-kids" },
    { id: "stray-kids-seungmin",  spotifyArtistId: "2nTtulf6WM0raQcIbzYJuf", label: "Seungmin",  type: "solo", memberSpotifyArtistIds: null, family: "stray-kids" },
    { id: "stray-kids-in",        spotifyArtistId: "1odvXbzhdzNajv6un9x5Mc", label: "I.N",       type: "solo", memberSpotifyArtistIds: null, family: "stray-kids" },

    // #endregion
    // #region Super Junior
    // ─── Super Junior ─────────────────────────────────────────────────────────
    {
        id: "super-junior",
        spotifyArtistId: "6gzXCdfYfFe5XKhPKkYqxV",
        label: "Super Junior",
        type: "group",
        memberSpotifyArtistIds: [
            "1rVpXgPDVeUXPKKqVEnAGb", // Leeteuk
            "7GbN8yzIP7CFK5bNbUi6L3", // Heechul
            "4hyF8Vtc73RYJr3RgTE2Zf", // Yesung
            "2O46GIp2cr4sZaVPcP0ket", // Sungmin
            "4QRqp8zf5JtqaMk2OOU3NX", // Eunhyuk
            "4TSRZ3mVg0Lu0qmtJPiPEY", // Donghae
            "2rg9fZFK6wnlbRKUv7zkht", // Siwon
            "0fwfMuz3AmWRy2pyM5fDRo", // Ryeowook
            "0il5ZP3xYOECtONJtZ38Ln", // Kyuhyun
        ],
    },
    // Super Junior — members (confirmed; Shindong, Kibum N/A)
    { id: "super-junior-leeteuk",  spotifyArtistId: "1rVpXgPDVeUXPKKqVEnAGb", label: "Leeteuk",  type: "solo", memberSpotifyArtistIds: null, family: "super-junior" },
    { id: "super-junior-heechul",  spotifyArtistId: "7GbN8yzIP7CFK5bNbUi6L3", label: "Heechul",  type: "solo", memberSpotifyArtistIds: null, family: "super-junior" },
    { id: "super-junior-yesung",   spotifyArtistId: "4hyF8Vtc73RYJr3RgTE2Zf", label: "Yesung",   type: "solo", memberSpotifyArtistIds: null, family: "super-junior" },
    { id: "super-junior-sungmin",  spotifyArtistId: "2O46GIp2cr4sZaVPcP0ket", label: "Sungmin",  type: "solo", memberSpotifyArtistIds: null, family: "super-junior" },
    { id: "super-junior-eunhyuk",  spotifyArtistId: "4QRqp8zf5JtqaMk2OOU3NX", label: "Eunhyuk",  type: "solo", memberSpotifyArtistIds: null, family: "super-junior" },
    { id: "super-junior-donghae",  spotifyArtistId: "4TSRZ3mVg0Lu0qmtJPiPEY", label: "Donghae",  type: "solo", memberSpotifyArtistIds: null, family: "super-junior" },
    { id: "super-junior-siwon",    spotifyArtistId: "2rg9fZFK6wnlbRKUv7zkht", label: "Siwon",    type: "solo", memberSpotifyArtistIds: null, family: "super-junior" },
    { id: "super-junior-ryeowook", spotifyArtistId: "0fwfMuz3AmWRy2pyM5fDRo", label: "Ryeowook", type: "solo", memberSpotifyArtistIds: null, family: "super-junior" },
    { id: "super-junior-kyuhyun",  spotifyArtistId: "0il5ZP3xYOECtONJtZ38Ln", label: "Kyuhyun",  type: "solo", memberSpotifyArtistIds: null, family: "super-junior" },

    // #endregion
    // #region TXT
    // ─── TXT ──────────────────────────────────────────────────────────────────
    {
        id: "txt",
        spotifyArtistId: "0ghlgldX5Dd6720Q3qFyQB",
        label: "TXT",
        type: "group",
        memberSpotifyArtistIds: [
            "2Mo2yHjmrDRZW7yRuJwR2w", // Yeonjun
            "03TzGrcj9wA6OShCB1chZX", // Soobin
            "69vfchlzopPm72nD2elXCH", // Beomgyu
            "1kpVcaBKejm2ZrLYZkKdM8", // Taehyun
        ],
    },
    // TXT — members (confirmed; Huening Kai N/A)
    { id: "txt-yeonjun", spotifyArtistId: "2Mo2yHjmrDRZW7yRuJwR2w", label: "Yeonjun", type: "solo", memberSpotifyArtistIds: null, family: "txt" },
    { id: "txt-soobin",  spotifyArtistId: "03TzGrcj9wA6OShCB1chZX", label: "Soobin",  type: "solo", memberSpotifyArtistIds: null, family: "txt" },
    { id: "txt-beomgyu", spotifyArtistId: "69vfchlzopPm72nD2elXCH", label: "Beomgyu", type: "solo", memberSpotifyArtistIds: null, family: "txt" },
    { id: "txt-taehyun", spotifyArtistId: "1kpVcaBKejm2ZrLYZkKdM8", label: "Taehyun", type: "solo", memberSpotifyArtistIds: null, family: "txt" },

    // #endregion
    // #region TWICE
    // ─── TWICE ────────────────────────────────────────────────────────────────
    {
        id: "twice",
        spotifyArtistId: "7n2Ycct7Beij7Dj7meI4X0",
        label: "TWICE",
        type: "group",
        memberSpotifyArtistIds: [
            "1VwDG9aBflQupaFNjUru9A", // Nayeon
            "6om1UeevPLC4yhlUrsxdiu", // Momo
            "4a4zvpQq5Phxr12Pu8Akmm", // Sana
            "7F1iAHRYxR3MY7yAEuFqgL", // Jihyo
            "4oy2bSvGHRtPW7Wn9ijR12", // Mina
            "2WfpdUGuiHssM0oAxRYhxq", // Dahyun
            "0qtqWLjAkheu9MaVCQ3FXa", // Chaeyoung
            "1arCVYXeStgCY2UazBNBLK", // Tzuyu
        ],
    },
    // TWICE — members (confirmed; Jeongyeon N/A)
    { id: "twice-nayeon",    spotifyArtistId: "1VwDG9aBflQupaFNjUru9A", label: "Nayeon",    type: "solo", memberSpotifyArtistIds: null, family: "twice" },
    { id: "twice-momo",      spotifyArtistId: "6om1UeevPLC4yhlUrsxdiu", label: "Momo",      type: "solo", memberSpotifyArtistIds: null, family: "twice" },
    { id: "twice-sana",      spotifyArtistId: "4a4zvpQq5Phxr12Pu8Akmm", label: "Sana",      type: "solo", memberSpotifyArtistIds: null, family: "twice" },
    { id: "twice-jihyo",     spotifyArtistId: "7F1iAHRYxR3MY7yAEuFqgL", label: "Jihyo",     type: "solo", memberSpotifyArtistIds: null, family: "twice" },
    { id: "twice-mina",      spotifyArtistId: "4oy2bSvGHRtPW7Wn9ijR12", label: "Mina",      type: "solo", memberSpotifyArtistIds: null, family: "twice" },
    { id: "twice-dahyun",    spotifyArtistId: "2WfpdUGuiHssM0oAxRYhxq", label: "Dahyun",    type: "solo", memberSpotifyArtistIds: null, family: "twice" },
    { id: "twice-chaeyoung", spotifyArtistId: "0qtqWLjAkheu9MaVCQ3FXa", label: "Chaeyoung", type: "solo", memberSpotifyArtistIds: null, family: "twice" },
    { id: "twice-tzuyu",     spotifyArtistId: "1arCVYXeStgCY2UazBNBLK", label: "Tzuyu",     type: "solo", memberSpotifyArtistIds: null, family: "twice" },

    // #endregion
    // #region VIXX
    // ─── VIXX ─────────────────────────────────────────────────────────────────
    {
        id: "vixx",
        spotifyArtistId: "5BkB3rXc0qIdUtuEnhbK0A",
        label: "VIXX",
        type: "group",
        memberSpotifyArtistIds: [
            "5CaZ33OaNU8Cmlzy331GQd", // N
            "3ioQ8ESGz5P413c69gikh8", // Leo
            "08fiOzXWHTizuWGyS1dWu6", // Ken
            "42xj5mBLvrFdW6tYns6mxs", // Ravi
            "1WTpKxdwQrNsYW3MBJYwiG", // Hyuk
        ],
    },
    // VIXX — members (confirmed; Hongbin N/A)
    { id: "vixx-n",    spotifyArtistId: "5CaZ33OaNU8Cmlzy331GQd", label: "N",    type: "solo", memberSpotifyArtistIds: null, family: "vixx" },
    { id: "vixx-leo",  spotifyArtistId: "3ioQ8ESGz5P413c69gikh8", label: "Leo",  type: "solo", memberSpotifyArtistIds: null, family: "vixx" },
    { id: "vixx-ken",  spotifyArtistId: "08fiOzXWHTizuWGyS1dWu6", label: "Ken",  type: "solo", memberSpotifyArtistIds: null, family: "vixx" },
    { id: "vixx-ravi", spotifyArtistId: "42xj5mBLvrFdW6tYns6mxs", label: "Ravi", type: "solo", memberSpotifyArtistIds: null, family: "vixx" },
    { id: "vixx-hyuk", spotifyArtistId: "1WTpKxdwQrNsYW3MBJYwiG", label: "Hyuk", type: "solo", memberSpotifyArtistIds: null, family: "vixx" },

    // #endregion
    // #region WayV
    // ─── WayV ─────────────────────────────────────────────────────────────────
    {
        id: "wayv",
        spotifyArtistId: "1qBsABYUrxg9afpMtyoFKz",
        label: "WayV",
        type: "group",
        family: "nct",
        memberSpotifyArtistIds: [
            "4s2DuSSi7Puz6PGgCE8pKi", // Kun
            "3Q5Qep7ytrjVleNnMnntgQ", // Ten
            "51kPKCSzbLwEQFFwhfS4R7", // Xiaojun
            "5wrZ59w1ndSBlPeUj2f6Fs", // Hendery
            "5yyf4YDCKGaa71SC7KRw2L", // Yangyang
        ],
    },
    // WayV — members (confirmed; WinWin, Lucas N/A)
    { id: "wayv-kun",      spotifyArtistId: "4s2DuSSi7Puz6PGgCE8pKi", label: "Kun",      type: "solo", memberSpotifyArtistIds: null, family: "wayv" },
    { id: "wayv-ten",      spotifyArtistId: "3Q5Qep7ytrjVleNnMnntgQ", label: "Ten",      type: "solo", memberSpotifyArtistIds: null, family: "wayv" },
    { id: "wayv-xiaojun",  spotifyArtistId: "51kPKCSzbLwEQFFwhfS4R7", label: "Xiaojun",  type: "solo", memberSpotifyArtistIds: null, family: "wayv" },
    { id: "wayv-hendery",  spotifyArtistId: "5wrZ59w1ndSBlPeUj2f6Fs", label: "Hendery",  type: "solo", memberSpotifyArtistIds: null, family: "wayv" },
    { id: "wayv-yangyang", spotifyArtistId: "5yyf4YDCKGaa71SC7KRw2L", label: "Yangyang", type: "solo", memberSpotifyArtistIds: null, family: "wayv" },
    // #endregion
];

export function resolveCustomScope(artistId: string[]): { groupNames: string[]; memberIds: string[] } {
    const groupNames: string[] = [];
    const memberIds: string[] = [];
    for (const id of artistId) {
        const entry = artistRegistry.find(e => e.spotifyArtistId === id);
        if (entry) {
            groupNames.push(entry.label);
        } else {
            memberIds.push(id);
        }
    }
    return { groupNames, memberIds };
}

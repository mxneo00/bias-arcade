type ArtistRegistry = {
    id: string;
    spotifyArtistId: string;
    label: string;
    type: "solo" | "group";
    subunits?: string[] | null;
    family?: string | null;
    aliases?: string[] | null;
};

export const artistRegistry: ArtistRegistry[] = [

    // IMPORTANT NOTE: Label MUST be the exact same as the artist name on Spotify

    // #region 2NE1
    // ─── 2NE1 ─────────────────────────────────────────────────────────────────
    {
        id: "2ne1",
        spotifyArtistId: "1l0mKo96Jh9HVYONcRl3Yp",
        label: "2NE1",
        type: "group",
    },
    // 2NE1 — members
    { id: "2ne1-cl",           spotifyArtistId: "0tzSBCPJZmHTdOA3ZV2mN3", label: "CL",           type: "solo", family: "2ne1" },
    { id: "2ne1-minzy",        spotifyArtistId: "1ql28OzmgulHG2ldXFrbWp", label: "Minzy",        type: "solo", family: "2ne1" },
    { id: "2ne1-park-bom",     spotifyArtistId: "3uHb6dRazmcaT15bMexUtt", label: "Park Bom",     type: "solo", family: "2ne1" },
    { id: "2ne1-sandara-park", spotifyArtistId: "3LKVw6XQYcot0OZMFmf4IP", label: "Sandara Park", type: "solo", family: "2ne1" },

    // #endregion
    // #region 2PM
    // ─── 2PM ──────────────────────────────────────────────────────────────────
    {
        id: "2pm",
        spotifyArtistId: "5iRPbkcPmqAFFwDUj6ywVS",
        label: "2PM",
        type: "group",
    },
    // 2PM — members
    { id: "2pm-junk",     spotifyArtistId: "4m69UKabjuuaoayREZud9h", label: "Jun.K",    type: "solo", family: "2pm" },
    { id: "2pm-nichkhun", spotifyArtistId: "3z8kQKCYy5W82nZjl3ydEh", label: "Nichkhun", type: "solo", family: "2pm" },
    { id: "2pm-taecyeon", spotifyArtistId: "75du5QRTY4IyBl3YcH2gSn", label: "Taecyeon", type: "solo", family: "2pm" },
    { id: "2pm-wooyoung", spotifyArtistId: "16iaWzk4PHL4GCjzyT6zZn", label: "Wooyoung", type: "solo", family: "2pm" },
    { id: "2pm-junho",    spotifyArtistId: "1nEFr6pWrot80eRuOkZQxg", label: "Junho",    type: "solo", family: "2pm" },
    { id: "2pm-chansung", spotifyArtistId: "0Xysc1acrmF3w8vMvmSUPW", label: "Chansung", type: "solo", family: "2pm" },

    // #endregion
    // #region aespa
    // ─── aespa ────────────────────────────────────────────────────────────────
    {
        id: "aespa",
        spotifyArtistId: "6YVMFz59CuY7ngCxTxjpxE",
        label: "aespa",
        type: "group",
    },
    // aespa — members
    { id: "aespa-karina",   spotifyArtistId: "2qwDjeSYANOOBFU8jwtBXx", label: "Karina",   type: "solo", family: "aespa" },
    { id: "aespa-giselle",  spotifyArtistId: "2P1id80CMwR5R5cwcyIIAi", label: "Giselle",  type: "solo", family: "aespa" },
    { id: "aespa-winter",   spotifyArtistId: "3mPquBmMu97Iq9TpzQ6ayI", label: "Winter",   type: "solo", family: "aespa" },
    { id: "aespa-ningning", spotifyArtistId: "5t1uryofgueHrjrryqX8vM", label: "Ningning", type: "solo", family: "aespa" },

    // #endregion
    // region AMPERSANDONE
    // ─── AMPERS&ONE ────────────────────────────────────────────────────────────────
    {
        id: "ampers&one",
        spotifyArtistId: "4T0Chh3DGxJrEs3gM0biqg",
        label: "AMPERS&ONE",
        type: "group",
    },
    // end region

    // #region ASTRO
    // ─── ASTRO ────────────────────────────────────────────────────────────────
    {
        id: "astro",
        spotifyArtistId: "4pz4uzOMpJQyV8UTsDy4H8",
        label: "ASTRO",
        type: "group",
    },
    // ASTRO — members
    { id: "astro-mj",         spotifyArtistId: "1LHYoqa8tahdIWTUvxb17Y", label: "MJ",         type: "solo", family: "astro" },
    { id: "astro-jinjin",     spotifyArtistId: "3U8ZnKIeY7sgQkIHjQDlHA", label: "JinJin",     type: "solo", family: "astro" },
    { id: "astro-cha-eunwoo", spotifyArtistId: "76ea6HHCvHlTqhF9I0jtHU", label: "Cha Eunwoo", type: "solo", family: "astro" },
    { id: "astro-moonbin",    spotifyArtistId: "0jCMdzb0fm0sOWIcALSlWU", label: "Moonbin",    type: "solo", family: "astro" },
    { id: "astro-rocky",      spotifyArtistId: "3bQABAi10Xqg1WsMAhYdBZ", label: "Rocky",      type: "solo", family: "astro" },
    { id: "astro-sanha",      spotifyArtistId: "6zLERXpqnnXhEnhva48jKW", label: "Sanha",      type: "solo", family: "astro" },

    // #endregion
    // #region ATEEZ
    // ─── ATEEZ ────────────────────────────────────────────────────────────────
    {
        id: "ateez",
        spotifyArtistId: "68KmkJeZGfwe1OUaivBa2L",
        label: "ATEEZ",
        type: "group",
    },
    // ATEEZ — members (confirmed; Yeosang and San N/A)
    { id: "ateez-hongjoong", spotifyArtistId: "3MZLSgcd5kOdhrZasDMecx", label: "Hongjoong", type: "solo", family: "ateez" },
    { id: "ateez-seonghwa",  spotifyArtistId: "3TkRPyC9kz1wSRIkzUfVgL", label: "Seonghwa",  type: "solo", family: "ateez" },
    { id: "ateez-yunho",     spotifyArtistId: "0rFEZFoYNIa37Ad40mCuDq", label: "Yunho",     type: "solo", family: "ateez" },
    { id: "ateez-mingi",     spotifyArtistId: "3ZHodgUsqkIUsek6ke65bO", label: "Mingi",     type: "solo", family: "ateez" },
    { id: "ateez-wooyoung",  spotifyArtistId: "5in2h2c2DWNHKzgZo9OnVO", label: "Wooyoung",  type: "solo", family: "ateez" },
    { id: "ateez-jongho",    spotifyArtistId: "5gecqU5FZgxVdz1AtLumT0", label: "Jongho",    type: "solo", family: "ateez" },

    // #endregion
    // #region B.A.P
    // ─── B.A.P ────────────────────────────────────────────────────────────────
    {
        id: "bap",
        spotifyArtistId: "6kxCoNfY6U1eP0Yc88phvk",
        label: "B.A.P",
        type: "group",
    },
    // B.A.P — members
    { id: "bap-bang-yongguk", spotifyArtistId: "6g6zaR4B3WDZXphDRmsVGF", label: "Bang Yongguk", type: "solo", family: "bap" },
    { id: "bap-himchan",      spotifyArtistId: "2KHnP93IOzti9W9wFZXteU", label: "Himchan",      type: "solo", family: "bap" },
    { id: "bap-daehyun",      spotifyArtistId: "17LUHykIKujFPpkdbyq1E1", label: "Daehyun",      type: "solo", family: "bap" },
    { id: "bap-youngjae",     spotifyArtistId: "6yxXsPXcgTJjBRelX9NCiF", label: "Youngjae",     type: "solo", family: "bap" },
    { id: "bap-jongup",       spotifyArtistId: "5Pvxbh8QweK3Gm4NS0e2KD", label: "Jongup",       type: "solo", family: "bap" },
    { id: "bap-zelo",         spotifyArtistId: "2N5L6zU0bi3q8AdJpNW1z3", label: "Zelo",         type: "solo", family: "bap" },

    // #endregion
    // #region BIGBANG
    // ─── BIGBANG ──────────────────────────────────────────────────────────────
    {
        id: "bigbang",
        spotifyArtistId: "4Kxlr1PRlDKEB0ekOCyHgX",
        label: "BIGBANG",
        type: "group",
    },
    // BIGBANG — members
    { id: "bigbang-gdragon", spotifyArtistId: "30b9WulBM8sFuBo17nNq9c", label: "G-Dragon", type: "solo", family: "bigbang" },
    { id: "bigbang-top",     spotifyArtistId: "4yiB30K5scGkjmAgHGIH8Y", label: "T.O.P",    type: "solo", family: "bigbang" },
    { id: "bigbang-taeyang", spotifyArtistId: "6udveWUgX4vu75FF0DTrXV", label: "Taeyang",  type: "solo", family: "bigbang" },
    { id: "bigbang-daesung", spotifyArtistId: "1OQxmfKN9UG5C7nr4MkasO", label: "Daesung",  type: "solo", family: "bigbang" },

    // #endregion
    // #region BLACKPINK
    // ─── BLACKPINK ────────────────────────────────────────────────────────────
    {
        id: "blackpink",
        spotifyArtistId: "41MozSoPIsD1dJM0CLPjZF",
        label: "BLACKPINK",
        type: "group",
    },
    // BLACKPINK — members
    { id: "blackpink-jisoo",  spotifyArtistId: "6UZ0ba50XreR4TM8u322gs", label: "Jisoo",  type: "solo", family: "blackpink" },
    { id: "blackpink-jennie", spotifyArtistId: "250b0Wlc5Vk0CoUsaCY84M", label: "Jennie", type: "solo", family: "blackpink" },
    { id: "blackpink-rose",   spotifyArtistId: "3eVa5w3URK5duf6eyVDbu9", label: "Rosé",   type: "solo", family: "blackpink" },
    { id: "blackpink-lisa",   spotifyArtistId: "5L1lO4eRHmJ7a0Q6csE5cT", label: "Lisa",   type: "solo", family: "blackpink" },

    // #endregion
    // #region BTS
    // ─── BTS ──────────────────────────────────────────────────────────────────
    {
        id: "bts",
        spotifyArtistId: "3Nrfpe0tUJi4K4DXYWgMUX",
        label: "BTS",
        type: "group",
    },
    // BTS — members
    { id: "bts-rm",       spotifyArtistId: "2auC28zjQyVTsiZKNgPRGs", label: "RM",       type: "solo", family: "bts" },
    { id: "bts-jin",      spotifyArtistId: "5vV3bFXnN6D6N3Nj4xRvaV", label: "Jin",      type: "solo", family: "bts" },
    { id: "bts-suga",     spotifyArtistId: "0ebNdVaOfp6N0oZ1guIxM8", label: "Suga",     type: "solo", family: "bts" },
    { id: "bts-jhope",    spotifyArtistId: "0b1sIQumIAsNbqAoIClSpy", label: "J-Hope",   type: "solo", family: "bts" },
    { id: "bts-jimin",    spotifyArtistId: "1oSPZhvZMIrWW5I41kPkkY", label: "Jimin",    type: "solo", family: "bts" },
    { id: "bts-v",        spotifyArtistId: "3JsHnjpbhX4SnySpvpa9DK", label: "V",        type: "solo", family: "bts" },
    { id: "bts-jungkook", spotifyArtistId: "6HaGTQPmzraVmaVxvz6EUc", label: "Jungkook", type: "solo", family: "bts" },

    // #endregion
    // #region ENHYPEN
    // ─── ENHYPEN ──────────────────────────────────────────────────────────────
    {
        id: "enhypen",
        spotifyArtistId: "5t5FqBwTcgKTaWmfEbwQY9",
        label: "ENHYPEN",
        type: "group",
    },
    // ENHYPEN — members (confirmed; Jungwon, Jake, Sunghoon, Sunoo, Ni-ki N/A)
    { id: "enhypen-heeseung", spotifyArtistId: "6dNavn0Wr11k0fRVlbEi3D", label: "Heeseung", type: "solo", family: "enhypen" },
    { id: "enhypen-jay",      spotifyArtistId: "1dxyDekkPqYVKpC7iW71zJ", label: "Jay",      type: "solo", family: "enhypen" },

    // #endregion
    // #region EXO
    // ─── EXO ──────────────────────────────────────────────────────────────────
    {
        id: "exo",
        spotifyArtistId: "3cjEqqelV9zb4BYE3qDQ4O",
        label: "EXO",
        type: "group",
    },
    // EXO — members (confirmed; Sehun N/A)
    { id: "exo-xiumin",   spotifyArtistId: "5t0Js3X9t4wpgXGlaiTFe6", label: "Xiumin",   type: "solo", family: "exo" },
    { id: "exo-suho",     spotifyArtistId: "5zkf2Na8DKKJmtWX5Xrx3m", label: "Suho",     type: "solo", family: "exo" },
    { id: "exo-lay",      spotifyArtistId: "4o7tWrzQOqarDtTMWD2HV9", label: "Lay",      type: "solo", family: "exo" },
    { id: "exo-baekhyun", spotifyArtistId: "4ufh0WuMZh6y4Dmdnklvdl", label: "Baekhyun", type: "solo", family: "exo" },
    { id: "exo-chen",     spotifyArtistId: "0UEP2XBR9aC5NBKcAKnBIq", label: "Chen",     type: "solo", family: "exo" },
    { id: "exo-chanyeol", spotifyArtistId: "6jV25rzTKQ2zMgrqHha1V5", label: "Chanyeol", type: "solo", family: "exo" },
    { id: "exo-do",       spotifyArtistId: "2CQZr2RPZmrcvDnaod1ldC", label: "D.O.",     type: "solo", family: "exo" },
    { id: "exo-kai",      spotifyArtistId: "6iVo62B0bdTknRcrktCmak", label: "Kai",      type: "solo", family: "exo" },

    // #endregion
    // #region f(x)
    // ─── f(x) ─────────────────────────────────────────────────────────────────
    {
        id: "fx",
        spotifyArtistId: "3wRA5UYoo08BBKJnzyKkpF",
        label: "f(x)",
        type: "group",
    },
    // f(x) — members (confirmed; Victoria, Amber N/A)
    { id: "fx-luna",    spotifyArtistId: "56HZvtrzD82YKMGGJTlIG2", label: "Luna",    type: "solo", family: "fx" },
    { id: "fx-krystal", spotifyArtistId: "3qYt5zzf9B414wKsDhrtaO", label: "Krystal", type: "solo", family: "fx" },

    // #endregion
    // #region (G)I-DLE
    // ─── (G)I-DLE ─────────────────────────────────────────────────────────────
    {
        id: "gidle",
        spotifyArtistId: "2AfmfGFbe0A0WsTYm0SDTx",
        label: "(G)I-DLE",
        type: "group",
    },
    // (G)I-DLE — members (confirmed; Miyeon, Shuhua N/A)
    { id: "gidle-soyeon", spotifyArtistId: "6Xg22wJOAcnvPUfk5WvODH", label: "Soyeon", type: "solo", family: "gidle" },
    { id: "gidle-minnie", spotifyArtistId: "2pHkxVNynHBwQHhGaoBIXX", label: "Minnie", type: "solo", family: "gidle" },
    { id: "gidle-yuqi",   spotifyArtistId: "22aCD8IrQZjcPgZw728QT6", label: "Yuqi",   type: "solo", family: "gidle" },

    // #endregion
    // #region Girls' Generation
    // ─── Girls' Generation ────────────────────────────────────────────────────
    {
        id: "girls-generation",
        spotifyArtistId: "0Sadg1vgvaPqGTOjxu0N6c",
        label: "Girls' Generation",
        type: "group",
    },
    // Girls' Generation — members (confirmed; Hyoyeon, Sooyoung, Yoona N/A)
    { id: "girls-generation-taeyeon", spotifyArtistId: "3qNVuliS40BLgXGxhdBdqu", label: "Taeyeon", type: "solo", family: "girls-generation" },
    { id: "girls-generation-sunny",   spotifyArtistId: "2tYCDP6T15g9q19vIlh7vV", label: "Sunny",   type: "solo", family: "girls-generation" },
    { id: "girls-generation-tiffany", spotifyArtistId: "4C3uGP8vRDzxrhJxZiOjTe", label: "Tiffany", type: "solo", family: "girls-generation" },
    { id: "girls-generation-yuri",    spotifyArtistId: "2TMRvcwsmvVhvuEbKVEbZe", label: "Yuri",    type: "solo", family: "girls-generation" },
    { id: "girls-generation-seohyun", spotifyArtistId: "5uM1Et50auro2hTS6ZLcmT", label: "Seohyun", type: "solo", family: "girls-generation" },

    // #endregion
    // #region GOT7
    // ─── GOT7 ─────────────────────────────────────────────────────────────────
    {
        id: "got7",
        spotifyArtistId: "6nfDaffa50mKtEOwR8g4df",
        label: "GOT7",
        type: "group",
    },
    // GOT7 — members
    { id: "got7-jay-b",    spotifyArtistId: "3IjHX8KZKoeq3X4QgXxqbT", label: "Jay B",    type: "solo", family: "got7" },
    { id: "got7-mark",     spotifyArtistId: "4l1q0z9xeJcJw73Gxc6gCB", label: "Mark",     type: "solo", family: "got7" },
    { id: "got7-jackson",  spotifyArtistId: "1kfWoWgCugPkyxQP8lkRlY", label: "Jackson",  type: "solo", family: "got7" },
    { id: "got7-jinyoung", spotifyArtistId: "0cA67OQaC4zDkxvGmWqKu7", label: "Jinyoung", type: "solo", family: "got7" },
    { id: "got7-youngjae", spotifyArtistId: "5qUAtC3NwSLYme4JqjlGfQ", label: "Youngjae", type: "solo", family: "got7" },
    { id: "got7-bambam",   spotifyArtistId: "0AwW3qkHckg8Dx51aSy6hy", label: "BamBam",   type: "solo", family: "got7" },
    { id: "got7-yugyeom",  spotifyArtistId: "3ohXmy1PGdB3XgzhPqQ0tY", label: "Yugyeom",  type: "solo", family: "got7" },

    // #endregion
    // #region Highlight
    // ─── Highlight ────────────────────────────────────────────────────────────
    {
        id: "highlight",
        spotifyArtistId: "3T0fMfxYBU3q9oAUAdPIsr",
        label: "Highlight",
        type: "group",
    },
    // Highlight — members (confirmed; Yoon Doojoon, Son Dongwoon N/A)
    { id: "highlight-yong-junhyung", spotifyArtistId: "4drjiBRSqZoTD67xgZCmNo", label: "Yong Junhyung", type: "solo", family: "highlight" },
    { id: "highlight-yang-yoseob",   spotifyArtistId: "1fwMtpwCEJovQuyxSuHcAd", label: "Yang Yoseob",   type: "solo", family: "highlight" },
    { id: "highlight-lee-kikwang",   spotifyArtistId: "3CC7p9QM4VjO62rmcaRP3z", label: "Lee Kikwang",   type: "solo", family: "highlight" },

    // #endregion
    // #region INFINITE
    // ─── INFINITE ─────────────────────────────────────────────────────────────
    {
        id: "infinite",
        spotifyArtistId: "1bkpTEmumLC3xc7HgMsttU",
        label: "INFINITE",
        type: "group",
    },
    // INFINITE — members (confirmed; Sunggyu, Woohyun, Sungyeol, Sungjong N/A)
    { id: "infinite-dongwoo", spotifyArtistId: "2AK8mEsvIRVd6biBapWe3o", label: "Dongwoo", type: "solo", family: "infinite" },
    { id: "infinite-hoya",    spotifyArtistId: "3bGzcepRQ7Zu1J6JDDAq1T", label: "Hoya",    type: "solo", family: "infinite" },
    { id: "infinite-l",       spotifyArtistId: "2Vm2JJpUJzLoBEYQEVrmdV", label: "L",       type: "solo", family: "infinite" },

    // #endregion
    // #region ITZY
    // ─── ITZY ─────────────────────────────────────────────────────────────────
    {
        id: "itzy",
        spotifyArtistId: "2KC9Qb60EaY0kW4eH68vr3",
        label: "ITZY",
        type: "group",
    },
    // ITZY — members (confirmed; Ryujin N/A)
    { id: "itzy-yeji",       spotifyArtistId: "3skli1w2n0nOZ4qkDbvV2m", label: "Yeji",       type: "solo", family: "itzy" },
    { id: "itzy-lia",        spotifyArtistId: "19Io533x1pKQu6ZuisGek5", label: "Lia",        type: "solo", family: "itzy" },
    { id: "itzy-chaeryeong", spotifyArtistId: "73nPXEFs9tGCNmSOcqFHPs", label: "Chaeryeong", type: "solo", family: "itzy" },
    { id: "itzy-yuna",       spotifyArtistId: "6FsEIvsTuqjpejg2jDbYdv", label: "Yuna",       type: "solo", family: "itzy" },

    // #endregion
    // #region IVE
    // ─── IVE ──────────────────────────────────────────────────────────────────
    {
        id: "ive",
        spotifyArtistId: "6RHTUrRF63xao58xh9FXYJ",
        label: "IVE",
        type: "group",
    },
    // IVE — members (confirmed; Yujin, Gaeul, Wonyoung, Leeseo N/A)
    { id: "ive-rei", spotifyArtistId: "5s3Ys2jpFZD2t4bivtHG2q", label: "Rei", type: "solo", family: "ive" },
    { id: "ive-liz", spotifyArtistId: "2Cl2zS9nttS8xQeCp7zYT1", label: "Liz", type: "solo", family: "ive" },

    // #endregion
    // #region LE SSERAFIM
    // ─── LE SSERAFIM ──────────────────────────────────────────────────────────
    {
        id: "le-sserafim",
        spotifyArtistId: "4SpbR6yFEvexJuaBpgAU5p",
        label: "LE SSERAFIM",
        type: "group",
    },
    // LE SSERAFIM — members (confirmed; Sakura, Kazuha, Eunchae N/A)
    { id: "le-sserafim-chaewon", spotifyArtistId: "39j6wByxxNDb92rODch4mT", label: "Chaewon", type: "solo", family: "le-sserafim" },
    { id: "le-sserafim-yunjin",  spotifyArtistId: "13yWtUnz63q5VIs5SwoMhy", label: "Yunjin",  type: "solo", family: "le-sserafim" },

    // #endregion
    // #region MAMAMOO
    // ─── MAMAMOO ──────────────────────────────────────────────────────────────
    {
        id: "mamamoo",
        spotifyArtistId: "0XATRDCYuuGhk0oE7C0o5G",
        label: "MAMAMOO",
        type: "group",
    },
    // MAMAMOO — members
    { id: "mamamoo-solar",    spotifyArtistId: "5cYcI546S8Lf97m4mNdYLD", label: "Solar",    type: "solo", family: "mamamoo" },
    { id: "mamamoo-moonbyul", spotifyArtistId: "1eTft3tXynrKdo6XD7QHLL", label: "Moonbyul", type: "solo", family: "mamamoo" },
    { id: "mamamoo-wheein",   spotifyArtistId: "0BqRGrwqndrtNkojXiqIzL", label: "Wheein",   type: "solo", family: "mamamoo" },
    { id: "mamamoo-hwasa",    spotifyArtistId: "7bmYpVgQub656uNTu6qGNQ", label: "Hwasa",    type: "solo", family: "mamamoo" },

    // #endregion
    // #region MONSTA X
    // ─── MONSTA X ─────────────────────────────────────────────────────────────
    {
        id: "monsta-x",
        spotifyArtistId: "4TnGh5PKbSjpYqpIdlW5nz",
        label: "MONSTA X",
        type: "group",
    },
    // MONSTA X — members
    { id: "monsta-x-shownu",   spotifyArtistId: "6bSWLKCL7hFxU0B1BXVfwC", label: "Shownu",   type: "solo", family: "monsta-x" },
    { id: "monsta-x-minhyuk",  spotifyArtistId: "1lnrTVtTQtQS77320ZmX5V", label: "Minhyuk",  type: "solo", family: "monsta-x" },
    { id: "monsta-x-kihyun",   spotifyArtistId: "4JITZR64T7ws0m6VLtC1VK", label: "Kihyun",   type: "solo", family: "monsta-x" },
    { id: "monsta-x-hyungwon", spotifyArtistId: "2X7BGapA7C4ELFcpFWNNTx", label: "Hyungwon", type: "solo", family: "monsta-x" },
    { id: "monsta-x-joohoney", spotifyArtistId: "4rpOWirhzqN7NPgRX76l1k", label: "Joohoney", type: "solo", family: "monsta-x" },
    { id: "monsta-x-im",       spotifyArtistId: "49tkHHS0mXwa5eLYvyvKyd", label: "I.M",      type: "solo", family: "monsta-x" },

    // #endregion
    // #region NCT (parent)
    // ─── NCT (parent) ─────────────────────────────────────────────────────────
    {
        id: "nct",
        spotifyArtistId: "",
        label: "NCT",
        type: "group",
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
        subunits: [
            "0W0w607z3JEA1vXLz9FVGw", // NCT DoJaeJung (Doyoung, Jaehyun, Jungwoo)
        ],
    },
    // NCT 127 — members
    { id: "nct-127-johnny",  spotifyArtistId: "7oWUU7t60DhuzG3vjs7HV6", label: "Johnny",  type: "solo", family: "nct-127" },
    { id: "nct-127-taeyong", spotifyArtistId: "6SKusTjOAPsTZ6kareKQdm", label: "Taeyong", type: "solo", family: "nct-127" },
    { id: "nct-127-yuta",    spotifyArtistId: "4WndMgZGitK4uQdKcmVHua", label: "Yuta",    type: "solo", family: "nct-127" },
    { id: "nct-127-doyoung", spotifyArtistId: "5IMXUzbeAyevQmvtOhXQGi", label: "Doyoung", type: "solo", family: "nct-127" },
    { id: "nct-127-jaehyun", spotifyArtistId: "0qQI2kmsvSe2ex9k94T5vu", label: "Jaehyun", type: "solo", family: "nct-127" },
    { id: "nct-127-jungwoo", spotifyArtistId: "26ECn7DzgrUo23kSC9KD7k", label: "Jungwoo", type: "solo", family: "nct-127" },
    { id: "nct-127-mark",    spotifyArtistId: "70DFixYAFPv4Pf9kgSfR9O", label: "Mark",    type: "solo", family: "nct-127" },
    { id: "nct-127-haechan", spotifyArtistId: "1pHMYguhayIoXmPjoOUyu3", label: "Haechan", type: "solo", family: "nct-127" },

    // #endregion
    // #region NCT Dream
    // ─── NCT Dream ────────────────────────────────────────────────────────────
    {
        id: "nct-dream",
        spotifyArtistId: "1gBUSTR3TyDdTVFIaQnc02",
        label: "NCT Dream",
        type: "group",
        family: "nct",
    },
    // NCT Dream — members (confirmed; Renjun, Jaemin, Chenle, Jisung N/A)
    // Mark and Haechan share entries with NCT 127
    { id: "nct-dream-jeno", spotifyArtistId: "3DZrLuJOQFKqV2sjMsKb1V", label: "Jeno", type: "solo", family: "nct-dream" },

    // #endregion
    // #region NCT WISH
    // ─── NCT WISH ─────────────────────────────────────────────────────────────
    {
        id: "nct-wish",
        spotifyArtistId: "4FqmqIspLaUGtxAFFLsZxc",
        label: "NCT WISH",
        type: "group",
        family: "nct",
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
    },
    // NewJeans — members (confirmed; Minji, Haerin, Hyein N/A)
    { id: "newjeans-hanni",    spotifyArtistId: "14E7RzXOsb9iMithqexVOd", label: "Hanni",    type: "solo", family: "newjeans" },
    { id: "newjeans-danielle", spotifyArtistId: "3BNhPTiKBExlE45mYeC9YY", label: "Danielle", type: "solo", family: "newjeans" },

    // #endregion
    // #region Red Velvet
    // ─── Red Velvet ───────────────────────────────────────────────────────────
    {
        id: "red-velvet",
        spotifyArtistId: "1z4g3DjTBBZKhvAroFlhOM",
        label: "Red Velvet",
        type: "group",
    },
    // Red Velvet — members
    { id: "red-velvet-irene",  spotifyArtistId: "1FCug8HMxqearaZB5qwWQj", label: "Irene",  type: "solo", family: "red-velvet" },
    { id: "red-velvet-seulgi", spotifyArtistId: "2QM5S4yO6xHgnNvF0nbZZq", label: "Seulgi", type: "solo", family: "red-velvet" },
    { id: "red-velvet-wendy",  spotifyArtistId: "0FRUZvZNPzM3YJMABJxf2K", label: "Wendy",  type: "solo", family: "red-velvet" },
    { id: "red-velvet-joy",    spotifyArtistId: "0sYpJ0nCC8AlDrZFeAA7ub", label: "Joy",    type: "solo", family: "red-velvet" },
    { id: "red-velvet-yeri",   spotifyArtistId: "4xzwjGxzfKglU0cNW4q4l1", label: "Yeri",   type: "solo", family: "red-velvet" },

    // #endregion
    // #region SEVENTEEN
    // ─── SEVENTEEN ────────────────────────────────────────────────────────────
    {
        id: "seventeen",
        spotifyArtistId: "7nqOGRxlXj7N2JYbgNEjYH",
        label: "SEVENTEEN",
        type: "group",
        subunits: [
            "7GvlsjcgBrsE578yghOq7D", // JxW
            "1uAT5bTSp6dWbNmixIUP5t", // BSS
            "4wBjmEkWhY4T22q00CiF5V", // DxS
            "7kjuLdYbtTkWBToMu2ebZN", // CxM
            "1EReYiseDwE51FzGm7EK9n", // HxW
        ],
    },
    // SEVENTEEN — members (confirmed; S.Coups N/A)
    { id: "seventeen-jeonghan",  spotifyArtistId: "6KDLlQYeeqUe5OQ2JrdNzF", label: "Jeonghan",  type: "solo", family: "seventeen" },
    { id: "seventeen-joshua",    spotifyArtistId: "74AwWFYdjQ3ER5vHO4H7b0", label: "Joshua",    type: "solo", family: "seventeen" },
    { id: "seventeen-jun",       spotifyArtistId: "38Gn0ZVC8TQwuaMxBK1yRV", label: "Jun",       type: "solo", family: "seventeen" },
    { id: "seventeen-hoshi",     spotifyArtistId: "6nWKAdMv1BDq1zHfZzkdbR", label: "Hoshi",     type: "solo", family: "seventeen" },
    { id: "seventeen-wonwoo",    spotifyArtistId: "3rHcBT06Vb1XGVUWhDALZt", label: "Wonwoo",    type: "solo", family: "seventeen" },
    { id: "seventeen-woozi",     spotifyArtistId: "4TdiASPlU3QdZvGQBothcQ", label: "Woozi",     type: "solo", family: "seventeen" },
    { id: "seventeen-dk",        spotifyArtistId: "4l7mkcB0cZgIQrcd2AsQI3", label: "DK",        type: "solo", family: "seventeen" },
    { id: "seventeen-mingyu",    spotifyArtistId: "5gUpo0BRmo6EOTbyU3z5Ay", label: "Mingyu",    type: "solo", family: "seventeen" },
    { id: "seventeen-the8",      spotifyArtistId: "4DqFd6XE3dX4LWXHJVVpLk", label: "The8",      type: "solo", family: "seventeen" },
    { id: "seventeen-seungkwan", spotifyArtistId: "0Vb2DjojEYsasFpc3aTZb6", label: "Seungkwan", type: "solo", family: "seventeen" },
    { id: "seventeen-vernon",    spotifyArtistId: "2Y34b9AOK30zXgL7cAH4NG", label: "Vernon",    type: "solo", family: "seventeen" },
    { id: "seventeen-dino",      spotifyArtistId: "5YaeXxzvqGNBCguELlKo6G", label: "Dino",      type: "solo", family: "seventeen" },

    // #endregion
    // #region SHINee
    // ─── SHINee ───────────────────────────────────────────────────────────────
    {
        id: "shinee",
        spotifyArtistId: "2hRQKC0gqlZGPrmUKbcchR",
        label: "SHINee",
        type: "group",
    },
    // SHINee — members
    { id: "shinee-onew",     spotifyArtistId: "7sZ5ipSoboWdqXkdj6AXHo", label: "Onew",     type: "solo", family: "shinee" },
    { id: "shinee-key",      spotifyArtistId: "6XXKPxRX2WWPPtfodzpc2v", label: "Key",      type: "solo", family: "shinee" },
    { id: "shinee-jonghyun", spotifyArtistId: "5rGgflnIpRNizTCozbYBuY", label: "Jonghyun", type: "solo", family: "shinee" },
    { id: "shinee-minho",    spotifyArtistId: "08uRwDeNv1d7FSwlOUZdSn", label: "Minho",    type: "solo", family: "shinee" },
    { id: "shinee-taemin",   spotifyArtistId: "13rF01aOogvnkuQXOlgTW8", label: "Taemin",   type: "solo", family: "shinee" },

    // #endregion
    // #region Stray Kids
    // ─── Stray Kids ───────────────────────────────────────────────────────────
    {
        id: "stray-kids",
        spotifyArtistId: "2dIgFjalVxs4ThymZ67YCE",
        label: "Stray Kids",
        type: "group",
    },
    // Stray Kids — members
    { id: "stray-kids-bang-chan", spotifyArtistId: "5jRUIqBSxmsBPNiEwKUjgZ", label: "Bang Chan", type: "solo", family: "stray-kids" },
    { id: "stray-kids-lee-know",  spotifyArtistId: "04jivE3Ek7Xu8WSGVmEqUn", label: "Lee Know",  type: "solo", family: "stray-kids" },
    { id: "stray-kids-changbin",  spotifyArtistId: "3XSid6KaiKoMAVZs2ug3yw", label: "Changbin",  type: "solo", family: "stray-kids" },
    { id: "stray-kids-hyunjin",   spotifyArtistId: "0ymFDpsRImjK673AGgFBcg", label: "Hyunjin",   type: "solo", family: "stray-kids" },
    { id: "stray-kids-han",       spotifyArtistId: "46YvTuKiPBUu5KP9818J2F", label: "Han",       type: "solo", family: "stray-kids" },
    { id: "stray-kids-felix",     spotifyArtistId: "4UIOuc84ExWojcUzFGtb8W", label: "Felix",     type: "solo", family: "stray-kids" },
    { id: "stray-kids-seungmin",  spotifyArtistId: "2nTtulf6WM0raQcIbzYJuf", label: "Seungmin",  type: "solo", family: "stray-kids" },
    { id: "stray-kids-in",        spotifyArtistId: "1odvXbzhdzNajv6un9x5Mc", label: "I.N",       type: "solo", family: "stray-kids" },

    // #endregion
    // #region Super Junior
    // ─── Super Junior ─────────────────────────────────────────────────────────
    {
        id: "super-junior",
        spotifyArtistId: "6gzXCdfYfFe5XKhPKkYqxV",
        label: "Super Junior",
        type: "group",
    },
    // Super Junior — members (confirmed; Shindong, Kibum N/A)
    { id: "super-junior-leeteuk",  spotifyArtistId: "1rVpXgPDVeUXPKKqVEnAGb", label: "Leeteuk",  type: "solo", family: "super-junior" },
    { id: "super-junior-heechul",  spotifyArtistId: "7GbN8yzIP7CFK5bNbUi6L3", label: "Heechul",  type: "solo", family: "super-junior" },
    { id: "super-junior-yesung",   spotifyArtistId: "4hyF8Vtc73RYJr3RgTE2Zf", label: "Yesung",   type: "solo", family: "super-junior" },
    { id: "super-junior-sungmin",  spotifyArtistId: "2O46GIp2cr4sZaVPcP0ket", label: "Sungmin",  type: "solo", family: "super-junior" },
    { id: "super-junior-eunhyuk",  spotifyArtistId: "4QRqp8zf5JtqaMk2OOU3NX", label: "Eunhyuk",  type: "solo", family: "super-junior" },
    { id: "super-junior-donghae",  spotifyArtistId: "4TSRZ3mVg0Lu0qmtJPiPEY", label: "Donghae",  type: "solo", family: "super-junior" },
    { id: "super-junior-siwon",    spotifyArtistId: "2rg9fZFK6wnlbRKUv7zkht", label: "Siwon",    type: "solo", family: "super-junior" },
    { id: "super-junior-ryeowook", spotifyArtistId: "0fwfMuz3AmWRy2pyM5fDRo", label: "Ryeowook", type: "solo", family: "super-junior" },
    { id: "super-junior-kyuhyun",  spotifyArtistId: "0il5ZP3xYOECtONJtZ38Ln", label: "Kyuhyun",  type: "solo", family: "super-junior" },

    // #endregion
    // #region TXT
    // ─── TXT ──────────────────────────────────────────────────────────────────
    {
        id: "txt",
        spotifyArtistId: "0ghlgldX5Dd6720Q3qFyQB",
        label: "TOMORROW X TOGETHER",
        type: "group",
    },
    // TXT — members (confirmed; Huening Kai N/A)
    { id: "txt-yeonjun", spotifyArtistId: "2Mo2yHjmrDRZW7yRuJwR2w", label: "Yeonjun", type: "solo", family: "txt" },
    { id: "txt-soobin",  spotifyArtistId: "03TzGrcj9wA6OShCB1chZX", label: "Soobin",  type: "solo", family: "txt" },
    { id: "txt-beomgyu", spotifyArtistId: "69vfchlzopPm72nD2elXCH", label: "Beomgyu", type: "solo", family: "txt" },
    { id: "txt-taehyun", spotifyArtistId: "1kpVcaBKejm2ZrLYZkKdM8", label: "Taehyun", type: "solo", family: "txt" },

    // #endregion
    // #region TWICE
    // ─── TWICE ────────────────────────────────────────────────────────────────
    {
        id: "twice",
        spotifyArtistId: "7n2Ycct7Beij7Dj7meI4X0",
        label: "TWICE",
        type: "group",
    },
    // TWICE — members (confirmed; Jeongyeon N/A)
    { id: "twice-nayeon",    spotifyArtistId: "1VwDG9aBflQupaFNjUru9A", label: "Nayeon",    type: "solo", family: "twice" },
    { id: "twice-momo",      spotifyArtistId: "6om1UeevPLC4yhlUrsxdiu", label: "Momo",      type: "solo", family: "twice" },
    { id: "twice-sana",      spotifyArtistId: "4a4zvpQq5Phxr12Pu8Akmm", label: "Sana",      type: "solo", family: "twice" },
    { id: "twice-jihyo",     spotifyArtistId: "7F1iAHRYxR3MY7yAEuFqgL", label: "Jihyo",     type: "solo", family: "twice" },
    { id: "twice-mina",      spotifyArtistId: "4oy2bSvGHRtPW7Wn9ijR12", label: "Mina",      type: "solo", family: "twice" },
    { id: "twice-dahyun",    spotifyArtistId: "2WfpdUGuiHssM0oAxRYhxq", label: "Dahyun",    type: "solo", family: "twice" },
    { id: "twice-chaeyoung", spotifyArtistId: "0qtqWLjAkheu9MaVCQ3FXa", label: "Chaeyoung", type: "solo", family: "twice" },
    { id: "twice-tzuyu",     spotifyArtistId: "1arCVYXeStgCY2UazBNBLK", label: "Tzuyu",     type: "solo", family: "twice" },

    // #endregion
    // #region VIXX
    // ─── VIXX ─────────────────────────────────────────────────────────────────
    {
        id: "vixx",
        spotifyArtistId: "5BkB3rXc0qIdUtuEnhbK0A",
        label: "VIXX",
        type: "group",
    },
    // VIXX — members (confirmed; Hongbin N/A)
    { id: "vixx-n",    spotifyArtistId: "5CaZ33OaNU8Cmlzy331GQd", label: "N",    type: "solo", family: "vixx" },
    { id: "vixx-leo",  spotifyArtistId: "3ioQ8ESGz5P413c69gikh8", label: "Leo",  type: "solo", family: "vixx" },
    { id: "vixx-ken",  spotifyArtistId: "08fiOzXWHTizuWGyS1dWu6", label: "Ken",  type: "solo", family: "vixx" },
    { id: "vixx-ravi", spotifyArtistId: "42xj5mBLvrFdW6tYns6mxs", label: "Ravi", type: "solo", family: "vixx" },
    { id: "vixx-hyuk", spotifyArtistId: "1WTpKxdwQrNsYW3MBJYwiG", label: "Hyuk", type: "solo", family: "vixx" },

    // #endregion
    // #region WayV
    // ─── WayV ─────────────────────────────────────────────────────────────────
    {
        id: "wayv",
        spotifyArtistId: "1qBsABYUrxg9afpMtyoFKz",
        label: "WayV",
        type: "group",
        family: "nct",
    },
    // WayV — members (confirmed; WinWin, Lucas N/A)
    { id: "wayv-kun",      spotifyArtistId: "4s2DuSSi7Puz6PGgCE8pKi", label: "Kun",      type: "solo", family: "wayv" },
    { id: "wayv-ten",      spotifyArtistId: "3Q5Qep7ytrjVleNnMnntgQ", label: "Ten",      type: "solo", family: "wayv" },
    { id: "wayv-xiaojun",  spotifyArtistId: "51kPKCSzbLwEQFFwhfS4R7", label: "Xiaojun",  type: "solo", family: "wayv" },
    { id: "wayv-hendery",  spotifyArtistId: "5wrZ59w1ndSBlPeUj2f6Fs", label: "Hendery",  type: "solo", family: "wayv" },
    { id: "wayv-yangyang", spotifyArtistId: "5yyf4YDCKGaa71SC7KRw2L", label: "Yangyang", type: "solo", family: "wayv" },
    // #endregion
    // #region &Team
    // ─── &Team ────────────────────────────────────────────────────────────────
    //&Team
    {
        id: "&team",
        spotifyArtistId: "2xfxRiKxoHl5tI0MKyvqV7",
        label: "&Team",
        type: "group",
        family: "",
    },
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

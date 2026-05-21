type ArtistRegistry = {
    id: string;
    spotifyArtistId: string;
    label: string;
    type: "solo" | "group";
    memberSpotifyArtistIds: string[] | null;
    aliases?: string[] | null;
};

export const artistRegistry: ArtistRegistry[] = [
    // 2NE1
    {
        id: "2ne1",
        spotifyArtistId: "1l0mKo96Jh9HVYONcRl3Yp",
        label: "2NE1",
        type: "group",
        memberSpotifyArtistIds: [
            "0tzSBCPJZmHTdOA3ZV2mN3", // CL
            "1ql28OzmgulHG2ldXFrbWp", // Minzy
            "3uHb6dRazmcaT15bMexUtt", // Park Bom
            "3LKVw6XQYcot0OZMFmf4IP"  // Sandara Park
        ]
    },
    // 2PM
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
            "0Xysc1acrmF3w8vMvmSUPW"  // Chansung
        ]
    },
    // aespa
    {
        id: "aespa",
        spotifyArtistId: "6YVMFz59CuY7ngCxTxjpxE",
        label: "aespa",
        type: "group",
        memberSpotifyArtistIds: [
            "2qwDjeSYANOOBFU8jwtBXx", // Karina
            "2P1id80CMwR5R5cwcyIIAi", // Giselle
            "3mPquBmMu97Iq9TpzQ6ayI", // Winter
            "5t1uryofgueHrjrryqX8vM"  // Ningning
        ]
    },
    // ASTRO
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
            "6zLERXpqnnXhEnhva48jKW"  // Sanha
        ]
    },
    // ATEEZ
    {
        id: "ateez",
        spotifyArtistId: "68KmkJeZGfwe1OUaivBa2L",
        label: "ATEEZ",
        type: "group",
        memberSpotifyArtistIds: [
            "3MZLSgcd5kOdhrZasDMecx", // Hongjoong
            "3TkRPyC9kz1wSRIkzUfVgL", // Seonghwa
            "0rFEZFoYNIa37Ad40mCuDq", // Yunho
            "",                         // Yeosang
            "",                         // San
            "3ZHodgUsqkIUsek6ke65bO", // Mingi
            "5in2h2c2DWNHKzgZo9OnVO", // Wooyoung
            "5gecqU5FZgxVdz1AtLumT0"  // Jongho
        ]
    },
    // B.A.P
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
            "2N5L6zU0bi3q8AdJpNW1z3"  // Zelo
        ]
    },
    // BIGBANG
    {
        id: "bigbang",
        spotifyArtistId: "4Kxlr1PRlDKEB0ekOCyHgX",
        label: "BIGBANG",
        type: "group",
        memberSpotifyArtistIds: [
            "30b9WulBM8sFuBo17nNq9c", // G-Dragon
            "4yiB30K5scGkjmAgHGIH8Y", // T.O.P
            "6udveWUgX4vu75FF0DTrXV", // Taeyang
            "1OQxmfKN9UG5C7nr4MkasO"  // Daesung
        ]
    },
    // BLACKPINK
    {
        id: "blackpink",
        spotifyArtistId: "41MozSoPIsD1dJM0CLPjZF",
        label: "BLACKPINK",
        type: "group",
        memberSpotifyArtistIds: [
            "6UZ0ba50XreR4TM8u322gs", // Jisoo
            "250b0Wlc5Vk0CoUsaCY84M", // Jennie
            "3eVa5w3URK5duf6eyVDbu9", // Rosé
            "5L1lO4eRHmJ7a0Q6csE5cT"  // Lisa
        ]
    },
    // BTS
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
            "6HaGTQPmzraVmaVxvz6EUc"  // Jungkook
        ]
    },
    // ENHYPEN
    {
        id: "enhypen",
        spotifyArtistId: "5t5FqBwTcgKTaWmfEbwQY9",
        label: "ENHYPEN",
        type: "group",
        memberSpotifyArtistIds: [
            "7EdcoPac2uNwICfR9glXLF", // Jungwon
            "6dNavn0Wr11k0fRVlbEi3D", // Heeseung
            "1dxyDekkPqYVKpC7iW71zJ", // Jay
            "",                         // Jake
            "",                         // Sunghoon
            "",                         // Sunoo
            ""                          // Ni-ki
        ]
    },
    // EXO
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
            ""                          // Sehun
        ]
    },
    // f(x)
    {
        id: "fx",
        spotifyArtistId: "3wRA5UYoo08BBKJnzyKkpF",
        label: "f(x)",
        type: "group",
        memberSpotifyArtistIds: [
            "",                         // Victoria
            "",                         // Amber
            "56HZvtrzD82YKMGGJTlIG2", // Luna
            "3qYt5zzf9B414wKsDhrtaO"  // Krystal
        ]
    },
    // (G)I-DLE
    {
        id: "gidle",
        spotifyArtistId: "2AfmfGFbe0A0WsTYm0SDTx",
        label: "(G)I-DLE",
        type: "group",
        memberSpotifyArtistIds: [
            "6Xg22wJOAcnvPUfk5WvODH", // Soyeon
            "2pHkxVNynHBwQHhGaoBIXX", // Minnie
            "",                         // Miyeon
            "22aCD8IrQZjcPgZw728QT6", // Yuqi
            ""                          // Shuhua
        ]
    },
    // Girls' Generation
    {
        id: "girls-generation",
        spotifyArtistId: "0Sadg1vgvaPqGTOjxu0N6c",
        label: "Girls' Generation",
        type: "group",
        memberSpotifyArtistIds: [
            "3qNVuliS40BLgXGxhdBdqu", // Taeyeon
            "2tYCDP6T15g9q19vIlh7vV", // Sunny
            "4C3uGP8vRDzxrhJxZiOjTe", // Tiffany
            "",                         // Hyoyeon
            "2TMRvcwsmvVhvuEbKVEbZe", // Yuri
            "",                         // Sooyoung
            "",                         // Yoona
            "5uM1Et50auro2hTS6ZLcmT"  // Seohyun
        ]
    },
    // GOT7
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
            "3ohXmy1PGdB3XgzhPqQ0tY"  // Yugyeom
        ]
    },
    // Highlight
    {
        id: "highlight",
        spotifyArtistId: "3T0fMfxYBU3q9oAUAdPIsr",
        label: "Highlight",
        type: "group",
        memberSpotifyArtistIds: [
            "",                         // Yoon Doojoon
            "4drjiBRSqZoTD67xgZCmNo", // Yong Junhyung
            "1fwMtpwCEJovQuyxSuHcAd", // Yang Yoseob
            "3CC7p9QM4VjO62rmcaRP3z", // Lee Kikwang
            ""                          // Son Dongwoon
        ]
    },
    // INFINITE
    {
        id: "infinite",
        spotifyArtistId: "1bkpTEmumLC3xc7HgMsttU",
        label: "INFINITE",
        type: "group",
        memberSpotifyArtistIds: [
            "",                         // Sunggyu
            "2AK8mEsvIRVd6biBapWe3o", // Dongwoo
            "",                         // Woohyun
            "3bGzcepRQ7Zu1J6JDDAq1T", // Hoya
            "",                         // Sungyeol
            "2Vm2JJpUJzLoBEYQEVrmdV", // L
            ""                          // Sungjong
        ]
    },
    // ITZY
    {
        id: "itzy",
        spotifyArtistId: "2KC9Qb60EaY0kW4eH68vr3",
        label: "ITZY",
        type: "group",
        memberSpotifyArtistIds: [
            "3skli1w2n0nOZ4qkDbvV2m", // Yeji
            "19Io533x1pKQu6ZuisGek5", // Lia
            "",                         // Ryujin
            "73nPXEFs9tGCNmSOcqFHPs", // Chaeryeong
            "6FsEIvsTuqjpejg2jDbYdv"  // Yuna
        ]
    },
    // IVE
    {
        id: "ive",
        spotifyArtistId: "6RHTUrRF63xao58xh9FXYJ",
        label: "IVE",
        type: "group",
        memberSpotifyArtistIds: [
            "",                         // Yujin
            "",                         // Gaeul
            "5s3Ys2jpFZD2t4bivtHG2q", // Rei
            "",                         // Wonyoung
            "2Cl2zS9nttS8xQeCp7zYT1", // Liz
            ""                          // Leeseo
        ]
    },
    // LE SSERAFIM
    {
        id: "le-sserafim",
        spotifyArtistId: "4SpbR6yFEvexJuaBpgAU5p",
        label: "LE SSERAFIM",
        type: "group",
        memberSpotifyArtistIds: [
            "",                         // Sakura
            "39j6wByxxNDb92rODch4mT", // Chaewon
            "13yWtUnz63q5VIs5SwoMhy", // Yunjin
            "",                         // Kazuha
            ""                          // Eunchae
        ]
    },
    // MAMAMOO
    {
        id: "mamamoo",
        spotifyArtistId: "0XATRDCYuuGhk0oE7C0o5G",
        label: "MAMAMOO",
        type: "group",
        memberSpotifyArtistIds: [
            "5cYcI546S8Lf97m4mNdYLD", // Solar
            "1eTft3tXynrKdo6XD7QHLL", // Moonbyul
            "0BqRGrwqndrtNkojXiqIzL", // Wheein
            "7bmYpVgQub656uNTu6qGNQ"  // Hwasa
        ]
    },
    // MONSTA X
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
            ""                          // I.M
        ]
    },
    // NCT 127
    {
        id: "nct-127",
        spotifyArtistId: "7f4ignuCJhLXfZ9giKT7rH",
        label: "NCT 127",
        type: "group",
        memberSpotifyArtistIds: [
            //"1z0Hi3myYw4x32xCq0H3aq", // Taeil
            "7oWUU7t60DhuzG3vjs7HV6", // Johnny
            "6SKusTjOAPsTZ6kareKQdm", // Taeyong
            "4WndMgZGitK4uQdKcmVHua", // Yuta
            "5IMXUzbeAyevQmvtOhXQGi", // Doyoung
            "0qQI2kmsvSe2ex9k94T5vu", // Jaehyun
            "",                         // Jungwoo
            "70DFixYAFPv4Pf9kgSfR9O", // Mark
            "1pHMYguhayIoXmPjoOUyu3"  // Haechan
        ]
    },
    // NCT Dream
    {
        id: "nct-dream",
        spotifyArtistId: "1gBUSTR3TyDdTVFIaQnc02",
        label: "NCT Dream",
        type: "group",
        memberSpotifyArtistIds: [
            "70DFixYAFPv4Pf9kgSfR9O", // Mark
            "",                         // Renjun
            "3DZrLuJOQFKqV2sjMsKb1V", // Jeno
            "1pHMYguhayIoXmPjoOUyu3", // Haechan
            "",                         // Jaemin
            "",                         // Chenle
            ""                          // Jisung
        ]
    },
    // NCT WISH
    {
        id: "nct-wish",
        spotifyArtistId: "4FqmqIspLaUGtxAFFLsZxc",
        label: "NCT WISH",
        type: "group",
        memberSpotifyArtistIds: [
            "", // Sion
            "", // Riku
            "", // Yushi
            "", // Sakuya
            "", // Jaehee
            ""  // Shotaro
        ]
    },
    // NewJeans
    {
        id: "newjeans",
        spotifyArtistId: "6HvZYsbFfjnjFrWF950C9d",
        label: "NewJeans",
        type: "group",
        memberSpotifyArtistIds: [
            "",                         // Minji
            "14E7RzXOsb9iMithqexVOd", // Hanni
            "3BNhPTiKBExlE45mYeC9YY", // Danielle
            "",                         // Haerin
            ""                          // Hyein
        ]
    },
    // Red Velvet
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
            "4xzwjGxzfKglU0cNW4q4l1"  // Yeri
        ]
    },
    // SEVENTEEN
    {
        id: "seventeen",
        spotifyArtistId: "7nqOGRxlXj7N2JYbgNEjYH",
        label: "SEVENTEEN",
        type: "group",
        memberSpotifyArtistIds: [
            "",                         // S.Coups
            "6KDLlQYeeqUe5OQ2JrdNzF", // Jeonghan
            "74AwWFYdjQ3ER5vHO4H7b0", // Joshua
            "38Gn0ZVC8TQwuaMxBK1yRV", // Jun
            "6nWKAdMv1BDq1zHfZzkdbR", // Hoshi
            "3rHcBT06Vb1XGVUWhDALZt", // Wonwoo
            "4TdiASPlU3QdZvGQBothcQ", // Woozi
            "4l7mkcB0cZgIQrcd2AsQI3", // DK
            "",                         // Mingyu
            "",                         // The8
            "0Vb2DjojEYsasFpc3aTZb6", // Seungkwan
            "2Y34b9AOK30zXgL7cAH4NG", // Vernon
            "5YaeXxzvqGNBCguELlKo6G"  // Dino
        ]
    },
    // SHINee
    {
        id: "shinee",
        spotifyArtistId: "2hRQKC0gqlZGPrmUKbcchR",
        label: "SHINee",
        type: "group",
        memberSpotifyArtistIds: [
            "7sZ5ipSoboWdqXkdj6AXHo", // Onew
            "6XXKPxRX2WWPPtfodzpc2v", // Key
            "5rGgflnIpRNizTCozbYBuY", // Jonghyun
            "",                         // Minho
            "13rF01aOogvnkuQXOlgTW8"  // Taemin
        ]
    },
    // Stray Kids
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
            "1odvXbzhdzNajv6un9x5Mc"  // I.N
        ]
    },
    // Super Junior
    {
        id: "super-junior",
        spotifyArtistId: "6gzXCdfYfFe5XKhPKkYqxV",
        label: "Super Junior",
        type: "group",
        memberSpotifyArtistIds: [
            "1rVpXgPDVeUXPKKqVEnAGb", // Leeteuk
            "7GbN8yzIP7CFK5bNbUi6L3", // Heechul
            "4hyF8Vtc73RYJr3RgTE2Zf", // Yesung
            "",                         // Shindong
            "2O46GIp2cr4sZaVPcP0ket", // Sungmin
            "4QRqp8zf5JtqaMk2OOU3NX", // Eunhyuk
            "4TSRZ3mVg0Lu0qmtJPiPEY", // Donghae
            "2rg9fZFK6wnlbRKUv7zkht", // Siwon
            "0fwfMuz3AmWRy2pyM5fDRo", // Ryeowook
            "",                         // Kibum
            "0il5ZP3xYOECtONJtZ38Ln"  // Kyuhyun
        ]
    },
    // TXT
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
            ""                          // Huening Kai
        ]
    },
    // TWICE
    {
        id: "twice",
        spotifyArtistId: "7n2Ycct7Beij7Dj7meI4X0",
        label: "TWICE",
        type: "group",
        memberSpotifyArtistIds: [
            "1VwDG9aBflQupaFNjUru9A", // Nayeon
            "",                         // Jeongyeon
            "6om1UeevPLC4yhlUrsxdiu", // Momo
            "4a4zvpQq5Phxr12Pu8Akmm", // Sana
            "7F1iAHRYxR3MY7yAEuFqgL", // Jihyo
            "4oy2bSvGHRtPW7Wn9ijR12", // Mina
            "2WfpdUGuiHssM0oAxRYhxq", // Dahyun
            "0qtqWLjAkheu9MaVCQ3FXa", // Chaeyoung
            "1arCVYXeStgCY2UazBNBLK"  // Tzuyu
        ]
    },
    // VIXX
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
            "",                         // Hongbin
            "1WTpKxdwQrNsYW3MBJYwiG"  // Hyuk
        ]
    },
    // WayV
    {
        id: "wayv",
        spotifyArtistId: "1qBsABYUrxg9afpMtyoFKz",
        label: "WayV",
        type: "group",
        memberSpotifyArtistIds: [
            "4s2DuSSi7Puz6PGgCE8pKi", // Kun
            "3Q5Qep7ytrjVleNnMnntgQ", // Ten
            "",                         // WinWin
            "",                         // Lucas
            "51kPKCSzbLwEQFFwhfS4R7", // Xiaojun
            "5wrZ59w1ndSBlPeUj2f6Fs", // Hendery
            ""                          // Yangyang
        ]
    },
];

// TODO: make sure each is unique (even by 1 value?)

let game = (_ => {
    return Bagel.init({
        id: "NFT-Generator",
        state: "main",
        vars: {
            generateNFTs: (count, size, valueRange) => {
                size /= 100;
                let valueMultiple = valueRange[1] - valueRange[0];
                let valueAdd = valueRange[0];

                let colors = [];
                let values = [];
                let i = 0;
                while (i < count) {
                    let a = 0;
                    while (a < 4) {
                        let c = 0;
                        while (c < 3) {
                            colors.push(Math.round(Math.random() * 255));
                            c++;
                        }
                        a++;
                    }

                    values.push(Math.round((Math.random() * valueMultiple) + valueAdd));
                    i++;
                }

                return JSON.stringify({
                    size: size,
                    variations: count,
                    colors: colors,
                    values: values
                });
            },
            displayNFTs: (img, data) => {
                let size = data.size * Math.min(img.width, img.height);
                let a = 0;
                let i = 0;
                while (i < data.variations) {
                    let canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    let ctx = canvas.getContext("2d");
                    ctx.imageSmoothingEnabled = false;
                    canvas.className = "NFT";

                    ctx.drawImage(img, 0, 0);

                    let right = img.width - size;
                    let bottom = img.height - size;
                    let positions = [
                        [0, 0],
                        [right, 0],
                        [0, bottom],
                        [right, bottom]
                    ];

                    for (let c in positions) {
                        let pos = positions[c];

                        ctx.fillStyle = "rgb(" + data.colors.slice(a, a + 3) + ")";
                        ctx.fillRect(pos[0], pos[1], size, size);
                        a += 3;
                    }

                    document.body.appendChild(canvas);

                    i++;
                }
                game.internal.renderer.canvas.remove();
            }
        },
        game: {
            assets: {
                imgs: [
                    {
                        id: "Upload",
                        src: "assets/imgs/upload.png"
                    },
                    {
                        id: "Download",
                        src: "assets/imgs/download.png"
                    }
                ]
            },
            plugins: [
                {
                    src: "assets/plugins/gui.js"
                }
            ],
            sprites: [
                {
                    type: "GUI",
                    id: "Menu",
                    submenu: "main",
                    submenus: {
                        main: {
                            hoverText: {
                                color: "white"
                            },
                            elements: [
                                {
                                    type: "button",
                                    onClick: _ => {
                                        game.input.mouse.down = false;
                                        let offset = parseInt(prompt("Enter an offset for the index in the file names...", 0));
                                        let count = parseInt(prompt("How many do you want to generate?", 1));
                                        let countEach = parseInt(prompt("How many do you want to generate for each?", 25));
                                        let pixelSize = parseInt(prompt("What size pixel? (as a percentage of the minimum dimension)", 15));
                                        let minValue = parseInt(prompt("What's the minimum price for one of these?", 200));
                                        let maxValue = parseInt(prompt("What's the maximum price for one of these?", 250));


                                        let i = offset;
                                        let c = 0;
                                        while (c < count) {
                                            Bagel.download(
                                                game.vars.generateNFTs(
                                                    countEach,
                                                    pixelSize,
                                                    [minValue, maxValue]
                                                ),
                                                `NFT_data_${i}.json`
                                            );

                                            i++;
                                            c++;
                                        }
                                    },
                                    onHover: "Generate NFT Data...",
                                    color: "yellow",
                                    icon: "Download",
                                    iconSize: 0.6,
                                    size: 150
                                },
                                {
                                    type: "button",
                                    onClick: _ => {
                                        game.input.mouse.down = false;
                                        alert("Upload the base image...");
                                        Bagel.upload(url => {
                                            let img = new Image();
                                            (img => {
                                                img.onload = _ => {
                                                    alert("Now upload the JSON file...");
                                                    Bagel.upload(url => {
                                                        let commaIndex = url.indexOf(",");
                                                        let data = url.slice(commaIndex + 1);
                                                        let info = url.slice(0, commaIndex);
                                                        if (info.includes("base64")) {
                                                            data = atob(data);
                                                        }

                                                        game.vars.displayNFTs(img, JSON.parse(data));
                                                    });
                                                };
                                            })(img);
                                            img.src = url;
                                        });
                                    },
                                    onHover: "Preview some generated data",
                                    color: "green",
                                    icon: "Upload",
                                    iconSize: 0.6,
                                    size: 75,
                                    y: 350
                                }
                            ]
                        }
                    },
                    stateToActivate: "main"
                }
            ]
        },
        width: 800,
        height: 450,
        config: {
            display: {
                backgroundColor: "#202020"
            }
        }
    });
})();

// TODO: make sure each is unique (even by 1 value?)

let game = (_ => {
    return Bagel.init({
        id: "NFT-Generator",
        state: "main",
        vars: {
            generateNFTs: (count, size) => {
                size /= 100;
                let colors = [];
                let i = 0;
                while (i < count) {
                    let cornerColors = [];
                    let a = 0;
                    while (a < 4) {
                        let color = [];
                        let c = 0;
                        while (c < 3) {
                            color.push(Math.round(Math.random() * 255));
                            c++;
                        }

                        /*
                        let lastColor = colors[colors.length - 1];
                        if (lastColor) {
                            lastColor = lastColor[a];
                            let totalDiff = color.reduce((value, accumulator, index) => accumulator + Math.abs(value - lastColor[index]), 0);
                            if (totalDiff < minDiff) { // Too similar, try again
                                continue;
                            }
                        }
                        */

                        cornerColors.push(color);
                        a++;
                    }

                    colors.push(cornerColors);
                    i++;
                }

                return JSON.stringify({
                    size: size,
                    colors: colors
                });
            },
            displayNFTs: (img, data) => {
                let size = data.size * Math.min(img.width, img.height);
                let i = 0;
                while (i < data.colors.length) {
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

                        ctx.fillStyle = "rgb(" + data.colors[i][c] + ")";
                        ctx.fillRect(pos[0], pos[1], size, size);
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
                        src: "../assets/imgs/upload.png"
                    },
                    {
                        id: "Download",
                        src: "../assets/imgs/download.png"
                    }
                ]
            },
            plugins: [
                {
                    src: "../assets/plugins/gui.js"
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
                                        let offset = parseInt(prompt("Enter an offset for the index in the file names...", 0));
                                        let count = parseInt(prompt("How many do you want to generate?", 1));
                                        let countEach = parseInt(prompt("How many do you want to generate for each?", 25));
                                        let pixelSize = parseInt(prompt("What size pixel? (as a percentage of the minimum dimension)", 15));


                                        let i = offset;
                                        let c = 0;
                                        while (c < count) {
                                            Bagel.download(
                                                game.vars.generateNFTs(
                                                    countEach,
                                                    pixelSize
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
                                        game.input.mouse.down = false;
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

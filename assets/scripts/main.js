// TODO: make sure each is unique (even by 1 value?)
// TODO: is the upload even needed?

let game = (_ => {
    return Bagel.init({
        id: "NFT-Generator",
        state: "main",
        vars: {
            generateNFTs: (img, count, size) => {
                size /= 100;
                let colors = [];
                let i = 0;
                while (i < count) {
                    let color = [];
                    let c = 0;
                    while (c < 3) {
                        color.push(Math.round(Math.random() * 255));
                        c++;
                    }

                    colors.push(color);
                    i++;
                }

                return JSON.stringify({
                    size: size,
                    colors: colors
                });
            }
        },
        game: {
            assets: {
                imgs: [
                    {
                        id: "Upload",
                        src: "../assets/imgs/upload.png"
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
                    submenu: "upload",
                    submenus: {
                        upload: {
                            hoverText: {
                                color: "white"
                            },
                            elements: [
                                {
                                    type: "button",
                                    onClick: _ => {
                                        let offset = parseInt(prompt("Enter an offset for the index in the file names...", 0));
                                        Bagel.upload((url, index) => {
                                            index += offset;

                                            let img = new Image();
                                            ((img, index) => {
                                                img.onload = _ => {
                                                    Bagel.download(
                                                        game.vars.generateNFTs(
                                                            img,
                                                            parseInt(prompt("How many do you want to generate?", 25)),
                                                            parseInt(prompt("What size pixel? (as a percentage of the minimum dimension)", 5))
                                                        ),
                                                        `NFT_data_${index}.json`
                                                    );
                                                };
                                            })(img, index);
                                            img.src = url;
                                        }, true);
                                        game.input.mouse.down = false;
                                    },
                                    onHover: "Upload an image (or multiple) to randomise",
                                    color: "yellow",
                                    icon: "Upload",
                                    iconSize: 0.6,
                                    size: 150
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

const pup = require("puppeteer");
let id = "dineniy462@684hh.com";
let pass = "piyush@12345";
let tab;
let fs = require('fs');

async function main() {
    let browser = await pup.launch({
        headless: false,
        defaultViewport: false,
        args: ["--start-fullscreen"]
    });

    let pages = await browser.pages();
    tab = pages[0];
    let pageOpenPromise = await tab.goto("https://www.ebay.com/");

    // SYNCHRONOUS WAIT
    await new Promise(function (resolve, reject) {
        setTimeout(resolve, 400); // or setTimeout(function(){resolve()},5000);
    });

    await tab.waitForSelector("#gh-topl .gh-t #gh-ug a", { visible: true });
    await tab.click("#gh-topl .gh-t #gh-ug a");
    await tab.waitForSelector("#userid", { visible: true });
    // SYNCHRONOUS WAIT
    await new Promise(function (resolve, reject) {
        setTimeout(resolve, 2000);
    });
    // SYNCHRONOUS WAIT
    await new Promise(function (resolve, reject) {
        setTimeout(resolve, 2000);
    });
    // SIGN OPTION
    await tab.type("#userid", id);
    await tab.click("#signin-continue-btn");
    // SYNCHRONOUS WAIT
    await new Promise(function (resolve, reject) {
        setTimeout(resolve, 2000);
    });
    await tab.waitForSelector("#pass", { visible: true });
    await tab.type("#pass", pass);
    await tab.click("#sgnBt");
    await tab.waitForSelector("#gh-ac", { visible: true });

    // SYNCHRONOUS WAIT
    await new Promise(function (resolve, reject) {
        setTimeout(resolve, 2000);
    });
    // SEARCH OPTION
    await tab.type("#gh-ac", "men clothes");
    await tab.click("#gh-btn");
    let descr = ["Cloth_Name", "Price", "Shipping Charges"];

    let finalData = [{
        "Cloth_Name": "",
        "Price": "",
        "Shipping Charges": ""
    }];
    // FETCHING PRODUCT
    await tab.waitForSelector(".s-item__wrapper.clearfix h3", { visible: true });
    let nameData = await tab.$$(".s-item__wrapper.clearfix h3");
    for (let i in nameData) {
        let name = await tab.evaluate(function (ele) {
            return ele.textContent;
        }, nameData[i]);
        finalData[i] = {};
        finalData[i][descr[0]] = name;
    }
    fs.writeFileSync("Cloth_Names.json", JSON.stringify(finalData));

    await tab.waitForSelector(".s-item__price", { visible: true });
    let itemPrice = await tab.$$(".s-item__price");
    for (let i in itemPrice) {
        let price = await tab.evaluate(function (ele) {
            return ele.textContent;
        }, itemPrice[i]);

        finalData[i] = {};
        finalData[i][descr[1]] = price;

    }
    fs.writeFileSync("Prices.json", JSON.stringify(finalData));

    let finalData2=[];
    await tab.waitForSelector(".s-item__logisticsCost", { visible: true });
    let shippingPrice = await tab.$$(".s-item__logisticsCost");
    for (let i in shippingPrice) {
        let price = await tab.evaluate(function (ele) {
            return ele.textContent;
        }, shippingPrice[i]);
        finalData2[i] = {};
        finalData2[i][descr[2]] = price;
    }
    fs.writeFileSync("Shipping Prices.json", JSON.stringify(finalData2));

    // SYNCHRONOUS WAIT
    await new Promise(function (resolve, reject) {
        setTimeout(resolve, 2000);
    });
    // APPLYING FILTER
    for (let i = 1; i <= 5; i++) {
        await tab.waitForSelector(".x-refine__select__svg .checkbox.cbx.x-refine__multi-select-checkbox input", { visible: true });
        let categories = await tab.$$(".x-refine__select__svg .checkbox.cbx.x-refine__multi-select-checkbox input");
        await categories[i].click();
    }
    // SYNCHRONOUS WAIT
    await new Promise(function (resolve, reject) {
        setTimeout(resolve, 2000);
    });
    await tab.waitForSelector("#gh-ug", { visible: true });
    await tab.click("#gh-ug");

    // VIEWING USER PROFILE
    await tab.waitForSelector("#gh-uid", { visible: true });
    await tab.click("#gh-uid");

    await new Promise(function (resolve, reject) {
        setTimeout(resolve, 2000);
    });
    await tab.waitForSelector("#gh-ug", { visible: true });
    await tab.click("#gh-ug");

    // SIGN OUT OPTION
    await tab.waitForSelector("#gh-uo a", { visible: true });
    await tab.click("#gh-uo a");
}

main();

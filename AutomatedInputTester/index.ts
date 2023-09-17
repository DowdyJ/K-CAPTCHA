import puppeteer, { ElementHandle } from "puppeteer"

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


(async () => {
    const TIME_TO_WAIT = 3000;
    const browser = await puppeteer.launch({headless: false});

    let textToType = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    
    try {
        const page = await browser.newPage();
        await page.setViewport({width: 1080, height: 1024});
    
        await page.goto('http://localhost:8080/');
    
        await page.waitForSelector("#textbox");
        await sleep(TIME_TO_WAIT);
        await page.type('#textbox', textToType);
        await sleep(TIME_TO_WAIT);
        await page.click("#submit-data");
        
        await sleep(TIME_TO_WAIT);
        await page.type('#textbox', textToType, { delay: 100 });
        await sleep(TIME_TO_WAIT);
        await page.click("#submit-data");
        await sleep(TIME_TO_WAIT);

        let base = 100
        let variation = 30
        for (const char of textToType) {
            await page.type('#textbox', char);
            await sleep(base + Math.random() * variation)
        }
        await sleep(TIME_TO_WAIT);
        await page.click("#submit-data");
        await sleep(TIME_TO_WAIT);

        base = 100
        variation = 70
        for (const char of textToType) {
            await page.type('#textbox', char);
            await sleep(base + Math.random() * variation)
        }
        await sleep(TIME_TO_WAIT);
        await page.click("#submit-data");
        await sleep(TIME_TO_WAIT);

        await sleep(TIME_TO_WAIT * 10000);
    } 
    catch (error) {
        console.log(error);    
    } 
    finally {
        await browser.close();
    }

  })();


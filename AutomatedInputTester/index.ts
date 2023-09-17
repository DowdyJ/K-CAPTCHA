import puppeteer, { ElementHandle } from "puppeteer"

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


(async () => {
    const TIME_TO_WAIT = 3000;
    const browser = await puppeteer.launch({
        headless: false,
        args: [`--start-maximized`],
        defaultViewport: null
    });

    try {
        const page = await browser.newPage();
        
        await page.goto('http://localhost:8080/');
        await sleep(TIME_TO_WAIT);

        await ((await page.$("#results-area")) as ElementHandle<Element>).scrollIntoView();
        await page.waitForSelector("#textbox");
        await sleep(TIME_TO_WAIT);
        await page.type('#textbox', "This text is an example of typical instant typing used by bots.");
        await sleep(TIME_TO_WAIT);
        await page.click("#submit-data");
        
        await sleep(TIME_TO_WAIT);
        await page.type('#textbox', "This text has a constant delay, a built in feature of the automation software.", { delay: 100 });
        await sleep(TIME_TO_WAIT);
        await page.click("#submit-data");
        await sleep(TIME_TO_WAIT);

        let base = 100
        let variation = 30
        let textToType1 = "This text uses a more sophisticated method which adds random variation to the input.";
        for (const char of textToType1) {
            await page.type('#textbox', char);
            await sleep(base + Math.random() * variation)
        }
        await sleep(TIME_TO_WAIT);
        await page.click("#submit-data");
        await sleep(TIME_TO_WAIT);

        let textToType2 = "This text also adds random variation to the input, but this time even more variation.";
        base = 100
        variation = 70
        for (const char of textToType2) {
            await page.type('#textbox', char);
            await sleep(base + Math.random() * variation)
        }
        await sleep(TIME_TO_WAIT);
        await page.click("#submit-data");
        await sleep(TIME_TO_WAIT);
    } 
    catch (error) {
        console.log(error);    
    } 
    finally {
        await browser.close();
    }

  })();


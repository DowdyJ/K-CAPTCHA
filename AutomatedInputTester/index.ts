import puppeteer, { ElementHandle } from "puppeteer"

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


(async () => {
    const TIME_TO_WAIT = 3000;
    const browser = await puppeteer.launch({headless: false});

    try {
        const page = await browser.newPage();
        await page.setViewport({width: 1080, height: 1024});
    
        await page.goto('http://localhost:8080/');
    
        await page.waitForSelector("#textbox");
        await sleep(TIME_TO_WAIT);
        await page.type('#textbox', 'This text is typed instantly.');
        await sleep(TIME_TO_WAIT);
        await page.waitForSelector("#submit-data");
        await page.click("#submit-data");
        
        await sleep(TIME_TO_WAIT);
        await page.type('#textbox', 'This text is typed slower using pupeteer\'s feature to do so.', { delay: 100 });
        await sleep(TIME_TO_WAIT);
        await page.waitForSelector("#submit-data");
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


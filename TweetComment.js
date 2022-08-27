const puppeteer = require('puppeteer'); // import modul puppeteer with puppeteer name
const readlineSync = require('readline-sync'); // import modul readline-sync with readlineSync name
const fs = require('fs'); // import modul file-sync to read file

(async () => {

    var username = readlineSync.question('username : '); // input username
    var password = readlineSync.question('password : ', { hideEchoBack: true }); // input password, hideEchoBack is for censoring the password
    var tweetlink = readlineSync.question('tweet link : '); // input tweet link

    const kata = fs.readFileSync('./TweetComment.txt', 'utf-8') // input text from TweetComment.txt file into kata variable
    const options = { waitUntil: 'networkidle2' } // waiting for the page fully loaded
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage(); // open new page on chrome driver

    //===================================LOGIN===================================
    await page.goto('https://twitter.com/i/flow/login', options); // go to this URL and wait for the page to fully loaded
    const emailField = await page.$('input[name=text]') // mlooking for <input name='username'> element 
    await emailField.type(username) // input username from CLI input
    await emailField.dispose()

    const [btnNext] = await page.$x("//span[contains(., 'Next')]") // looking for <span> element that has 'Next' string in it
    await btnNext.click() // click Next button
    await btnNext.dispose()
    await page.waitForSelector('.css-901oao') // waiting for .css-901oao selector appear, then execute next line
    //await new Promise(r => setTimeout(r, 2000));  // this code is for waiting or delay the next execution in miliseconds, in this line, the page waiting for 2 seconds to next execution

    const passField = await page.$('input[name=password]') // looking for <input name='password'> element 
    await passField.type(password) // input password from CLI input
    await passField.dispose()

    const [btnLogin] = await page.$x("//span[contains(., 'Log in')]") // looking for <span> element that has 'Log in' string in it
    await btnLogin.click() // click log in button
    await btnLogin.dispose()
    await page.waitForNavigation() // waiting for next URL loaded
    //===================================LOGIN===================================

    if (page.url() == 'https://twitter.com/home') { // condition if success log in and not success
        console.log('Login Sukses')

        await page.goto(tweetlink, options) // go to targeted tweet from CLI input

        for (let i = 0; i < 50; i++) { // start repetitive 
            await page.waitForSelector('.DraftEditor-root') // wait for .DraftEditor-root element to load, a.k.a Reply section

            const commentField = await page.$('div.DraftEditor-root') // search for div.DraftEditor-root element
            await commentField.click('div.DraftEditor-root') // click reply element
            await commentField.type(kata + '\n' + [i + 1]) // input the word from the TweetComment.txt into reply section
            await passField.dispose()

            const [btnBalas] = await page.$x("//span[contains(., 'Balas')]") // search reply button **change 'Balas' into your language preference of 'Reply'**
            await btnBalas.click() // click the reply button
            await btnBalas.dispose()
            console.log(`Done ${i + 1}`) // the number of reply have done

            await page.goto('https://twitter.com/home', options);
            await page.goto(tweetlink, options)
        }

        console.log('Sukses Komen')

    } else {
        console.log('Login Gagal')
    }

    //await browser.close();
})();


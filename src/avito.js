import puppeteer from "puppeteer";
const avitoUrl = 'https://www.avito.ru/nizhniy_novgorod/avtomobili/s_probegom/levyy_rul-ASgBAQICAUSGFMjmAQFA8AoUrIoB?cd=1&f=ASgBAQICAkTyCrCKAYYUyOYBAUDwChSsigE&pmax=400000&pmin=300000&radius=0&user=1'
let page
let browser
let cardArray = []

class Cars {
  static async init () {
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process', // <- this one doesn't works in Windows
        '--disable-gpu',
      ]
    })
    page = await browser.newPage()
    await Promise.race([
      await page.goto(avitoUrl, { waitUntil: 'networkidle2'}).catch(()=> {}),
      await page.waitForSelector('.iva-item-root-G3n7v').catch(() => {})
    ])
  }
  static async resolve () {
    await this.init()
    const carURLs = await page.evaluate(() => {
    const cards = document.querySelectorAll('.iva-item-root-G3n7v')
    cardArray = Array.from(cards)
    const cardLinks = []
    cardArray.map(card => {
      const carLink = card.querySelector('.link-link-39EVK')
      const carTitle = card.querySelector('.iva-item-title-1Rmmj')
      const carImage = card.querySelector('.photo-slider-image-1fpZZ')
      const carMileage = card.querySelector('.iva-item-text-2xkfp')
      const carDate = card.querySelector('.date-text-2jSvU')
      const { host } = carLink
      const { protocol } = carLink
      const pathName = carLink.pathname
      const query = carLink.search
      const carURL = protocol + '//' + host + pathName + query
      cardLinks.push({
        carTitle: carTitle !== null ? carTitle.textContent : carTitle,
        carURL,
        carImage: carImage.src,
        carParams: carMileage !== null ? carMileage.textContent : carMileage,
        carDate: carDate !==null ? carDate.textContent : carDate,
      })
        
    })
    console.log('cardLinks ', cardLinks);
    return cardLinks
  })
  return carURLs
  }
  static async getCars () {
    const cars = await this.resolve()
    await browser.close()
    return cars
  }
}

export default Cars
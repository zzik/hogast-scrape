import puppeteer from "puppeteer"
import { connect, end, query } from "./sql.js"
;(async () => {
  //#region
  // ? setup
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  const start =
    "https://www.hogastjob.com/en/applicant/jobs.html?--hogast_jobportal-plugin_jobs%5B%40action%5D=index&--hogast_jobportal-plugin_jobs%5Bfilter%5D%5BcareerStatus%5D%5B0%5D%5B__identity%5D=c2109b4c-196d-47db-9ac1-51ab1a4ad296&--hogast_jobportal-plugin_jobs%5Bfilter%5D%5BlocationRadius%5D=50"
  await page.setViewport({ width: 1920, height: 1080 })
  await page.goto(start)

  const cookies = ".ch2-allow-all-btn"
  const accommodationToggle =
    'input[name="--hogast_jobportal-plugin_jobs[filter][accommodation]"'
  const filter = ".filter--listing-actions button"
  const nextPage = ".pagination--next a"

  await page.waitForSelector(cookies)
  await page.click(cookies)
  await page.waitForSelector(accommodationToggle)
  await page.$eval(accommodationToggle, (el) =>
    el.nextElementSibling.querySelector(".multiselect__element span").click()
  )
  await page.waitForSelector(filter)
  await page.$eval(filter, (el) => el.click())

  await page.waitForSelector(".search--listing-header h3")
  let jobAmount = await page.evaluate(() => {
    let title = document.querySelector(".search--listing-header h3")
    let titleText = title.innerText
    let lowercase = titleText.toLowerCase()
    let amount = lowercase.replace(" search results", "")
    return Math.floor(parseInt(amount) / 12)
  })
  //#endregion
  // ? end of setup

    connect()
    for (let i = 0; i < jobAmount; i++) {
      await page.waitForSelector(".job-card--link,.job-card-premium--link")

      const result = await page.evaluate(() => {
        const things = Array.from(
          document.querySelectorAll(".job-card--link,.job-card-premium--link")
        )
        const reform = things.map((el) => el.href)
        return reform
      })
      
      result.forEach((link) => {
        let statement = `INSERT INTO links (id, url) VALUES (NULL, '${link}')`
        console.log(link)
        query(statement)
      })
      
      await page.waitForSelector(nextPage)
      await page.$eval(nextPage, (el) => el.click())
    }
    end()
  //   await browser.close()
})()

//   await page.waitForNavigation({ waitUntil: "domcontentloaded" })

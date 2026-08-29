import { CommandContext } from '../types';
import { chromium } from 'playwright';
import { getLogger } from '@logtape/logtape';

const logger = getLogger(['commands', 'fpldeadline']);

export class FplDeadlineCommand {
  async execute(context: CommandContext): Promise<void> {
    const url = 'https://onsidearena.com/deadline';

    try {
      // Log the start of the process
      logger.info('Starting FPL deadline fetch.', { url });

      // Launch a headless browser instance using Playwright
      // Attempt to use the system-installed Chromium path if available (e.g., in Docker)
      const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || '/usr/bin/chromium-browser';
      logger.debug('Launching Playwright browser.', { executablePath });

      const browser = await chromium.launch({
        headless: true,
        executablePath // Pass the path to the system binary
      });
      const page = await browser.newPage();

      // Navigate to the target URL
      logger.debug('Navigating to page.', { url });
      await page.goto(url, { waitUntil: 'networkidle' }); // Wait until network is idle

      // Log page title and URL after navigation for context
      const pageTitle = await page.title();
      const finalUrl = page.url();
      logger.debug('Page loaded.', { title: pageTitle, finalUrl });

      // Extract the text content of the element with class '.deadline .date'
      logger.debug('Attempting to locate and extract deadline text.', {
        selector: '.deadline .date'
      });
      const dateText = await page.locator('.deadline .date').textContent();

      // Log the result of the text extraction attempt
      logger.debug('Deadline text extraction completed.', {
        extractedText: dateText !== null ? dateText : '<null>'
      });

      // Close the browser
      await browser.close();

      if (!dateText) {
        await context.message.reply('Could not find the FPL deadline on the page.');
        return;
      }

      // The text might be like "fri 4 sept, 18:30 bst"
      // Standardize the date string for parsing (e.g., "September 4, 2024 18:30:00")
      // Get the current year
      const currentYear = new Date().getFullYear();
      // Match the pattern: day_name, day, month, time, timezone
      // Example input: "fri 4 sept, 18:30 bst"
      // This regex captures: day (as number), month (as text), time (HH:MM)
      // The pattern is: non-digit chars (day name), digit(s) (day), space, alpha chars (month), comma optional space, digit:digit (time), space, alpha (tz)
      // More accurately: /^(\w+)\s+(\d+)\s+(\w+),\s+(\d{1,2}:\d{2})\s+\w+$/
      // This captures: day_name (e.g., fri), day (e.g., 4), month (e.g., sept), time (e.g., 18:30)
      const match = dateText.match(/^\w+\s+(\d+)\s+(\w+),\s+(\d{1,2}:\d{2})\s+\w+$/i);
      if (!match) {
        await context.message.reply(`Could not parse the date string: "${dateText}".`);
        return;
      }

      const [, dayStr, monthAbbr, timeStr] = match;
      const day = parseInt(dayStr, 10);
      const month = monthAbbr; // Month abbreviation like 'sept'
      const time = timeStr; // Time like '18:30'

      // Define a mapping for common month abbreviations to their numeric value (0-11)
      // This ensures the Date constructor receives a valid month name or number.
      // Standard JS Date constructor parses "Sep" but might be lenient with "Sept".
      // Let's normalize it.
      const monthMap: { [key: string]: string } = {
        jan: '01',
        feb: '02',
        mar: '03',
        apr: '04',
        may: '05',
        jun: '06',
        jul: '07',
        aug: '08',
        sep: '09',
        oct: '10',
        nov: '11',
        dec: '12',
        // Handle potential variations seen on the web
        january: '01',
        february: '02',
        march: '03',
        april: '04',
        june: '06',
        july: '07',
        august: '08',
        september: '09',
        october: '10',
        november: '11',
        december: '12',
        // Allow common abbreviations
        'jan.': '01',
        'feb.': '02',
        'mar.': '03',
        'apr.': '04',
        'jun.': '06',
        'jul.': '07',
        'aug.': '08',
        'sep.': '09',
        'sept.': '09',
        sept: '09', // Add 'sept' and 'sept.'
        'oct.': '10',
        'nov.': '11',
        'dec.': '12'
      };

      const normalizedMonthNum = monthMap[month.toLowerCase()];
      if (!normalizedMonthNum) {
        await context.message.reply(`Could not parse the month: "${month}".`);
        return;
      }

      // Interpret the parsed date/time as BST (British Summer Time, UTC+1).
      // Construct an ISO 8601 string representing the BST time and parse it as such.
      // This correctly sets the internal UTC timestamp of the Date object.
      // Example: If the site says "fri 4 sept, 18:30 bst", we construct "2024-09-04T18:30:00+01:00"
      // The Date constructor will then correctly interpret this as the corresponding UTC instant.
      // Using the numeric month: YYYY-MM-DDTHH:mm:ss+HH:mm
      const isoString = `${currentYear}-${normalizedMonthNum}-${day.toString().padStart(2, '0')}T${time}:00+01:00`;

      const deadlineDate = new Date(isoString);

      if (isNaN(deadlineDate.getTime())) {
        // If parsing failed, try alternative formats or handle error
        await context.message.reply(`Could not parse the date string: "${dateText}".`);
        return;
      }

      // Convert to Unix timestamps (seconds since epoch) for Discord
      const unixTimestamp = Math.floor(deadlineDate.getTime() / 1000);

      // Format the message using Discord's timestamp format
      // <t:TIMESTAMP:FORMAT>
      // FORMAT can be 'f' (full), 'd' (date), 't' (time), 'R' (relative), 'D' (long date), 'T' (long time)
      const fullDateTime = `<t:${unixTimestamp}:f>`; // Full date and time
      const relativeTime = `<t:${unixTimestamp}:R>`; // Relative time (e.g., in 2 days)

      const message = `The next FPL deadline is: ${fullDateTime} (${relativeTime}).`;

      await context.message.reply(message);
    } catch (error) {
      // Log the error with more context
      logger.error('Error fetching FPL deadline.', {
        error:
          error instanceof Error
            ? { name: error.name, message: error.message, stack: error.stack }
            : String(error)
      });
      await context.message.reply('An error occurred while fetching the FPL deadline.');
    }
  }
}

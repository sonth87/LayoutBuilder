import juice from "juice";
import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer";
import { OrientationType, PageSizeCustomType, PageSizeType } from "../types";
import { ORIENTATION, PAGE_SIZE } from "../constant";

export const exportInlineHtml = ({
  html,
  css,
}: {
  html: string;
  css: string;
}): string | null => {
  try {
    // merge html và css
    const combinedHtml = `${html}<style>${css}</style>`;
    const inlinedHtml = juice(combinedHtml);
    return inlinedHtml;
  } catch (error) {
    console.error("EXPORT::Error inlining HTML:", error);
    return null;
  }
};

export const exportPdf = async ({
  html,
  css,
  orientation = ORIENTATION.portrait,
  pageSize = PAGE_SIZE.A4,
}: {
  html: string;
  css: string;
  orientation?: OrientationType;
  pageSize?: PageSizeType | PageSizeCustomType;
}): Promise<Buffer | null> => {
  let browser;
  try {
    browser = await puppeteer.launch({
      // args: chromium.args,
      // defaultViewport: chromium.defaultViewport,
      // executablePath: await chromium.executablePath,
      // headless: chromium.headless,
      // dumpio: true,
      timeout: 60000,
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();

    // Set HTML and CSS
    const fullHtml = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>${css}</style>
              </head>
              <body>
                ${html}
              </body>
            </html>
          `;

    await page.setContent(fullHtml, { waitUntil: "networkidle0" });

    const isNormal = typeof pageSize === "string";

    // Generate PDF buffer
    const pdfBuffer = await page.pdf({
      format: isNormal ? pageSize || PAGE_SIZE.A4 : PAGE_SIZE.A4,
      printBackground: true,
      landscape: orientation === ORIENTATION.landscape,
      width:
        !isNormal && pageSize?.width
          ? `${pageSize.width}${pageSize.unit || "px"}`
          : undefined,
      height:
        !isNormal && pageSize?.height
          ? `${pageSize.height}${pageSize.unit || "px"}`
          : undefined,
      margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
    });

    return pdfBuffer;
  } catch (error) {
    console.error("EXPORT::Error generating PDF:", error);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

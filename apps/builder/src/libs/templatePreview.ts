export const templatePreview = ({
  name,
  slug,
  html,
  css,
}: {
  name?: string;
  slug?: string;
  html?: string;
  css?: string;
}) => {
  if (html) {
    const newWindow = window?.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Preview: ${name}</title>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                .preview-header { 
                  background: #f8f9fa; 
                  padding: 10px 20px; 
                  margin: -20px -20px 20px -20px; 
                  border-bottom: 1px solid #dee2e6;
                }
              </style>
            </head>
            <body>
              <div class="preview-header">
                <h1>Preview: ${name}</h1>
                <p>Template Slug: ${slug}</p>
              </div>
              <div style="position: relative;background-image: url('/images/phoi cu nhan.jpg');background-repeat: no-repeat;background-size: contain;">
                ${html}
              </div>
              <style>${css}</style>
            </body>
          </html>
        `);
      newWindow.document.close();
    }
  }
};

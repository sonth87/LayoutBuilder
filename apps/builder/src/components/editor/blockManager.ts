export const blockManager = {
  appendTo: ".blocks-container",
  blocks: [
    // Layout Components
    {
      id: "section",
      label: "<b>Section</b>",
      category: "Layout",
      attributes: { class: "gjs-block-section" },
      content: `<section style="padding: 20px;">
              <h1>This is a simple title</h1>
              <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
            </section>`,
    },
    {
      id: "column1",
      label: "1 Column",
      category: "Layout",
      content:
        "<div class=\"row\"><div class=\"col-12\" style=\"padding: 20px; border: 1px dashed #ccc;\">Column content</div></div>",
    },
    {
      id: "column2",
      label: "2 Columns",
      category: "Layout",
      content:
        "<div class=\"row\"><div class=\"col-6\" style=\"padding: 20px; border: 1px dashed #ccc;\">Column 1</div><div class=\"col-6\" style=\"padding: 20px; border: 1px dashed #ccc;\">Column 2</div></div>",
    },
    {
      id: "column3",
      label: "3 Columns",
      category: "Layout",
      content:
        "<div class=\"row\"><div class=\"col-4\" style=\"padding: 20px; border: 1px dashed #ccc;\">Column 1</div><div class=\"col-4\" style=\"padding: 20px; border: 1px dashed #ccc;\">Column 2</div><div class=\"col-4\" style=\"padding: 20px; border: 1px dashed #ccc;\">Column 3</div></div>",
    },

    // Basic Components
    {
      id: "text",
      label: "Text",
      category: "Basic",
      content:
        "<div data-gjs-type=\"text\" style=\"padding: 10px;\">Insert your text here</div>",
    },
    {
      id: "button",
      label: "Button",
      category: "Basic",
      content:
        "<button class=\"btn btn-primary\" style=\"padding: 10px 20px; margin: 10px;\">Click me</button>",
    },
    {
      id: "link",
      label: "Link",
      category: "Basic",
      content:
        "<a href=\"#\" style=\"color: #007bff; text-decoration: underline;\">Link text</a>",
    },
    {
      id: "image",
      label: "Image",
      category: "Media",
      select: true,
      content: {
        type: "image",
        style: {
          width: "100%",
          height: "auto",
        },
      },
      activate: true,
    },
    {
      id: "video",
      label: "Video",
      category: "Media",
      content: {
        type: "video",
        src: "img/video2.webm",
        style: {
          height: "350px",
          width: "100%",
          maxWidth: "615px",
        },
      },
    },

    // Form Components
    {
      id: "form",
      label: "Form",
      category: "Forms",
      content: `<form style="padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
              <div class="form-group" style="margin-bottom: 15px;">
                <label for="name" style="display: block; margin-bottom: 5px; font-weight: bold;">Name</label>
                <input type="text" class="form-control" id="name" placeholder="Enter name" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
              <div class="form-group" style="margin-bottom: 15px;">
                <label for="email" style="display: block; margin-bottom: 5px; font-weight: bold;">Email</label>
                <input type="email" class="form-control" id="email" placeholder="Enter email" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
              </div>
              <button type="submit" class="btn btn-primary" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Submit</button>
            </form>`,
    },
    {
      id: "input",
      label: "Input",
      category: "Forms",
      content:
        "<input type=\"text\" placeholder=\"Enter text\" class=\"form-control\" style=\"width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin: 10px 0;\">",
    },
    {
      id: "textarea",
      label: "Textarea",
      category: "Forms",
      content:
        "<textarea placeholder=\"Enter your message\" class=\"form-control\" rows=\"4\" style=\"width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin: 10px 0; resize: vertical;\"></textarea>",
    },
    {
      id: "select",
      label: "Select",
      category: "Forms",
      content: `<select class="form-control" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin: 10px 0;">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>`,
    },
    {
      id: "checkbox",
      label: "Checkbox",
      category: "Forms",
      content: `<div style="margin: 10px 0;">
              <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="checkbox" style="margin-right: 8px;">
                <span>Checkbox option</span>
              </label>
            </div>`,
    },
    {
      id: "radio",
      label: "Radio",
      category: "Forms",
      content: `<div style="margin: 10px 0;">
              <label style="display: flex; align-items: center; cursor: pointer; margin-bottom: 5px;">
                <input type="radio" name="radio-group" style="margin-right: 8px;">
                <span>Radio option 1</span>
              </label>
              <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="radio" name="radio-group" style="margin-right: 8px;">
                <span>Radio option 2</span>
              </label>
            </div>`,
    },
  ],
};

import hljs from "highlight.js";

export const createPreCode = (message: string) => {
  const pre = document.createElement("pre");
  pre.classList.add("pre_code");

  const supportedLangs = [
    "cs",
    "css",
    "go",
    "html",
    "js",
    "json",
    "jsx",
    "md",
    "py",
    "sass",
    "scss",
    "ts",
    "tsx",
    "vue",
    "xaml",
    "xml",
    "php",
  ];
  const code = document.createElement("code");

  const matchCode = message.match(`\`((.|/n)*)\``);
  
  if (matchCode) {
    const codeFromMessage = matchCode[1];
    const codeSplit = codeFromMessage.split(" ");
    const codeLang = codeSplit[0].toLocaleLowerCase();
    const codeBlock = codeSplit.slice(1).join(" ");

    if (supportedLangs.includes(codeLang)) {
      const highlight = hljs.highlight(codeBlock, {
        language: codeLang,
      }).value;
      code.innerHTML = highlight;
    } else {
      if (codeBlock.length > 100) {
        code.appendChild(
          document.createTextNode("Codeblock too long, please submit a gist.")
        );
      } else {
        code.appendChild(
          document.createTextNode(
            `Codeblock supported langs: [${supportedLangs.join(", ")}]`
          )
        );
      }
    }
  }

  pre.appendChild(code);
  return pre;
};

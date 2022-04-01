import hljs from "highlight.js";
import prettier from "prettier";
import babel from "prettier/parser-babel";
import html from "prettier/parser-html";
import postcss from "prettier/parser-postcss";
import typescript from "prettier/parser-typescript";

export const createPreCode = (message: string) => {
  const pre = document.createElement("pre");
  pre.classList.add("pre_code");

  const supportedLangs = ["cs", "css", "html", "js", "sass", "scss", "ts"];
  const supportedParsers = ["css", "html", "js", "sass", "scss", "ts"];
  const parsers: Record<string, string> = {
    css: "css",
    sass: "css",
    scss: "css",
    js: "babel",
    html: "html",
    ts: "typescript",
  };

  const code = document.createElement("code");

  const matchCode = message.match(`\`((.|/n)*)\``);

  if (matchCode) {
    const codeFromMessage = matchCode[1];
    const codeSplit = codeFromMessage.split(" ");
    const codeLang = codeSplit[0].toLocaleLowerCase();
    const codeBlock = codeSplit.slice(1).join(" ");

    if (supportedLangs.includes(codeLang)) {
      let formatCodeBlock: string | null = null;
      if (supportedParsers.includes(codeLang)) {
        formatCodeBlock = prettier.format(codeBlock, {
          parser: parsers[codeLang],
          plugins: [babel, postcss, html, typescript],
        });
      }

      const highlight = hljs.highlight(
        formatCodeBlock ? formatCodeBlock : codeBlock,
        {
          language: codeLang,
        }
      ).value;
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

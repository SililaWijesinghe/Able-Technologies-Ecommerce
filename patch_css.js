const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

const keyframes = `  --animate-gradient: gradient 8s ease infinite;
  @keyframes gradient {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
`;

css = css.replace(/--font-poppins: "Poppins", sans-serif;/, '--font-poppins: "Poppins", sans-serif;\n' + keyframes);

fs.writeFileSync('src/index.css', css);
console.log("Patched index.css");

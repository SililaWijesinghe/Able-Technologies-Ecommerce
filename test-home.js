const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

content = content.replace(
  'className="relative w-full min-h-[550px] md:h-[600px] bg-[#0b1042] overflow-hidden flex flex-col justify-center bg-cover bg-center bg-no-repeat pb-10 md:pb-0"',
  'className="relative w-full min-h-[700px] md:h-[800px] bg-[#04081c] overflow-hidden flex flex-col justify-center bg-cover bg-center bg-no-repeat pb-10 md:pb-0"'
);

content = content.replace(
  '<div className="absolute inset-0 bg-gradient-to-r from-[#060a2b] via-[#0b1042]/90 md:via-[#0b1042]/95 to-transparent z-0 w-full md:w-[75%]"></div>',
  `<div className="absolute inset-0 bg-gradient-to-r from-[#020516] via-[#080d35]/80 to-transparent z-0 w-full"></div>
        <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-red-600/20 via-red-900/10 to-transparent z-0 mix-blend-screen pointer-events-none"></div>
        <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] pointer-events-none mix-blend-screen z-0"></div>`
);

content = content.replace(
  '<div className="relative z-20 max-w-7xl mx-auto px-6 w-full flex flex-col pt-8 md:pt-12">',
  '<div className="relative z-20 max-w-7xl mx-auto px-6 w-full flex flex-col pt-24 md:pt-[240px]">'
);

fs.writeFileSync('src/pages/Home.tsx', content);

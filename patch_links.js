const fs = require('fs');

const replaceInFile = (file) => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace inline dynamic hrefs for whatsapp
    content = content.replace(/href=\{`https:\/\/wa\.me\/[^}]+\}/g, 'href="https://wa.me/94778692075"');
    
    // Replace variable assigned whatsapp URL
    content = content.replace(/const whatsappUrl = `https:\/\/wa\.me\/[^`]+`;/g, "const whatsappUrl = 'https://wa.me/94778692075';");
    
    // Replace inline dynamic hrefs for tel
    content = content.replace(/href=\{`tel:\+\$\{[^}]+\}`\}/g, 'href="tel:+94778692075"');
    content = content.replace(/href=\{`tel:\$\{[^}]+\}`\}/g, 'href="tel:+94778692075"');
    
    // Replace the assignments from settings context just to be perfectly sure
    content = content.replace(/const whatsappNumber = settings\?\.whatsapp_number[^;]+;/g, "const whatsappNumber = '94778692075';");
    content = content.replace(/const phoneNumber = settings\?\.whatsapp_number[^;]+;/g, "const phoneNumber = '94778692075';");

    fs.writeFileSync(file, content);
};

['src/components/Header.tsx', 'src/components/FloatingControls.tsx', 'src/components/Footer.tsx', 'src/components/cart/CartDrawer.tsx', 'src/components/contact/ContactFormSection.tsx'].forEach(replaceInFile);

console.log('Replaced all dynamic links with hardcoded 94778692075');

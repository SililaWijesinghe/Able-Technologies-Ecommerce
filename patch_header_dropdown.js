const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Replace the generic navLinks map
code = code.replace(
  /\{ name: 'About Us', path: '\/about' \},/,
  `{ name: 'About Us', dropdown: [
      { name: 'About Able Technologies', path: '/about' },
      { name: 'Our Industrial Solutions', path: '/industrial-solutions' }
    ] },`
);

// We need to render the dropdown for desktop.
// Finding the navLinks.map in desktop header
const desktopNav = `              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link 
                    key={link.name} 
                    id={link.id}
                    to={link.path} 
                    onClick={link.available === false ? handleComingSoon : undefined}
                    className="relative px-2 py-2 text-[15px] font-semibold text-white/90 hover:text-white transition-all hover:-translate-y-0.5 group/link tracking-wide"
                  >
                    {link.name}
                    {/* Active State Indicator - Futuristic Cyan Underline */}
                    {active && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full h-[3px] bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                    )}
                    {/* Hover State Indicator */}
                    {!active && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-cyan-400/50 rounded-full transition-all duration-300 group-hover/link:w-full" />
                    )}
                  </Link>
                );
              })}`;

const newDesktopNav = `              {navLinks.map((link) => {
                const active = link.path ? isActive(link.path) : (link.dropdown?.some(d => isActive(d.path)));
                
                if (link.dropdown) {
                  return (
                    <div key={link.name} className="relative group/dropdown py-2">
                      <button className="flex items-center space-x-1 px-2 text-[15px] font-semibold text-white/90 hover:text-white transition-all hover:-translate-y-0.5 group/link tracking-wide outline-none">
                        <span>{link.name}</span>
                        <svg className="w-4 h-4 transition-transform group-hover/dropdown:rotate-180 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        {active && (
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full h-[3px] bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                        )}
                        {!active && (
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-cyan-400/50 rounded-full transition-all duration-300 group-hover/link:w-full" />
                        )}
                      </button>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-[#0b1042]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200 transform origin-top scale-95 group-hover/dropdown:scale-100 flex flex-col py-2 z-50">
                        {link.dropdown.map(dropItem => (
                          <Link 
                            key={dropItem.name} 
                            to={dropItem.path} 
                            className="px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            {dropItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link 
                    key={link.name} 
                    id={link.id}
                    to={link.path!} 
                    onClick={link.available === false ? handleComingSoon : undefined}
                    className="relative px-2 py-2 text-[15px] font-semibold text-white/90 hover:text-white transition-all hover:-translate-y-0.5 group/link tracking-wide"
                  >
                    {link.name}
                    {active && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full h-[3px] bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                    )}
                    {!active && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-cyan-400/50 rounded-full transition-all duration-300 group-hover/link:w-full" />
                    )}
                  </Link>
                );
              })}`;

code = code.replace(desktopNav, newDesktopNav);

// Find navLinks.map in mobile header
const mobileNav = `                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    onClick={(e) => { 
                      if (link.available === false) { handleComingSoon(e); return; }
                      setIsMobileMenuOpen(false); 
                    }}
                    className="text-gray-300 hover:text-cyan-300 hover:bg-white/5 px-4 py-3 rounded-xl text-lg font-medium transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}`;

const newMobileNav = `                {navLinks.map((link) => {
                  if (link.dropdown) {
                    return (
                      <div key={link.name} className="flex flex-col space-y-1">
                        <div className="text-gray-400 px-4 py-2 text-sm font-bold uppercase tracking-wider">{link.name}</div>
                        {link.dropdown.map(dropItem => (
                          <Link 
                            key={dropItem.name} 
                            to={dropItem.path} 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-gray-300 hover:text-cyan-300 hover:bg-white/5 pl-8 pr-4 py-3 rounded-xl text-lg font-medium transition-colors flex items-center"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mr-3"></span>
                            {dropItem.name}
                          </Link>
                        ))}
                      </div>
                    );
                  }
                  
                  return (
                    <Link 
                      key={link.name} 
                      to={link.path!} 
                      onClick={(e) => { 
                        if (link.available === false) { handleComingSoon(e); return; }
                        setIsMobileMenuOpen(false); 
                      }}
                      className="text-gray-300 hover:text-cyan-300 hover:bg-white/5 px-4 py-3 rounded-xl text-lg font-medium transition-colors"
                    >
                      {link.name}
                    </Link>
                  );
                })}`;

code = code.replace(mobileNav, newMobileNav);

fs.writeFileSync('src/components/Header.tsx', code);
console.log("Patched Header.tsx for dropdown!");
